'use client';

import React, { useEffect, useRef } from 'react';

const TradingViewSymbolInfo = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || containerRef.current.querySelector('script')) return;

        // Clear any existing content to be safe
        containerRef.current.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js';
        script.type = 'text/javascript';
        script.async = true;
        script.innerHTML = JSON.stringify({
            "symbol": "OANDA:XAUUSD",
            "width": "100%",
            "locale": "en",
            "colorTheme": "dark",
            "isTransparent": true
        });

        containerRef.current.appendChild(script);

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, []);

    return (
        <div className="tradingview-widget-container" ref={containerRef}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
};

export default TradingViewSymbolInfo;
