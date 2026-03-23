import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service – PropLink',
  description: 'The terms and conditions governing your use of the PropLink property marketplace.',
}

const LAST_UPDATED = 'March 2025'

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3">Terms of Service</h1>
        <p className="text-sm text-zinc-400">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="prose max-w-none">
        <p>
          Welcome to PropLink. By accessing or using our platform, you agree to be bound by these Terms of Service.
          Please read them carefully before using our services. If you do not agree, do not use PropLink.
        </p>

        <h2>1. Who We Are</h2>
        <p>
          PropLink is an online property listing marketplace that connects property sellers with potential buyers
          in Nigeria. We provide the platform; we are not a real estate agent, broker, or party to any
          transaction between buyers and sellers.
        </p>

        <h2>2. Eligibility</h2>
        <p>To use PropLink, you must:</p>
        <ul>
          <li>Be at least 18 years of age</li>
          <li>Have legal capacity to enter into contracts under Nigerian law</li>
          <li>Provide accurate and truthful information when creating an account</li>
          <li>Have a valid WhatsApp number (for sellers)</li>
        </ul>

        <h2>3. Seller Accounts</h2>
        <p>If you register as a seller, you agree to:</p>
        <ul>
          <li>Provide accurate, complete, and up-to-date information about yourself and your listings</li>
          <li>Only list properties that you have legal authority to sell or advertise</li>
          <li>Maintain a valid and active WhatsApp number on your profile</li>
          <li>Respond to buyer inquiries in a reasonable timeframe</li>
          <li>Update or remove listings that are no longer available</li>
          <li>Keep your account credentials confidential</li>
        </ul>
        <p>
          One person may not create multiple accounts. We reserve the right to suspend or terminate accounts
          found to be duplicated or fraudulent.
        </p>

        <h2>4. Prohibited Listings and Conduct</h2>
        <p>The following are strictly prohibited on PropLink:</p>
        <ul>
          <li>Listing properties you do not own or have no authority to advertise</li>
          <li>Publishing false, misleading, or deceptive information in any listing</li>
          <li>Using stolen, edited, or misrepresented photos</li>
          <li>Listing properties outside Nigeria</li>
          <li>Spamming, scraping, or automated bulk submissions</li>
          <li>Any activity that violates Nigerian law, including the Land Use Act</li>
          <li>Harassing or threatening other users</li>
          <li>Attempting to circumvent our platform's security measures</li>
        </ul>
        <p>
          Violations may result in immediate account suspension and removal of all listings without notice.
        </p>

        <h2>5. PropLink's Role</h2>
        <p>
          PropLink is a listing platform only. We do not:
        </p>
        <ul>
          <li>Verify the ownership or legal status of any listed property</li>
          <li>Handle payments, deposits, or escrow on behalf of users</li>
          <li>Guarantee the accuracy of any listing</li>
          <li>Act as an agent or represent any buyer or seller</li>
        </ul>
        <p>
          All transactions are made directly between buyers and sellers. PropLink bears no liability for
          any loss, fraud, or dispute arising from such transactions.
        </p>

        <h2>6. Buyer Responsibility</h2>
        <p>Buyers are responsible for:</p>
        <ul>
          <li>Conducting their own due diligence before making any payment</li>
          <li>Physically verifying a property before completing a transaction</li>
          <li>Engaging a qualified surveyor or lawyer where appropriate</li>
          <li>Not transferring money to any party without proper documentation</li>
        </ul>
        <p>
          <strong>PropLink strongly advises against making any payment before physically inspecting
          a property and verifying the seller's identity and ownership documents.</strong>
        </p>

        <h2>7. Intellectual Property</h2>
        <p>
          By uploading photos or content to PropLink, you grant us a non-exclusive, royalty-free licence to
          display and use that content on the platform. You retain ownership of your content and may remove
          it by deleting your listing. You must only upload content you own or have rights to use.
        </p>
        <p>
          The PropLink name, logo, and platform design are our intellectual property and may not be copied,
          modified, or used without our written permission.
        </p>

        <h2>8. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, PropLink and its operators shall not be liable for any
          direct, indirect, incidental, special, or consequential damages arising from your use of the platform,
          including but not limited to:
        </p>
        <ul>
          <li>Financial losses from property transactions</li>
          <li>Fraudulent listings or misrepresentation by sellers</li>
          <li>Loss of data or interruption of service</li>
          <li>Reliance on inaccurate listing information</li>
        </ul>

        <h2>9. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your account at any time, with or without notice,
          for violation of these Terms or for any conduct we deem harmful to the platform or its users.
          You may also delete your account at any time by contacting us.
        </p>

        <h2>10. Changes to These Terms</h2>
        <p>
          We may update these Terms of Service from time to time. Continued use of PropLink after any update
          constitutes acceptance of the revised terms. We will notify users of material changes via the
          platform or by email.
        </p>

        <h2>11. Governing Law</h2>
        <p>
          These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes arising from
          your use of PropLink shall be subject to the jurisdiction of Nigerian courts.
        </p>

        <h2>12. Contact</h2>
        <p>
          For questions about these Terms, contact us at:
        </p>
        <ul>
          <li>Email: <a href="mailto:hello@proplink.ng">hello@proplink.ng</a></li>
          <li>WhatsApp: +234 800 000 0000</li>
        </ul>
      </div>

      <div className="mt-10 pt-6 border-t border-zinc-200 flex flex-wrap gap-4 text-sm">
        <Link href="/privacy" className="text-[#0568fd] hover:underline">Privacy Policy</Link>
        <Link href="/contact" className="text-zinc-500 hover:text-zinc-800">Contact Us</Link>
        <Link href="/" className="text-zinc-500 hover:text-zinc-800">Back to Home</Link>
      </div>
    </div>
  )
}
