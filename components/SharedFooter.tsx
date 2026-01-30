/* components/SharedFooter.tsx */
import styles from '../app/page.module.css';

export default function SharedFooter() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerInner}>
                    <div className={styles.footerLogo}>
                        <span className={styles.goldText}>GOLD</span>
                        <span className={styles.silverText}>SILVER</span>
                    </div>
                    <div className={styles.footerLinks}>
                        <a href="/about">About Us</a>
                        <a href="/contact">Contact Us</a>
                        <a href="/terms">Terms</a>
                        <a href="/privacy">Privacy Policy</a>
                    </div>
                    <p className={styles.copyright}>
                        &copy; {new Date().getFullYear()} Gold Silver Signals. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
