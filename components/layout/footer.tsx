import Link from 'next/link'
import { Instagram, Twitter, Linkedin } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import styles from '@/styles/footer.module.css'

export async function Footer() {
  const currentYear = new Date().getFullYear()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const listPropertyHref = user ? '/dashboard/properties/new' : '/register'

  return (
    <footer className={styles.footer}>
      <div className="container-base">
        <div className={styles.footerTop}>
          {/* Brand column */}
          <div>
            <div className={styles.footerLogo}>
              <div className={styles.footerLogoName}>
                <span className={styles.footerLogoStrong}>Strong</span>
                <span className={styles.footerLogoTower}>Tower</span>
              </div>
              <span className={styles.footerLogoHoldings}>Holdings</span>
            </div>
            <p className={styles.footerBlurb}>
              Nigeria&rsquo;s most trusted marketplace for buying and selling property. No agents, no middlemen, no noise.
            </p>
            <div className={styles.footerSocial}>
              <a href="#" className={styles.footerSoc} aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className={styles.footerSoc} aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className={styles.footerSoc} aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className={styles.footerCols}>
            <div className={styles.footerCol}>
              <h4>Explore</h4>
              <Link href="/properties" className={styles.footerItem}>
                All Properties
              </Link>
              <Link href="/properties?state=Lagos" className={styles.footerItem}>
                Lagos
              </Link>
              <Link href="/properties?state=Abuja" className={styles.footerItem}>
                Abuja
              </Link>
              <Link href="/properties?state=Port%20Harcourt" className={styles.footerItem}>
                Port Harcourt
              </Link>
              <Link href="/properties?type=Land" className={styles.footerItem}>
                Land &amp; Plots
              </Link>
            </div>

            <div className={styles.footerCol}>
              <h4>Company</h4>
              <Link href="/about" className={styles.footerItem}>
                Our Story
              </Link>
              <Link href="/how-it-works" className={styles.footerItem}>
                How It Works
              </Link>
              <Link href="/why-us" className={styles.footerItem}>
                Why Us
              </Link>
              <Link href="/blog" className={styles.footerItem}>
                Journal
              </Link>
            </div>

            <div className={styles.footerCol}>
              <h4>Support</h4>
              <Link href="/contact" className={styles.footerItem}>
                Help Centre
              </Link>
              <Link href={listPropertyHref} className={styles.footerItem}>
                List a Property
              </Link>
              <Link href="/faq" className={styles.footerItem}>
                FAQ
              </Link>
            </div>

            <div className={styles.footerCol}>
              <h4>Legal</h4>
              <Link href="/terms" className={styles.footerItem}>
                Terms of Service
              </Link>
              <Link href="/privacy" className={styles.footerItem}>
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>&copy; {currentYear} StrongTower Holdings. All rights reserved.</span>
          <span>Made in Nigeria</span>
        </div>
      </div>
    </footer>
  )
}
