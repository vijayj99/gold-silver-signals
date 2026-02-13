import { NextResponse } from 'next/server';
import { MarketService } from '@/lib/market';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const prices = await MarketService.getPricesBatch(['XAUUSD', 'XAGUSD']);

        return NextResponse.json({
            XAUUSD: prices.XAUUSD,
            XAGUSD: prices.XAGUSD,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('[Prices API Error]:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
