import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy',
  description: 'How StrongTower Holdings collects, uses, and protects your personal information.',
  robots: { index: false },
}

const LAST_UPDATED = 'March 2025'

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3">Privacy Policy</h1>
        <p className="text-sm text-zinc-400">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="prose max-w-none">
        <p>
          PropLink ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how
          we collect, use, disclose, and safeguard your information when you visit our website or use our services.
          Please read this policy carefully.
        </p>

        <h2>1. Information We Collect</h2>
        <p>We collect the following types of information:</p>
        <ul>
          <li>
            <strong>Account Information:</strong> When you create a seller account, we collect your email address,
            WhatsApp number, account type (individual or company), and optional company name.
          </li>
          <li>
            <strong>Listing Information:</strong> Property details you submit including title, description, location,
            price, photos, and features.
          </li>
          <li>
            <strong>Usage Data:</strong> We may collect non-personally identifiable information about how you interact
            with our platform, including pages visited, search queries, and browser type.
          </li>
          <li>
            <strong>Communications:</strong> If you contact us, we retain records of that correspondence.
          </li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Create and manage your seller account</li>
          <li>Display your property listings to potential buyers</li>
          <li>Allow buyers to contact you directly via WhatsApp</li>
          <li>Send transactional communications (e.g., listing confirmations)</li>
          <li>Improve our platform and user experience</li>
          <li>Detect and prevent fraudulent activity</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>3. Information Shared with Others</h2>
        <p>
          When you publish a property listing, the following information becomes publicly visible to all users
          (including non-registered visitors):
        </p>
        <ul>
          <li>Property title, description, location, price, and photos</li>
          <li>Your WhatsApp number (displayed as a contact button on your listing)</li>
          <li>Your account type (individual or company name)</li>
        </ul>
        <p>
          We do not sell, rent, or trade your personal information to third parties for marketing purposes.
          We may share information with service providers (such as Supabase for database hosting) solely to
          operate the platform, under strict confidentiality agreements.
        </p>

        <h2>4. Data Storage and Security</h2>
        <p>
          Your data is stored securely using Supabase, a GDPR-compliant infrastructure provider.
          We implement industry-standard security measures including encrypted connections (HTTPS),
          row-level security on our database, and access controls. However, no method of transmission
          or storage is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2>5. Cookies</h2>
        <p>
          PropLink uses essential cookies to maintain your login session and remember your preferences.
          We do not use advertising or tracking cookies. You can disable cookies in your browser settings,
          but this may affect the functionality of certain features (such as staying logged in).
        </p>

        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li><strong>Access</strong> the personal information we hold about you</li>
          <li><strong>Correct</strong> inaccurate or incomplete information via your profile settings</li>
          <li><strong>Delete</strong> your account and associated data by contacting us</li>
          <li><strong>Object</strong> to certain processing of your personal data</li>
          <li><strong>Withdraw consent</strong> where processing is based on your consent</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at <a href="mailto:strongtowerholdingsglobal@gmail.com">strongtowerholdingsglobal@gmail.com</a>.
        </p>

        <h2>7. Third-Party Links</h2>
        <p>
          Our platform contains links to external websites and WhatsApp. We are not responsible for the
          privacy practices or content of those sites. We encourage you to review their privacy policies before
          sharing any personal information with them.
        </p>

        <h2>8. Children's Privacy</h2>
        <p>
          PropLink is not intended for use by persons under 18 years of age. We do not knowingly collect
          personal information from minors. If you believe a minor has created an account, please contact us
          and we will promptly remove their information.
        </p>

        <h2>9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of significant changes by
          posting the new policy on this page with a revised "Last updated" date. Continued use of PropLink
          after changes constitutes acceptance of the updated policy.
        </p>

        <h2>10. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or our data practices, please contact us:
        </p>
        <ul>
          <li>Email: <a href="mailto:strongtowerholdingsglobal@gmail.com">strongtowerholdingsglobal@gmail.com</a></li>
          <li>WhatsApp: +234 703 520 9012</li>
        </ul>
      </div>

      <div className="mt-10 pt-6 border-t border-zinc-200 flex flex-wrap gap-4 text-sm">
        <Link href="/terms" className="text-[#0568fd] hover:underline">Terms of Service</Link>
        <Link href="/contact" className="text-zinc-500 hover:text-zinc-800">Contact Us</Link>
        <Link href="/" className="text-zinc-500 hover:text-zinc-800">Back to Home</Link>
      </div>
    </div>
  )
}
