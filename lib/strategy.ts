// lib/strategy.ts
import { MarketService } from './market';

export enum SignalType {
    BUY = 'BUY',
    SELL = 'SELL',
    NEUTRAL = 'NEUTRAL',
}

export interface Signal {
    symbol: string;
    type: SignalType;
    price: number;
    time: string;
    reason: string;
}

export class StrategyEngine {
    static async evaluate(symbol: string): Promise<Signal | null> {
        const session = MarketService.getCurrentSession();
        // Rule: Avoid Asian session for entries (mostly fake moves)
        if (session === 'ASIA' || session === 'OTHER') return null;

        // --- LAYER 1: TREND FILTER (1H Timeframe) ---
        const candles1H = await MarketService.getCandles(symbol, 250, '1h');
        if (!candles1H || candles1H.length < 200) return null;

        const closes1H = candles1H.map(c => c.close);
        const ema50_1h = MarketService.calculateEMA(closes1H, 50).pop() || 0;
        const ema200_1h = MarketService.calculateEMA(closes1H, 200).pop() || 0;

        const isTrendUp = ema50_1h > ema200_1h;
        const isTrendDown = ema50_1h < ema200_1h;

        // --- LAYER 2: LIQUIDITY / ZONE FILTER (15m Timeframe) ---
        const candles15m = await MarketService.getCandles(symbol, 50, '15min');
        if (!candles15m || candles15m.length < 20) return null;

        const current = candles15m[candles15m.length - 1];
        const prev = candles15m[candles15m.length - 2];
        const levels = await MarketService.getLiquidityLevels(symbol);

        // --- LAYER 3: MOMENTUM CONFIRMATION & RSI ---
        // RSI Logic: Cross above 40-55 zone for BUY, Cross below 45-60 zone for SELL
        const rsiCrossUp = prev.rsi < 45 && current.rsi > 45;
        const rsiCrossDown = prev.rsi > 55 && current.rsi < 55;

        // --- BUY LOGIC (XAUUSD STRONG MIX) ---
        if (isTrendUp) {
            const liquidSweepDown = prev.low < levels.prevDayLow || prev.low < levels.asianLow;
            const bullishRejection = current.close > current.open && current.close > prev.high; // Strong close/Engulfing

            // Near EMA50 proximity check
            const nearEMA50 = Math.abs(current.close - ema50_1h) < (symbol === 'XAUUSD' ? 5 : 0.5);

            if (liquidSweepDown && bullishRejection && rsiCrossUp && nearEMA50) {
                const entryPrice = current.close;
                const stopLoss = prev.low - (symbol === 'XAUUSD' ? 1.5 : 0.1);
                const tp1 = entryPrice + (entryPrice - stopLoss) * 1;
                const tp2 = entryPrice + (entryPrice - stopLoss) * 2;

                return {
                    symbol,
                    type: SignalType.BUY,
                    price: entryPrice,
                    time: new Date().toLocaleTimeString(),
                    reason: `🌟 STRONG MIX BUY: 1H Trend UP. Liquidity sweep detected below ${prev.low.toFixed(2)}. RSI reversal + Bullish momentum confirmed at EMA 50 zone.`,
                    tp: parseFloat(tp2.toFixed(2)),
                    tp1: parseFloat(tp1.toFixed(2)),
                    sl: parseFloat(stopLoss.toFixed(2))
                } as any;
            }
        }

        // --- SELL LOGIC (XAUUSD STRONG MIX) ---
        if (isTrendDown) {
            const liquidSweepUp = prev.high > levels.prevDayHigh || prev.high > levels.asianHigh;
            const bearishRejection = current.close < current.open && current.close < prev.low; // Strong close/Engulfing
            const nearEMA50 = Math.abs(current.close - ema50_1h) < (symbol === 'XAUUSD' ? 5 : 0.5);

            if (liquidSweepUp && bearishRejection && rsiCrossDown && nearEMA50) {
                const entryPrice = current.close;
                const stopLoss = prev.high + (symbol === 'XAUUSD' ? 1.5 : 0.1);
                const tp1 = entryPrice - (stopLoss - entryPrice) * 1;
                const tp2 = entryPrice - (stopLoss - entryPrice) * 2;

                return {
                    symbol,
                    type: SignalType.SELL,
                    price: entryPrice,
                    time: new Date().toLocaleTimeString(),
                    reason: `🔥 STRONG MIX SELL: 1H Trend DOWN. Liquidity sweep detected above ${prev.high.toFixed(2)}. RSI rejection + Bearish momentum confirmed at EMA 50 zone.`,
                    tp: parseFloat(tp2.toFixed(2)),
                    tp1: parseFloat(tp1.toFixed(2)),
                    sl: parseFloat(stopLoss.toFixed(2))
                } as any;
            }
        }

        return null;
    }
}
