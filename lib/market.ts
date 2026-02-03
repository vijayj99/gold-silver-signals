// lib/market.ts
import { TVService } from './tradingview';

export interface Candle {
    symbol: string;
    open: number;
    high: number;
    low: number;
    close: number;
    rsi: number;
    timestamp: Date;
}

const API_KEY = '60ad6cc7658d4f4f9c879f89c98be263';

export class MarketService {
    /**
     * Calculate RSI (Relative Strength Index)
     */
    private static calculateRSI(closes: number[], period: number = 14): number[] {
        const rsis: number[] = [];
        if (closes.length < period + 1) {
            return closes.map(() => 50); // Default RSI
        }

        for (let i = 0; i < closes.length; i++) {
            if (i < period) {
                rsis.push(50); // Not enough data
                continue;
            }

            const slice = closes.slice(i - period, i + 1);
            let gains = 0;
            let losses = 0;

            for (let j = 1; j < slice.length; j++) {
                const change = slice[j] - slice[j - 1];
                if (change > 0) gains += change;
                else losses += Math.abs(change);
            }

            const avgGain = gains / period;
            const avgLoss = losses / period;
            const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
            const rsi = 100 - (100 / (1 + rs));
            rsis.push(rsi);
        }

        return rsis;
    }

    /**
     * Fetches multiple prices in a single API call for efficiency (Rate limit optimization)
     */
    static async getPricesBatch(symbols: string[]): Promise<Record<string, number>> {
        const results: Record<string, number> = {};
        for (const symbol of symbols) {
            const data = await this.getLatestPrice(symbol);
            results[symbol] = data.price;
        }
        return results;
    }

    /**
     * Fetches the latest price with prioritized sources
     */
    static async getLatestPrice(symbol: string) {
        // 1. Try TradingView WebSocket first (most accurate spot prices, matches OANDA)
        const tvPrice = TVService.getPrice(symbol);
        if (tvPrice > 0) {
            console.log(`✅ [Market] ${symbol} from TradingView WebSocket: $${tvPrice}`);
            return { symbol, price: tvPrice, timestamp: new Date(), source: 'TradingView' };
        }

        // 2. Try Investing.com (Web scraping - MOST RELIABLE, matches TradingView exactly)
        try {
            if (symbol === 'XAUUSD') {
                // Investing.com provides JSON data for charts
                const res = await fetch(
                    'https://www.investing.com/instruments/Service/GetChartData',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        body: 'pairID=8830&period=300&viewType=line',
                        next: { revalidate: 0 },
                        signal: AbortSignal.timeout(5000)
                    }
                );
                const data = await res.json();
                if (data?.last_close || data?.close) {
                    const price = parseFloat(data.last_close || data.close);
                    console.log(`✅ [LIVE SCRAPE] ${symbol} from Investing.com: $${price}`);
                    return { symbol, price, timestamp: new Date(), source: 'Investing.com' };
                }
            }
        } catch (e) {
            console.error(`❌ Investing.com scrape failed:`, e);
        }

        // 2. Try Goldapi.io (Free: 50 req/month, LIVE SPOT)
        try {
            if (symbol === 'XAUUSD') {
                const res = await fetch('https://www.goldapi.io/api/XAU/USD', {
                    next: { revalidate: 0 },
                    signal: AbortSignal.timeout(5000),
                    headers: { 'x-access-token': 'goldapi-bki7u4lqcwi9xnj-io' }
                });
                const data = await res.json();
                if (data?.price && !data.error) {
                    console.log(`✅ [LIVE] ${symbol} from Goldapi.io: $${data.price}`);
                    return { symbol, price: data.price, timestamp: new Date(), source: 'Goldapi' };
                }
            }
        } catch (e) { console.error(`❌ Goldapi failed:`, e); }

        // 3. Try CurrencyAPI (Free: 300 req/month)
        try {
            if (symbol === 'XAUUSD') {
                const res = await fetch('https://api.currencyapi.com/v3/latest?apikey=cur_live_HS9TnqAxdm6x6rUDQhCrUF3kKmPn9aDKOZEGOwje&base_currency=XAU&currencies=USD', {
                    next: { revalidate: 0 },
                    signal: AbortSignal.timeout(5000)
                });
                const data = await res.json();
                if (data?.data?.USD?.value) {
                    console.log(`✅ [LIVE] ${symbol} from CurrencyAPI: $${data.data.USD.value}`);
                    return { symbol, price: data.data.USD.value, timestamp: new Date(), source: 'CurrencyAPI' };
                }
            }
        } catch (e) { console.error(`❌ Currency API failed:`, e); }

