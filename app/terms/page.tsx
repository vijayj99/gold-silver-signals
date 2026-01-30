import styles from '../content.module.css';
import SharedNav from '@/components/SharedNav';
import SharedFooter from '@/components/SharedFooter';

export default function TermsPage() {
    return (
        <>
            <SharedNav />
            <main className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Terms & Conditions</h1>
                    <p className={styles.subtitle}>Please read our terms carefully before using our services.</p>
                </header>

                <div className={`${styles.glassCard} glass ${styles.contentBody}`}>
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using Gold Silver Signals, you agree to be bound by these terms. If you do not agree to all of these terms,
                        do not use our service.
                    </p>

                    <h2>2. No Financial Advice</h2>
                    <p>
                        Our signals and analysis are for informational purposes only. We are not financial advisors. Trading Gold and Silver
                        carries high risk, and you should only invest money you can afford to lose. Past performance is not indicative of future results.
                    </p>

                    <h2>3. Subscription & Refunds</h2>
                    <p>
                        Subscriptions are billed in advance. Due to the digital nature of our signals, we do not offer refunds once the service
                        has been accessed. You can cancel your subscription at any time to prevent future billing.
                    </p>

                    <h2>4. Limitation of Liability</h2>
                    <p>
                        Gold Silver Signals shall not be liable for any direct or indirect losses incurred as a result of using our signals.
                        Traders are 100% responsible for their own entry points and risk management.
                    </p>

                    <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Last Updated: January 2026
                    </p>
                </div>
            </main>
            <SharedFooter />
        </>
    );
}
