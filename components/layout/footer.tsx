import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--muted)]">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[var(--primary)] tracking-[var(--letter-spacing)]">PropLink</h3>
            <p className="text-sm text-[var(--muted-foreground)] tracking-[var(--letter-spacing)]">
              Your trusted platform for buying and selling properties in Nigeria.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-[var(--foreground)] tracking-[var(--letter-spacing)] text-base">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors tracking-[var(--letter-spacing)]">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors tracking-[var(--letter-spacing)]">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors tracking-[var(--letter-spacing)]">
                  List Your Property
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="font-semibold text-[var(--foreground)] tracking-[var(--letter-spacing)] text-base">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors tracking-[var(--letter-spacing)]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors tracking-[var(--letter-spacing)]">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors tracking-[var(--letter-spacing)]">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="font-semibold text-[var(--foreground)] tracking-[var(--letter-spacing)] text-base">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors tracking-[var(--letter-spacing)]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors tracking-[var(--letter-spacing)]">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--border)] pt-6 sm:pt-8 text-center text-xs sm:text-sm text-[var(--muted-foreground)] tracking-[var(--letter-spacing)]">
          <p className='pt-4'>&copy; {currentYear} PropLink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
