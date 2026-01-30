'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './auth.module.css';

import { Suspense } from 'react';

function AuthContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    // Get plan from URL
    const plan = searchParams.get('plan') || 'Gold Yearly';

    useEffect(() => {
        // Auto-redirect if already subscribed
        const expiry = localStorage.getItem('subscriptionExpiry');
        if (expiry && new Date(expiry) > new Date()) {
            router.push('/dashboard');
        }
    }, [router]);

    const handleLoginSuccess = () => {
        if (plan === '7-Day Trial') {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 7);
            localStorage.setItem('subscriptionExpiry', expiryDate.toISOString());
            localStorage.setItem('userPlan', '7-Day Trial');
            router.push('/dashboard?subscribed=true');
        } else {
            router.push(`/checkout?plan=${encodeURIComponent(plan)}`);
        }
    };

    const handleGoogleLogin = () => {
        setIsLoading(true);
        // Simulating Google OAuth redirect/process
        setTimeout(() => {
            handleLoginSuccess();
        }, 1500);
    };

    const handleEmailLogin = () => {
        handleLoginSuccess();
    };

    return (
        <div className={`${styles.authCard} glass animate-fade-in`}>
            <div className={styles.logo}>
                <span className={styles.goldText}>GOLD</span>
                <span className={styles.silverText}>SILVER</span>
                <span className={styles.signals}>SIGNALS</span>
            </div>

            <h1 className={styles.title}>Unlock Premium Signals</h1>
            <p className={styles.subtitle}>Join 10,000+ traders making data-driven decisions every day.</p>

            <div className={styles.authActions}>
                <button
                    className={styles.googleBtn}
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className={styles.loader}></span>
                    ) : (
                        <>
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                            Continue with Google
                        </>
                    )}
                </button>

                <div className={styles.divider}>
                    <span>or login with Email</span>
                </div>

                <input type="email" placeholder="Email Address" className={styles.input} />
                <input type="password" placeholder="Password" className={styles.input} />

                <button className={`${styles.submitBtn} btn-primary`} onClick={handleEmailLogin}>
                    Sign In
                </button>
            </div>

            <footer className={styles.footer}>
                By continuing, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>.
            </footer>
        </div>
    );
}

export default function AuthPage() {
    return (
        <main className={styles.container}>
            <div className={styles.backgroundGlow}></div>
            <Suspense fallback={<div className="glass" style={{ padding: '2rem', color: 'white' }}>Loading...</div>}>
                <AuthContent />
            </Suspense>
        </main>
    );
}
