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

export const getDb = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
export const saveDb = (data: any) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
