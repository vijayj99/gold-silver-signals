import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <div className="container">
          <div className={styles.navInner}>
            <a href="/" className={styles.logo}>
              <span className={styles.goldText}>GOLD</span>
              <span className={styles.silverText}>SILVER</span>
              <span className={styles.signals}>SIGNALS</span>
            </a>
            <div className={styles.navLinks}>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="/auth" className="btn btn-primary">Login / Dashboard</a>
            </div>
          </div>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className="container">
          <div className={`${styles.heroContent} animate-fade-in`}>
            <h1 className={styles.heroTitle}>
              Precision Trading Signals for <br />
              <span className={styles.goldText}>Gold</span> & <span className={styles.silverText}>Silver</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Our rule-based AI engine monitors global markets 24/7 to deliver high-probability trading signals directly to your Telegram.
            </p>
            <div className={styles.heroBtns}>
              <a href="/auth?plan=7-Day%20Trial" className="btn btn-primary">Start 7-Day Trial</a>
              <a href="/auth?plan=Silver%20Monthly" className="btn btn-outline">View Live Signals</a>
            </div>
          </div>
        </div>

        <div className={styles.statsContainer}>
          <div className="container">
            <div className={`${styles.statsGrid} glass`}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>92%</div>
                <div className={styles.statLabel}>Signal Accuracy</div>
              </div>
              <div className={styles.divider}></div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>24/7</div>
                <div className={styles.statLabel}>Market Monitoring</div>
              </div>
              <div className={styles.divider}></div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>0ms</div>
                <div className={styles.statLabel}>Execution Delay</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className={styles.features}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Why Choose Our Signals?</h2>
          <div className={styles.featuresGrid}>
            <div className={`${styles.featureCard} glass`}>
              <div className={styles.featureIcon}>📈</div>
              <h3>Rule-Based Logic</h3>
              <p>No emotions, just data. Our signals are generated based on strict mathematical models and historical backtesting.</p>
            </div>
            <div className={`${styles.featureCard} glass`}>
              <div className={styles.featureIcon}>📱</div>
              <h3>Telegram Delivery</h3>
              <p>Instant alerts on your mobile. Never miss a trade with our optimized Telegram bot integration.</p>
            </div>
            <div className={`${styles.featureCard} glass`}>
              <div className={styles.featureIcon}>💎</div>
              <h3>Focus on Metals</h3>
              <p>We specialize exclusively in XAUUSD and XAGUSD, giving you deep market insights and better precision.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className={styles.pricing}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Simple, Transparent Pricing</h2>
          <div className={styles.pricingGrid}>
            <div className={`${styles.priceCard} glass`}>
              <h3>Silver Monthly</h3>
              <div className={styles.priceAmount}>$49<span>/mo</span></div>
              <ul className={styles.priceList}>
                <li>✅ Gold (XAUUSD) Signals</li>
                <li>✅ Silver (XAGUSD) Signals</li>
                <li>✅ 24/7 Telegram Bot Alerts</li>
                <li>✅ 1:3 Risk/Reward Strategy</li>
                <li>✅ Web Dashboard Access</li>
              </ul>
              <a href="/auth?plan=Silver%20Monthly" className="btn btn-outline">Start Monthly</a>
            </div>
            <div className={`${styles.priceCard} ${styles.popular} glass`}>
              <div className={styles.popularBadge}>Best Value (Save 50%)</div>
              <h3>Gold Yearly</h3>
              <div className={styles.priceAmount}>$299<span>/yr</span></div>
              <ul className={styles.priceList}>
                <li>✅ All Monthly Features</li>
                <li>✅ 24/7 Telegram Bot alerts</li>
                <li>✅ Priority Support Tickets</li>
                <li>✅ Strategy Analysis Reports</li>
                <li>✅ 50% Discount vs Monthly</li>
              </ul>
              <a href="/auth?plan=Gold%20Yearly" className="btn btn-primary">Go Yearly VIP</a>
            </div>
          </div>
        </div>
      </section>

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
    </main>
  )
}
