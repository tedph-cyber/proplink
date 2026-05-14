import Link from 'next/link'
import styles from '@/styles/footer.module.css'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brandColumn}>
            <h3 className={styles.brandName}>
              <span className={styles.brandNameAccent}>Strong</span>Tower
            </h3>
            <p className={styles.brandDesc}>
              Your trusted platform for buying and selling properties in Nigeria.
              No agents, no middlemen, no noise.
            </p>
          </div>

          {/* Quick Links */}
          <div className={styles.linkColumn}>
            <h4 className={styles.linkHeading}>Quick Links</h4>
            <ul className={styles.linkList}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/properties">Browse Properties</Link></li>
              <li><Link href="/register">List Your Property</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className={styles.linkColumn}>
            <h4 className={styles.linkHeading}>Support</h4>
            <ul className={styles.linkList}>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className={styles.linkColumn}>
            <h4 className={styles.linkHeading}>Legal</h4>
            <ul className={styles.linkList}>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {currentYear} StrongTower Holdings. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
