import { NextResponse } from 'next/server';
import { MarketService } from '@/lib/market';

export async function GET() {
    const gold = await MarketService.getLatestPrice('XAUUSD');
    const silver = await MarketService.getLatestPrice('XAGUSD');

    return NextResponse.json({
        XAUUSD: gold.price,
        XAGUSD: silver.price,
        timestamp: new Date().toISOString()
    });
}
