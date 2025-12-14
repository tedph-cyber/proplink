import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-zinc-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-900">PropLink</h3>
            <p className="text-sm text-zinc-600">
              Your trusted platform for buying and selling properties in Nigeria.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-zinc-900">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-zinc-600 hover:text-zinc-900">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-zinc-600 hover:text-zinc-900">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-zinc-600 hover:text-zinc-900">
                  List Your Property
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="font-semibold text-zinc-900">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-zinc-600 hover:text-zinc-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-600 hover:text-zinc-900">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-zinc-600 hover:text-zinc-900">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="font-semibold text-zinc-900">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-zinc-600 hover:text-zinc-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-zinc-600 hover:text-zinc-900">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-zinc-600">
          <p>&copy; {currentYear} PropLink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
