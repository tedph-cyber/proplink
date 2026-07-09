import type { Metadata } from "next";
import { Hanken_Grotesk, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://strongtowerholdings.com.ng'),
  title: {
    default: "StrongTower Holdings — Find Your Perfect Property",
    template: "%s | StrongTower Holdings",
  },
  description:
    "Browse houses and land for sale across Nigeria. Contact owners directly — no agents, no middlemen.",
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    siteName: 'StrongTower Holdings',
    title: "StrongTower Holdings — Find Your Perfect Property",
    description:
      "Browse houses and land for sale across Nigeria. Contact owners directly — no agents, no middlemen.",
  },
  twitter: {
    card: 'summary_large_image',
    title: "StrongTower Holdings — Find Your Perfect Property",
    description:
      "Browse houses and land for sale across Nigeria. Contact owners directly — no agents, no middlemen.",
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${hanken.variable} ${bricolage.variable}`} data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var t = localStorage.getItem('st-theme');
              if (!t) {
                t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                localStorage.setItem('st-theme', t);
              }
              document.documentElement.setAttribute('data-theme', t);
            })()
          `,
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}