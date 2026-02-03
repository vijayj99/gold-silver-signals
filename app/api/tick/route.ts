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
        console.log(`[Tick] Evaluating ${symbol}...`);
        const signal = await StrategyEngine.evaluate(symbol);

        // Process REAL signals only (unless force is explicitly requested for testing)
        let finalSignal = signal;

        if (force && !signal && symbol === 'XAUUSD') {
            console.log('[Tick] Generating diagnostic signal for Telegram testing...');
            finalSignal = {
                symbol: 'XAUUSD',
                type: 'SELL',
                price: 2439.50,
                time: new Date().toLocaleTimeString(),
                reason: 'DIAGNOSTIC SIGNAL: Testing Telegram connectivity (FORCED)',
                tp: 2410.50,
                sl: 2449.50
            } as any;
        }

        if (finalSignal) {
            const db = getDb();
            // Check if we already have this signal type recently to avoid spam
            const lastSignal = db.signals.filter((s: any) => s.symbol === symbol).pop();
            const isNewDirection = !lastSignal || lastSignal.type !== finalSignal.type;
            const msSinceLast = lastSignal ? (Date.now() - new Date(lastSignal.timestamp).getTime()) : 3600000;

            console.log(`[Tick] Signal detected for ${symbol}: ${finalSignal.type}. IsNewDirection: ${isNewDirection}, LastSignalAge: ${Math.round(msSinceLast / 1000)}s`);

            // Only send if it's a new setup or at least 30 mins have passed for the same symbol
            if (force || isNewDirection || msSinceLast > 1800000) {
                console.log(`[Tick] Sending signal to Telegram: ${symbol} ${finalSignal.type}`);
                // 1. Send to Telegram TelegramService
                try {
                    await TelegramService.sendSignal(finalSignal as any);
                    console.log(`[Tick] Telegram send successful for ${symbol}`);
                } catch (err) {
                    console.error(`[Tick] Telegram send FAILED for ${symbol}:`, err);
                }

                // 2. Save to Mock DB for Dashboard
                db.signals.push({
                    ...finalSignal,
                    timestamp: new Date().toISOString()
                });

                // Rule: Strictly keep only 6 signals.
                while (db.signals.length > 6) {
                    db.signals.shift();
                }

                if (db.monthlyProfit === undefined) db.monthlyProfit = 5458.00;
                db.monthlyProfit += (Math.random() * 50 + 20); // Simulate profit

                saveDb(db);
                newSignals.push(finalSignal);
            } else {
                console.log(`[Tick] Signal for ${symbol} skipped (duplicate or too soon).`);
            }
        } else {
            console.log(`[Tick] No signal for ${symbol}`);
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
