'use client';

import React, { useEffect, useRef } from 'react';

declare global {
    interface Window {
        TradingView: any;
    }
}

const TradingViewChart = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = () => {
            if (typeof window.TradingView !== 'undefined' && containerRef.current) {
                new window.TradingView.widget({
                    autosize: true,
                    symbol: "OANDA:XAUUSD",
                    interval: "15",
                    timezone: "Etc/UTC",
                    theme: "dark",
                    style: "1",
                    locale: "en",
                    toolbar_bg: "#14161d",
                    enable_publishing: false,
                    hide_top_toolbar: false,
                    hide_legend: false,
                    save_image: false,
                    container_id: containerRef.current.id,
                });
            }
        };
        document.head.appendChild(script);

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    return (
        <div
            id="tvChart"
            ref={containerRef}
            style={{ height: '420px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}
        />
    );
};

export default TradingViewChart;
