/* components/SharedNav.tsx */
import styles from '../app/page.module.css';

export default function SharedNav() {
    return (
        <nav className={styles.nav}>
            <div className="container">
                <div className={styles.navInner}>
                    <a href="/" className={styles.logo}>
                        <span className={styles.goldText}>GOLD</span>
                        <span className={styles.silverText}>SILVER</span>
                        <span className={styles.signals}>SIGNALS</span>
                    </a>
                    <div className={styles.navLinks}>
                        <a href="/" style={{ fontWeight: '700', color: 'var(--primary)' }}>← Back to Home</a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
