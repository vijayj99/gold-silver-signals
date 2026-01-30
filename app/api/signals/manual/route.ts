import { NextRequest, NextResponse } from 'next/server';
import { TelegramService } from '@/lib/telegram';
import { getDb, saveDb } from '@/lib/db-mock';

export async function POST(req: NextRequest) {
    const signal = await req.json();

    // Send to Telegram
    await TelegramService.sendSignal({
        ...signal,
        time: new Date().toLocaleTimeString(),
    });

    // Save to History
    const db = getDb();
    db.signals.push({
        ...signal,
        timestamp: new Date().toISOString()
    });
    saveDb(db);

    return NextResponse.json({ success: true });
}
