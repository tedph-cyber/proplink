import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "600"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StrongTower Holdings — Find Your Perfect Property",
  description:
    "Browse houses and land for sale across Nigeria. Contact owners directly — no agents, no middlemen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  );
}