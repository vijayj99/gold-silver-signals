import styles from '../content.module.css';
import SharedNav from '@/components/SharedNav';
import SharedFooter from '@/components/SharedFooter';

export default function AboutPage() {
    return (
        <>
            <SharedNav />
            <main className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>About Us</h1>
                    <p className={styles.subtitle}>Empowering traders with institutional-grade technology.</p>
                </header>

                <div className={`${styles.glassCard} glass ${styles.contentBody}`}>
                    <h2>Our Mission</h2>
                    <p>
                        At Gold Silver Signals, we believe that every trader deserves access to professional-grade market analysis.
                        Founded by a team of quantitative analysts and seasoned forex traders, we've built a platform that translates
                        complex liquidity data into actionable signals.
                    </p>

                    <h2>Our Technology</h2>
                    <p>
                        We don't use "hunches." Our engine is built on robust mathematical models that monitor XAUUSD and XAGUSD price action 24/7.
                        By identifying liquidity grabs, session imbalances, and bullish/bearish reversals in real-time, we provide signals with
                        calculated risk-reward ratios.
                    </p>

                    <h2>Why Metals?</h2>
                    <p>
                        Gold and Silver are the bedrock of global finance. Their volatility offers immense opportunity, but only for those with
                        the right data. We specialize exclusively in these two assets to provide deeper, more accurate insights than general-purpose
                        signal services.
                    </p>

                    <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                        <a href="/auth" className="btn btn-primary">Start Trading Smarter</a>
                    </div>
                </div>
            </main>
            <SharedFooter />
        </>
    );
}
