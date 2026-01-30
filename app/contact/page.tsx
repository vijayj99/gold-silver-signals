import styles from '../content.module.css';
import SharedNav from '@/components/SharedNav';
import SharedFooter from '@/components/SharedFooter';

export default function ContactPage() {
    return (
        <>
            <SharedNav />
            <main className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Contact Us</h1>
                    <p className={styles.subtitle}>Have questions? Our team is here to help you dominate the markets.</p>
                </header>

                <div className={`${styles.glassCard} glass`}>
                    <div className={styles.contactGrid}>
                        <div className={styles.contactForm}>
                            <div className={styles.formGroup}>
                                <label>Full Name</label>
                                <input type="text" placeholder="John Doe" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Email Address</label>
                                <input type="email" placeholder="john@example.com" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Message</label>
                                <textarea rows={5} placeholder="How can we help?"></textarea>
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                                Send Message
                            </button>
                        </div>

                        <div className={styles.contactInfo}>
                            <h3>Get in Touch</h3>
                            <p className={styles.infoDescription}>
                                Reach out to us via email or join our community on Telegram for the fastest response.
                            </p>

                            <div className={styles.infoItem}>
                                <span className={styles.icon}>📧</span>
                                <div>
                                    <strong>Email Support</strong>
                                    <p>support@goldsilversignals.com</p>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <span className={styles.icon}>📱</span>
                                <div>
                                    <strong>Telegram</strong>
                                    <p>@GoldSilverSignals_Admin</p>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <span className={styles.icon}>📍</span>
                                <div>
                                    <strong>Headquarters</strong>
                                    <p>Financial District, Singapore</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <SharedFooter />
        </>
    );
}
