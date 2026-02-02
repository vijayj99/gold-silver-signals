'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

interface Signal {
    symbol: string;
    type: 'BUY' | 'SELL';
    price: number;
    time: string;
    reason: string;
    timestamp: string;
}

import { Suspense } from 'react';

function DashboardContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [signals, setSignals] = useState<Signal[]>([]);
    const [prices, setPrices] = useState({ XAUUSD: 5009.95, XAGUSD: 58.45 });
    const [loading, setLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);
    const [ticketSubject, setTicketSubject] = useState('');
    const [ticketMessage, setTicketMessage] = useState('');
    const [showProfile, setShowProfile] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');
    const [userPlan, setUserPlan] = useState('');
    const [monthlyProfit, setMonthlyProfit] = useState(4250.50);

    useEffect(() => {
        // Load subscription from localStorage
        const checkSubscription = () => {
            const expiry = localStorage.getItem('subscriptionExpiry');
            const plan = localStorage.getItem('userPlan');

            if (expiry) {
                const expiryDate = new Date(expiry);
                if (expiryDate > new Date()) {
                    setIsSubscribed(true);
                    setUserPlan(plan || 'Premium');
                } else {
                    setIsSubscribed(false);
                }
            }
        };

        checkSubscription();

        if (searchParams.get('subscribed') === 'true') {
            setIsSubscribed(true);
        }

        const fetchSignals = async () => {
            try {
                const res = await fetch(`/api/signals?t=${Date.now()}`);
                const data = await res.json();
                setSignals(data.signals || []);
                if (data.monthlyProfit) setMonthlyProfit(data.monthlyProfit);
            } catch (err) {
                console.error('Signals fetch error:', err);
            }
        };

        const fetchPrices = async () => {
            try {
                const res = await fetch(`/api/prices?t=${Date.now()}`);
                const data = await res.json();
                setPrices({
                    XAUUSD: data.XAUUSD,
                    XAGUSD: data.XAGUSD,
                });
            } catch (err) {
                console.error('Prices fetch error:', err);
            }
        };

        const initialLoad = async () => {
            await Promise.all([fetchSignals(), fetchPrices()]);
            setLoading(false);
        };

        initialLoad();

        const signalsInterval = setInterval(fetchSignals, 15000);
        const pricesInterval = setInterval(fetchPrices, 3000);

        // Countdown Timer Logic
        const timerInterval = setInterval(() => {
            const expiry = localStorage.getItem('subscriptionExpiry');
            if (expiry) {
                const now = new Date().getTime();
                const distance = new Date(expiry).getTime() - now;

                if (distance < 0) {
                    clearInterval(timerInterval);
                    setTimeLeft('EXPIRED');
                    setIsSubscribed(false);
                } else {
                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
                }
            }
        }, 1000);

        return () => {
            clearInterval(signalsInterval);
            clearInterval(pricesInterval);
            clearInterval(timerInterval);
        };
    }, [searchParams]);

    const handleLogout = () => {
        localStorage.removeItem('subscriptionExpiry');
        localStorage.removeItem('userPlan');
        router.push('/');
    };

    const handleSupportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Ticket Raised Successfully! Support ID: #' + Math.floor(Math.random() * 900000 + 100000));
        setIsSupportOpen(false);
        setTicketSubject('');
        setTicketMessage('');
    };

    return (
        <div className={styles.container}>
            <header className={styles.dashboardNav}>
                <div className={styles.navLeft}>
                    <a href="/" className={styles.logo}>
                        <span className={styles.goldText}>GOLD</span>
                        <span className={styles.silverText}>SILVER</span>
                    </a>
                </div>
                <div className={styles.navRight}>
                    <button className={styles.supportLink} onClick={() => setIsSupportOpen(true)}>
                        🎧 Support
                    </button>
                    <div className={styles.userProfile} onClick={() => setShowProfile(!showProfile)}>
                        <div className={styles.avatar}>V</div>
                        {showProfile && (
                            <div className={`${styles.profileDropdown} glass`}>
                                <div className={styles.userInfo}>
                                    <strong>Vijay Savani</strong>
                                    <span>vijay@example.com</span>
                                </div>
                                <div className={styles.planStatus}>
                                    Plan: <strong>{userPlan}</strong><br />
                                    Status: <span className={isSubscribed ? styles.active : styles.inactive}>
                                        {isSubscribed ? 'Active' : 'Expired'}
                                    </span>
                                </div>
                                <button className={styles.logoutBtn} onClick={handleLogout}>Log Out</button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1>Market Dashboard</h1>
                    <p>Welcome back, Vijay Savani</p>
                </div>
                <div className={styles.livePrices}>
                    <div className={`${styles.priceCard} glass`}>
                        <span>XAUUSD (Gold)</span>
                        <span className={styles.priceValue}>${prices.XAUUSD.toFixed(2)}</span>
                    </div>
                    <div className={`${styles.priceCard} glass`}>
                        <span>XAGUSD (Silver)</span>
                        <span className={styles.priceValue}>${prices.XAGUSD.toFixed(2)}</span>
                    </div>
                </div>
            </header>

            <section className={styles.analyticsSection}>
                <div className={`${styles.analyticsGrid} glass`}>
                    <div className={styles.analyticItem}>
                        <span className={styles.analyticLabel}>Monthly Profit</span>
                        <span className={`${styles.analyticValue} ${styles.profit}`}>+${monthlyProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        <span className={styles.analyticSub}>+12.4% this month</span>
                    </div>
                    {isSubscribed && (
                        <>
                            <div className={styles.divider}></div>
                            <div className={styles.analyticItem}>
                                <span className={styles.analyticLabel}>Time Remaining</span>
                                <span className={`${styles.analyticValue} ${styles.countdown}`}>{timeLeft}</span>
                                <span className={styles.analyticSub}>Subscription Active</span>
                            </div>
                        </>
                    )}
                    <div className={styles.divider}></div>
                    <div className={styles.analyticItem}>
                        <span className={styles.analyticLabel}>Signal Accuracy</span>
                        <div className={styles.accuracyCircle}>
                            <span className={styles.analyticValue}>92%</span>
                        </div>
                        <span className={styles.analyticSub}>Last 50 trades</span>
                    </div>
                    <div className={styles.divider}></div>
                    <div className={styles.analyticItem}>
                        <span className={styles.analyticLabel}>Avg. Risk/Reward</span>
                        <span className={styles.analyticValue}>1:3.2</span>
                        <span className={styles.analyticSub}>Optimized for Growth</span>
                    </div>
                </div>
            </section>

            <section className={styles.signalsSection}>
                <div className={styles.sectionHeader}>
                    <h2>Recent Signals</h2>
                    <div className={styles.badge}>Live Feed</div>
                </div>

                {loading ? (
                    <div className={styles.loading}>Analyzing markets...</div>
                ) : !isSubscribed ? (
                    <div className={styles.paywallOverlay}>
                        <div className={`${styles.paywallContent} glass`}>
                            <div className={styles.lockIcon}>🔒</div>
                            <h3>Premium Signals Locked</h3>
                            <p>Subscribe to our Gold & Silver plan to see live entry points, TP, and SL.</p>
                            <button className="btn btn-primary" onClick={() => window.location.href = '/checkout'}>
                                View Pricing Plans
                            </button>
                        </div>
                        <div className={styles.blurredGrid}>
                            <div className={`${styles.signalCard} glass`}>...</div>
                            <div className={`${styles.signalCard} glass`}>...</div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.signalsGrid}>
                        {signals.length === 0 ? (
                            <div className={styles.empty}>No signals generated yet. Looking for opportunities...</div>
                        ) : (
                            signals.map((signal, idx) => (
                                <div key={idx} className={`${styles.signalCard} glass animate-fade-in`}>
                                    <div className={styles.signalTop}>
                                        <span className={styles.symbol}>{signal.symbol}</span>
                                        <span className={`${styles.type} ${signal.type === 'BUY' ? styles.buy : styles.sell}`}>
                                            {signal.type}
                                        </span>
                                    </div>
                                    <div className={styles.signalPrice}>
                                        Entry: ${signal.price.toFixed(2)}
                                    </div>
                                    <div className={styles.signalTargets}>
                                        <span className={styles.tp}>🎯 TP: ${(signal as any).tp?.toFixed(2)}</span>
                                        <span className={styles.sl}>🛑 SL: ${(signal as any).sl?.toFixed(2)}</span>
                                    </div>
                                    <div className={styles.signalReason}>{signal.reason}</div>
                                    <div className={styles.signalTime}>{new Date(signal.timestamp).toLocaleString()}</div>
                                </div>
                            )).reverse()
                        )}
                    </div>
                )}
            </section>

            <section className={styles.telegramCTA}>
                <div className={`${styles.telegramContent} glass`}>
                    <div className={styles.telegramIcon}>📡</div>
                    <div className={styles.telegramText}>
                        <h3>Premium Telegram Alerts</h3>
                        {(userPlan === 'Gold Yearly' || userPlan === 'Silver Monthly') ? (
                            <p>You have exclusive access to our 24/7 AI Signal Bot.</p>
                        ) : (
                            <p>Telegram Bot access is <strong>LOCKED</strong>. Upgrade to a paid plan to get instant mobile alerts.</p>
                        )}
                    </div>
                    {(userPlan === 'Gold Yearly' || userPlan === 'Silver Monthly') ? (
                        <button className="btn btn-primary" onClick={() => window.open('https://t.me/your_bot_link', '_blank')}>
                            Open Telegram Bot
                        </button>
                    ) : (
                        <div className={styles.upgradeGroup}>
                            <button className="btn btn-primary" onClick={() => window.location.href = '/checkout?plan=Silver%20Monthly'}>
                                Unlock Monthly ($49)
                            </button>
                            <button className="btn btn-outline" onClick={() => window.location.href = '/checkout?plan=Gold%20Yearly'}>
                                Unlock Yearly ($299)
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Support Ticket Modal */}
            {isSupportOpen && (
                <div className={styles.modalOverlay}>
                    <div className={`${styles.modalContent} glass`}>
                        <div className={styles.modalHeader}>
                            <h2>Raise a Support Ticket</h2>
                            <button className={styles.closeBtn} onClick={() => setIsSupportOpen(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSupportSubmit} className={styles.supportForm}>
                            <div className={styles.formGroup}>
                                <label>Subject</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Payment Issue"
                                    required
                                    value={ticketSubject}
                                    onChange={(e) => setTicketSubject(e.target.value)}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>How can we help?</label>
                                <textarea
                                    rows={5}
                                    placeholder="Explain your problem..."
                                    required
                                    value={ticketMessage}
                                    onChange={(e) => setTicketMessage(e.target.value)}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">Submit Ticket</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Dashboard() {
    return (
        <Suspense fallback={<div style={{ padding: '5rem', textAlign: 'center', color: 'white' }}>Loading Dashboard...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
