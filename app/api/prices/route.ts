import { NextResponse } from 'next/server';
import { MarketService } from '@/lib/market';

export const dynamic = 'force-dynamic';

export async function GET() {
    const prices = await MarketService.getPricesBatch(['XAUUSD', 'XAGUSD']);

    return NextResponse.json({
        XAUUSD: prices.XAUUSD,
        XAGUSD: prices.XAGUSD,
        timestamp: new Date().toISOString()
    });
}
