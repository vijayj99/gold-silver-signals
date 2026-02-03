// lib/mt5-api.ts
import MetaApi from 'metaapi.cloud-sdk';

interface MT5Price {
    symbol: string;
    bid: number;
    ask: number;
    price: number; // mid price
}

export class MT5Service {
    private static api: MetaApi | null = null;
    private static initialized = false;

    /**
     * Initialize MetaAPI connection (reusable across requests)
     */
    private static async init() {
        if (this.initialized) return;

        const token = process.env.META_API_TOKEN || process.env.NEXT_PUBLIC_META_API_TOKEN;
        if (!token) {
            console.warn('⚠️ MT5: META_API_TOKEN not configured');
            return;
        }

        try {
            this.api = new MetaApi(token);
            this.initialized = true;
            console.log('✅ MT5: MetaAPI initialized');
        } catch (error) {
            console.error('❌ MT5: Failed to initialize MetaAPI:', error);
        }
    }

    /**
     * Get real-time price from MT5 account
     */
    static async getPrice(symbol: string): Promise<MT5Price | null> {
        await this.init();

        if (!this.api) {
            return null;
        }

        const accountId = process.env.MT5_ACCOUNT_ID || process.env.NEXT_PUBLIC_MT5_ACCOUNT_ID;
        if (!accountId) {
            console.warn('⚠️ MT5: MT5_ACCOUNT_ID not configured');
            return null;
        }

        try {
            const account = await this.api.metatraderAccountApi.getAccount(accountId);

            // Check if account is connected
            if (account.state !== 'DEPLOYED') {
                console.log(`⏳ MT5: Account deploying... (state: ${account.state})`);
                // Deploy if not deployed
                await account.deploy();
                await account.waitDeployed();
            }

            // Connect to terminal
            const connection = account.getRPCConnection();
            await connection.connect();
            await connection.waitSynchronized();

            // Get symbol price
            const price = await connection.getSymbolPrice(symbol);

            if (price && price.bid && price.ask) {
                const midPrice = (price.bid + price.ask) / 2;
                console.log(`✅ MT5: ${symbol} = $${midPrice.toFixed(2)} (bid: ${price.bid}, ask: ${price.ask})`);

                return {
                    symbol,
                    bid: price.bid,
                    ask: price.ask,
                    price: midPrice
                };
            }

            return null;
        } catch (error: any) {
            console.error(`❌ MT5: Failed to get ${symbol} price:`, error.message);
            return null;
        }
    }

    /**
     * Get OHLC candles from MT5
     */
    static async getCandles(symbol: string, timeframe = '15m', limit = 30): Promise<any[] | null> {
        await this.init();

        if (!this.api) return null;

        const accountId = process.env.MT5_ACCOUNT_ID || process.env.NEXT_PUBLIC_MT5_ACCOUNT_ID;
        if (!accountId) return null;

        try {
            const account = await this.api.metatraderAccountApi.getAccount(accountId);
            const connection = account.getRPCConnection();
            await connection.connect();
            await connection.waitSynchronized();

            // Get candle (MT5 uses getCandle singular)
            const candles = await connection.getCandle(symbol, timeframe, limit);

            if (candles && candles.length > 0) {
                console.log(`✅ MT5: Retrieved ${candles.length} candles for ${symbol}`);
                return candles;
            }

            return null;
        } catch (error: any) {
            console.error(`❌ MT5: Failed to get candles:`, error.message);
            return null;
        }
    }
}
