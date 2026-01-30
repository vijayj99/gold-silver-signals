import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db-mock';

export async function GET() {
    const db = getDb();
    return NextResponse.json({ rules: db.rules });
}
