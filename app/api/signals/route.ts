import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db-mock';

export const dynamic = 'force-dynamic';

export async function GET() {
    const db = getDb();
    return NextResponse.json({
        signals: db.signals,
        monthlyProfit: db.monthlyProfit || 4250.50
    });
}
