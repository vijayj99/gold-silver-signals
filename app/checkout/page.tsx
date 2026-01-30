'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './checkout.module.css';
import SharedNav from '@/components/SharedNav';
import SharedFooter from '@/components/SharedFooter';

const cryptoMethods = [
    { id: 'usdt-trc20', name: 'USDT (TRC20)', network: 'Tron Network', icon: '💎' },
    { id: 'usdt-erc20', name: 'USDT (ERC20)', network: 'Ethereum Network', icon: '🔷' },
    { id: 'usdt-bep20', name: 'USDT (BEP20)', network: 'BSC Network', icon: '🟡' },
    { id: 'btc', name: 'Bitcoin (BTC)', network: 'Bitcoin Network', icon: '₿' },
    { id: 'eth', name: 'Ethereum (ETH)', network: 'Ethereum Network', icon: 'Ξ' },
    { id: 'trx', name: 'TRON (TRX)', network: 'Tron Network', icon: '🔴' },
    { id: 'usdc-erc20', name: 'USDC (ERC20)', network: 'Ethereum Network', icon: '🔵' },
    { id: 'usdc-bep20', name: 'USDC (BEP20)', network: 'BSC Network', icon: '⚪' },
];

export default function CheckoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const plan = searchParams.get('plan') || 'Gold Yearly';

    // Improved pricing logic: Trial and Monthly are $49, others $299
    const price = (plan.includes('Trial') || plan.includes('Monthly')) ? '$49' : '$299';

    const handlePayment = () => {
        if (!selectedMethod) return;
        setIsProcessing(true);

        // Simulate payment verification
        setTimeout(() => {
            // Calculate expiry based on plan
            let days = 365;
            if (plan.includes('Trial')) days = 7;
            if (plan.includes('Monthly')) days = 30;

            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + days);

            localStorage.setItem('subscriptionExpiry', expiryDate.toISOString());
            localStorage.setItem('userPlan', plan);

            // Redirect back to dashboard
            router.push('/dashboard?subscribed=true');
        }, 2000);
    };

    return (
        <>
            <SharedNav />
            <main className={styles.container}>
                <div className={styles.checkoutGrid}>
                    <div className={styles.paymentSection}>
                        <h1 className={styles.title}>Select Payment Method</h1>
                        <p className={styles.subtitle}>Choose your preferred cryptocurrency to complete the subscription.</p>

                        <div className={styles.methodsGrid}>
                            {cryptoMethods.map((method) => (
                                <div
                                    key={method.id}
                                    className={`${styles.methodCard} glass ${selectedMethod === method.id ? styles.selected : ''}`}
                                    onClick={() => setSelectedMethod(method.id)}
                                >
                                    <span className={styles.cryptoIcon}>{method.icon}</span>
                                    <div className={styles.methodInfo}>
                                        <span className={styles.methodName}>{method.name}</span>
                                        <span className={styles.networkName}>{method.network}</span>
                                    </div>
                                    <div className={styles.radio}></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.summarySection}>
                        <div className={`${styles.summaryCard} glass`}>
                            <h3>Order Summary</h3>
                            <div className={styles.summaryItem}>
                                <span>Plan</span>
                                <strong>{plan}</strong>
                            </div>
                            <div className={styles.summaryItem}>
                                <span>Duration</span>
                                <span>{plan.includes('Yearly') ? '12 Months' : '1 Month'}</span>
                            </div>
                            <div className={styles.divider}></div>
                            <div className={styles.totalPrice}>
                                <span>Total to Pay</span>
                                <span className={styles.amount}>{price}</span>
                            </div>

                            {selectedMethod && (
                                <div className={styles.addressBox}>
                                    <p>Send exactly <strong>{price.replace('$', '')} USD</strong> equivalent to the address below:</p>
                                    <div className={styles.walletAddress}>
                                        TNV9...y5Wk (Simulated Address)
                                    </div>
                                    <p className={styles.hint}>Payment will be automatically detected in 5-10 mins.</p>
                                </div>
                            )}

                            <button
                                className={`btn btn-primary ${styles.payBtn}`}
                                disabled={!selectedMethod || isProcessing}
                                onClick={handlePayment}
                            >
                                {isProcessing ? 'Verifying Transaction...' : 'Confirm Payment'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <SharedFooter />
        </>
    );
}