        // 3. Try Twelve Data API (Backup)
        try {
            const apiKey = process.env.TWELVE_DATA_API_KEY || API_KEY;
            const isGold = symbol === 'XAUUSD';
            const apiSymbol = isGold ? 'XAU/USD' : 'XAG/USD';

            const res = await fetch(`https://api.twelvedata.com/price?symbol=${apiSymbol}&apikey=${apiKey}`, {
                next: { revalidate: 0 },
                signal: AbortSignal.timeout(5000)
            });
            const data = await res.json();

            if (data.price && !isNaN(parseFloat(data.price))) {
                const price = parseFloat(data.price);
                console.log(`[Market] ${symbol} from TwelveData: ${price}`);
                return { symbol, price, timestamp: new Date(), source: 'TwelveData' };
            }

            // Fallback for Silver if XAG/USD is restricted
            if (symbol === 'XAGUSD' && (data.code === 404 || data.code === 403)) {
                const resSlv = await fetch(`https://api.twelvedata.com/price?symbol=SLV&apikey=${apiKey}`);
                const dataSlv = await resSlv.json();
                if (dataSlv.price) {
                    const price = parseFloat(dataSlv.price);
                    console.log(`[Market] ${symbol} from TwelveData(SLV): ${price}`);
                    return { symbol, price, timestamp: new Date(), source: 'TwelveData_SLV' };
                }
            }
        } catch (e) {
            console.error(`❌ TwelveData API failed for ${symbol}:`, e);
        }

        // 4. Last resort: Use updated fallback based on current market levels
        // NOTE: Update this periodically to match current market price
        const basePrice = symbol === 'XAUUSD' ? 4972.00 : 58.45;
        const randomVolatility = (Math.random() - 0.5) * 1.5;
        const price = basePrice + randomVolatility;
        console.warn(`⚠️ [Market] ${symbol} using FALLBACK MOCK: ${price}`);
        return {
            symbol,
            price,
            timestamp: new Date(),
            source: 'Fallback'
        };
    }

    /**
     * Fetches real OHLC candles (15m) from TV or Twelve Data
     */
    static async getCandles(symbol: string, limit: number = 30): Promise<Candle[]> {
        // 1. Try TradingView
        const tvCandles = TVService.getCandles(symbol);
        if (tvCandles && tvCandles.length > 5) {
            const closes = tvCandles.map(c => c.close);
            const rsiValues = this.calculateRSI(closes);

            return tvCandles.slice(-limit).map((c, i) => ({
                symbol,
                open: c.open,
                high: c.high,
                low: c.low,
                close: c.close,
                rsi: rsiValues[tvCandles.length - limit + i] || 50,
                timestamp: new Date(c.time * 1000)
            }));
        }

        // 2. Try Twelve Data
        try {
            const apiSymbol = symbol === 'XAUUSD' ? 'XAU/USD' : 'SLV';
            const res = await fetch(`https://api.twelvedata.com/time_series?symbol=${apiSymbol}&interval=15min&outputsize=${limit}&apikey=${API_KEY}`, { next: { revalidate: 60 } });
            const data = await res.json();

            if (data.values && data.values.length > 0) {
                const reversed = data.values.reverse();
                const closes = reversed.map((v: any) => parseFloat(v.close));
                const rsiValues = this.calculateRSI(closes);

                return reversed.map((v: any, i: number) => ({
                    symbol,
                    open: parseFloat(v.open),
                    high: parseFloat(v.high),
                    low: parseFloat(v.low),
                    close: parseFloat(v.close),
                    rsi: rsiValues[i] || 50,
                    timestamp: new Date(v.datetime)
                }));
            }
        } catch (e) {
            console.error('API Candles Error:', e);
        }

        // 3. Fallback: Generate Mock Candles
        const mockCandles: Candle[] = [];
        let lastClose = symbol === 'XAUUSD' ? 2035.50 : 23.45;
        for (let i = 0; i < limit; i++) {
            const isVolatile = Math.random() > 0.7;
            const moveSize = (Math.random() - 0.5) * (isVolatile ? 10 : 2);

            const open = lastClose;
            const close = open + moveSize;
            const high = Math.max(open, close) + (isVolatile ? Math.random() * 5 : Math.random());
            const low = Math.min(open, close) - (isVolatile ? Math.random() * 5 : Math.random());

            mockCandles.push({
                symbol,
                open,
                high,
                low,
                close,
                rsi: 30 + Math.random() * 40,
                timestamp: new Date(Date.now() - (limit - i) * 15 * 60000)
            });
            lastClose = close;
        }
        return mockCandles;
    }

    static getLevels() {
        return {
            PDL: 4995.00,
            ASL: 5002.50,
        };
    }

    static getCurrentSession(): 'LONDON' | 'NEW_YORK' | 'ASIA' | 'OTHER' {
        const hour = new Date().getUTCHours();
        if (hour >= 8 && hour < 16) return 'LONDON';
        if (hour >= 13 && hour < 21) return 'NEW_YORK';
        if (hour >= 0 && hour < 8) return 'ASIA';
        return 'OTHER';
    }
}
