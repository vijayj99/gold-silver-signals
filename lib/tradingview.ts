// lib/tradingview.ts
import WebSocket from 'ws';

export interface TVSignalData {
    symbol: string;
    price: number;
    open: number;
    high: number;
    low: number;
    close: number;
    candles: {
        time: number;
        open: number;
        high: number;
        low: number;
        close: number;
    }[];
}

class TradingViewService {
    private ws: WebSocket | null = null;
    private prices: Record<string, number> = {
        'XAUUSD': 2035.50,
        'XAGUSD': 23.85
    };
    private candles: Record<string, any[]> = {
        'XAUUSD': [],
        'XAGUSD': []
    };
    private sessions: { quote: string; chart: string } = { quote: '', chart: '' };

    constructor() {
        // Prevent connection during build phase or on client side
        const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
        if (typeof window === 'undefined' && !isBuildPhase) {
            this.connect();
        }
    }

    private generateSession(prefix: string) {
        return prefix + "_" + Math.random().toString(36).substring(2, 12);
    }

    private constructMessage(name: string, params: any[]) {
        const obj = JSON.stringify({ m: name, p: params });
        return `~m~${obj.length}~m~${obj}`;
    }

    private parseMessages(str: string) {
        const packets = str.split(/~m~\d+~m~/).filter(p => p.length > 0);
        const result: any[] = [];
        for (const packet of packets) {
            if (packet.startsWith("~h~")) {
                result.push({ type: 'heartbeat', id: packet.substring(3) });
            } else {
                try {
                    result.push({ type: 'message', data: JSON.parse(packet) });
                } catch (e) { }
            }
        }
        return result;
    }

    private connect() {
        console.log('📡 TradingView: Connecting to live WebSocket...');
        this.ws = new WebSocket("wss://data.tradingview.com/socket.io/websocket", {
            origin: "https://www.tradingview.com",
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        this.sessions.quote = this.generateSession("qs");
        this.sessions.chart = this.generateSession("cs");

        this.ws.on('open', () => {
            if (!this.ws) return;
            this.ws.send(this.constructMessage("set_auth_token", ["unauthorized_user_token"]));

            // Setup Quotes
            this.ws.send(this.constructMessage("quote_create_session", [this.sessions.quote]));
            this.ws.send(this.constructMessage("quote_set_fields", [this.sessions.quote, "lp", "open", "high", "low", "close"]));
            this.ws.send(this.constructMessage("quote_add_symbols", [this.sessions.quote, "OANDA:XAUUSD", "OANDA:XAGUSD"]));

            // Setup Chart (for OHLC 15m)
            this.ws.send(this.constructMessage("chart_create_session", [this.sessions.chart, ""]));
            this.ws.send(this.constructMessage("resolve_symbol", [this.sessions.chart, "sds_xau", "OANDA:XAUUSD"]));
            this.ws.send(this.constructMessage("create_series", [this.sessions.chart, "sds_xau", "s1", "sds_xau", "15", 50]));
        });

        this.ws.on('message', (data: WebSocket.Data) => {
            const str = data.toString();
            const packets = this.parseMessages(str);
            for (const packet of packets) {
                if (packet.type === 'heartbeat') {
                    this.ws?.send(`~m~${packet.id.length + 3}~m~~h~${packet.id}`);
                } else if (packet.type === 'message') {
                    const msg = packet.data;

                    // Quote updates
                    if (msg.m === 'qsd' && msg.p[1].s === 'ok') {
                        const ticker = msg.p[1].n;
                        const price = msg.p[1].v.lp;
                        if (ticker.includes('XAU')) this.prices['XAUUSD'] = price;
                        if (ticker.includes('XAG')) this.prices['XAGUSD'] = price;
                    }

                    // Chart updates (OHLC)
                    if (msg.m === 'timeseries_data') {
                        const series = msg.p[1].s1;
                        if (series && series.s) {
                            this.candles['XAUUSD'] = series.s.map((c: any) => ({
                                time: c.v[0],
                                open: c.v[1],
                                high: c.v[2],
                                low: c.v[3],
                                close: c.v[4]
                            }));
                        }
                    }
                }
            }
        });

        this.ws.on('close', () => {
            console.log('🔄 TradingView: Socket closed. Reconnecting in 5s...');
            setTimeout(() => this.connect(), 5000);
        });

        this.ws.on('error', (err: Error) => {
            console.error('❌ TradingView Socket Error:', err.message);
        });
    }

    public getPrice(symbol: string): number {
        return this.prices[symbol] || 0;
    }

    public getCandles(symbol: string): any[] {
        return this.candles[symbol] || [];
    }
}

// Singleton instance
export const TVService = new TradingViewService();
