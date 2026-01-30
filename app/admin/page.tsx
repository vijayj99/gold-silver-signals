'use client';

import { useState, useEffect } from 'react';
import styles from './admin.module.css';

interface Rule {
    id: string;
    symbol: string;
    indicator: string;
    period: number;
    condition: string;
    value: number;
    action: string;
    isActive: boolean;
}

export default function AdminPanel() {
    const [rules, setRules] = useState<Rule[]>([]);
    const [loading, setLoading] = useState(true);
    const [manualSignal, setManualSignal] = useState({ symbol: 'XAUUSD', type: 'BUY', price: 0, reason: '' });

    useEffect(() => {
        fetch('/api/rules')
            .then(res => res.json())
            .then(data => {
                setRules(data.rules);
                setLoading(false);
            });
    }, []);

    const sendManualSignal = async () => {
        const res = await fetch('/api/signals/manual', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(manualSignal),
        });
        if (res.ok) alert('Signal sent to Telegram and Dashboard!');
    };

    const toggleRule = async (id: string) => {
        // In a real app, this would be a PATCH request
        setRules(rules.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Strategy Admin Panel</h1>
            </header>

            <section className={styles.manualSection}>
                <div className="glass">
                    <h3>Send Manual Signal</h3>
                    <div className={styles.formInline}>
                        <select onChange={(e) => setManualSignal({ ...manualSignal, symbol: e.target.value })}>
                            <option value="XAUUSD">XAUUSD (Gold)</option>
                            <option value="XAGUSD">XAGUSD (Silver)</option>
                        </select>
                        <select onChange={(e) => setManualSignal({ ...manualSignal, type: e.target.value })}>
                            <option value="BUY">BUY</option>
                            <option value="SELL">SELL</option>
                        </select>
                        <input type="number" placeholder="Entry Price" onChange={(e) => setManualSignal({ ...manualSignal, price: parseFloat(e.target.value) })} />
                        <input type="text" placeholder="Reason (Optional)" onChange={(e) => setManualSignal({ ...manualSignal, reason: e.target.value })} />
                        <button className="btn btn-primary" onClick={sendManualSignal}>Send Now</button>
                    </div>
                </div>
            </section>

            <section className={styles.rulesSection}>
                <div className="glass">
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Indicator</th>
                                <th>Condition</th>
                                <th>Value</th>
                                <th>Action</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rules.map(rule => (
                                <tr key={rule.id}>
                                    <td><strong>{rule.symbol}</strong></td>
                                    <td>{rule.indicator} ({rule.period})</td>
                                    <td>{rule.condition.replace('_', ' ')}</td>
                                    <td>{rule.value}</td>
                                    <td>
                                        <span className={`${styles.actionBadge} ${rule.action === 'BUY' ? styles.buy : styles.sell}`}>
                                            {rule.action}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={rule.isActive ? styles.active : styles.inactive}>
                                            {rule.isActive ? 'Active' : 'Paused'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => toggleRule(rule.id)}
                                            className={styles.toggleBtn}
                                        >
                                            {rule.isActive ? 'Pause' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className={styles.systemStats}>
                <div className={styles.statsGrid}>
                    <div className="glass">
                        <h3>Telegram Status</h3>
                        <p className={styles.statusOk}>Connected</p>
                    </div>
                    <div className="glass">
                        <h3>Total Signals (24h)</h3>
                        <p className={styles.statValue}>12</p>
                    </div>
                    <div className="glass">
                        <h3>Active Subscribers</h3>
                        <p className={styles.statValue}>128</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
