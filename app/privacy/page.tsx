import styles from '../content.module.css';
import SharedNav from '@/components/SharedNav';
import SharedFooter from '@/components/SharedFooter';

export default function PrivacyPage() {
    return (
        <>
            <SharedNav />
            <main className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Privacy Policy</h1>
                    <p className={styles.subtitle}>Your data privacy is our top priority.</p>
                </header>

                <div className={`${styles.glassCard} glass ${styles.contentBody}`}>
                    <h2>1. Information We Collect</h2>
                    <p>
                        We collect your email address and name during registration. If you use Google Login, we receive your basic profile
                        information as permitted by your Google settings.
                    </p>

                    <h2>2. How We Use Your Data</h2>
                    <p>We use your data to:</p>
                    <ul>
                        <li>Deliver trading signals to your dashboard and Telegram.</li>
                        <li>Communicate important service updates.</li>
                        <li>Process subscription payments (via third-party processors).</li>
                    </ul>

                    <h2>3. Data Security</h2>
                    <p>
                        We implement industry-standard security measures to protect your information. We never sell your personal data
                        to third parties.
                    </p>

                    <h2>4. Cookies</h2>
                    <p>
                        We use essential cookies to keep you logged in and to remember your dashboard preferences.
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
