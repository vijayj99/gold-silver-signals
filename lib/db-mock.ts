// lib/db-mock.ts
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'mock-db.json');

if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({
        users: [],
        rules: [
            { id: '1', symbol: 'XAUUSD', indicator: 'SMA', period: 20, condition: 'LESS_THAN', value: -0.005, action: 'BUY', isActive: true },
            { id: '2', symbol: 'XAUUSD', indicator: 'SMA', period: 20, condition: 'GREATER_THAN', value: 0.005, action: 'SELL', isActive: true },
            { id: '3', symbol: 'XAGUSD', indicator: 'SMA', period: 20, condition: 'LESS_THAN', value: -0.005, action: 'BUY', isActive: true },
            { id: '4', symbol: 'XAGUSD', indicator: 'SMA', period: 20, condition: 'GREATER_THAN', value: 0.005, action: 'SELL', isActive: true },
        ],
        signals: [],
        monthlyProfit: 4250.50
    }, null, 2));
}

export const getDb = () => {
    try {
        if (!fs.existsSync(DB_PATH)) return { rules: [], signals: [], monthlyProfit: 4250.50 };
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    } catch (e) {
        console.error('getDb Error:', e);
        return { rules: [], signals: [], monthlyProfit: 4250.50 };
    }
}

export const saveDb = (data: any) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } catch (e) {
        console.warn('⚠️ Vercel Read-Only Mode: Mock-DB could not be saved to disk. Changes are temporarily in-memory.', e);
        // In a real app, this would be the time to switch to a real DB like Supabase/Postgres.
    }
}
