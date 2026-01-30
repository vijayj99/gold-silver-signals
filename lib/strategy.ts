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
        // Allow LONDON, NEW_YORK and ASIA for more frequency in demo, but usually LDN/NY are best
        const isActiveSession = ['LONDON', 'NEW_YORK', 'ASIA'].includes(session);
        if (!isActiveSession) return null;

        const candles = await MarketService.getCandles(symbol, 10);
        if (!candles || candles.length < 5) return null;

        // Mock levels if not purely PDL/ASL
        const levels = {
            resistance: Math.max(...candles.map(c => c.high).slice(0, -1)),
            support: Math.min(...candles.map(c => c.low).slice(0, -1))
        };

        const current = candles[candles.length - 1];
        const prev = candles[candles.length - 2];

        // --- BUY LOGIC (Long) ---
        // 1. Check for Wick below support but close above (Liquidity Sweep)
        const bullishLiquidityGrab = prev.low < levels.support && prev.close > levels.support;
        // 2. Bullish Reversal Candle (Green candle following the sweep)
        const isBullishReversal = current.close > current.open && current.close > prev.high;
        // 3. RSI rising from Oversold or Neutral zone
        const rsiBullish = current.rsi > prev.rsi && prev.rsi < 50;

        if (bullishLiquidityGrab && isBullishReversal && rsiBullish) {
            const entryPrice = current.close;
            const stopLoss = prev.low - (symbol === 'XAUUSD' ? 1.5 : 0.1);
            const takeProfit = entryPrice + (entryPrice - stopLoss) * 3; // 1:3 RR

            return {
                symbol,
                type: SignalType.BUY,
                price: entryPrice,
                time: new Date().toLocaleTimeString(),
                reason: `🚀 ${symbol} BUY SETUP: Liquidity sweep below ${levels.support.toFixed(2)}. Bullish engulfing confirmed in ${session} session. RSI showing strength.`,
                tp: parseFloat(takeProfit.toFixed(2)),
                sl: parseFloat(stopLoss.toFixed(2))
            } as any;
        }

        // --- SELL LOGIC (Short) ---
        // 1. Check for Wick above resistance but close below (Liquidity Raid)
        const bearishLiquidityGrab = prev.high > levels.resistance && prev.close < levels.resistance;
        // 2. Bearish Reversal Candle (Red candle following the raid)
        const isBearishReversal = current.close < current.open && current.close < prev.low;
        // 3. RSI falling from Overbought or Neutral zone
        const rsiBearish = current.rsi < prev.rsi && prev.rsi > 50;

        if (bearishLiquidityGrab && isBearishReversal && rsiBearish) {
            const entryPrice = current.close;
            const stopLoss = prev.high + (symbol === 'XAUUSD' ? 1.5 : 0.1);
            const takeProfit = entryPrice - (stopLoss - entryPrice) * 3; // 1:3 RR

            return {
                symbol,
                type: SignalType.SELL,
                price: entryPrice,
                time: new Date().toLocaleTimeString(),
                reason: `🔻 ${symbol} SELL SETUP: Liquidity raid above ${levels.resistance.toFixed(2)}. Bearish momentum confirmed in ${session} session. RSI dropping.`,
                tp: parseFloat(takeProfit.toFixed(2)),
                sl: parseFloat(stopLoss.toFixed(2))
            } as any;
        }

        return null;
    }
}
