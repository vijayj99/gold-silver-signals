import { NextResponse } from 'next/server';
import { StrategyEngine } from '@/lib/strategy';
import { TelegramService } from '@/lib/telegram';
import { getDb, saveDb } from '@/lib/db-mock';

export const dynamic = 'force-dynamic';

export async function GET(req: any) {
    const { searchParams } = new URL(req.url);
    const force = searchParams.get('force') === 'true';

    const symbols = ['XAUUSD', 'XAGUSD'];
    const newSignals = [];

    for (const symbol of symbols) {
        const signal = await StrategyEngine.evaluate(symbol);

        // Process REAL signals only (unless force is explicitly requested for testing)
        const finalSignal = (force && !signal && symbol === 'XAUUSD') ? {
            symbol: 'XAUUSD',
            type: 'SELL',
            price: 2039.50,
            time: new Date().toLocaleTimeString(),
            reason: 'DIAGNOSTIC SIGNAL: Testing Telegram connectivity (FORCED)',
            tp: 2010.50,
            sl: 2049.50
        } : signal;

        if (finalSignal) {
            const db = getDb();
            // Check if we already have this signal type recently to avoid spam
            const lastSignal = db.signals.filter((s: any) => s.symbol === symbol).pop();
            const isNewDirection = !lastSignal || lastSignal.type !== finalSignal.type;
            const msSinceLast = lastSignal ? (Date.now() - new Date(lastSignal.timestamp).getTime()) : 3600000;

            // Only send if it's a new setup or at least 30 mins have passed for the same symbol
            if (force || isNewDirection || msSinceLast > 1800000) {
                // 1. Send to Telegram TelegramService
                await TelegramService.sendSignal(finalSignal as any);

                // 2. Save to Mock DB for Dashboard
                db.signals.push({
                    ...finalSignal,
                    timestamp: new Date().toISOString()
                });

                // Rule: Strictly keep only 6 signals.
                while (db.signals.length > 6) {
                    db.signals.shift();
                    if (db.monthlyProfit === undefined) db.monthlyProfit = 5458.00;
                    db.monthlyProfit += 120.75; // Simulate profit from closed trade
                }

                saveDb(db);
                newSignals.push(finalSignal);
            }
        }
    }

    return NextResponse.json({
        success: true,
        processedAt: new Date().toISOString(),
        count: newSignals.length,
        signals: newSignals,
        forced: force
    });
}
