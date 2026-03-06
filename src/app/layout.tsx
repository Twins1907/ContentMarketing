import type { Metadata } from "next";
import { Inria_Sans, Bebas_Neue } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const SITE_URL = "https://getorbyt.io";

const inriaSans = Inria_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Orbyt — AI Content Strategy Generator | Social Media Content Plans in Minutes",
    template: "%s | Orbyt",
  },
  description:
    "Generate a complete social media content strategy with AI. Get audience personas, content calendars, and production-ready briefs for every post. Free to start.",
  keywords: [
    "AI content strategy",
    "social media content plan",
    "content calendar generator",
    "AI marketing tool",
    "content brief generator",
    "social media strategy",
    "content marketing AI",
    "TikTok content plan",
    "Instagram content strategy",
    "YouTube content calendar",
  ],
  authors: [{ name: "E2 Partners LLC" }],
  creator: "E2 Partners LLC",
  publisher: "E2 Partners LLC",
  openGraph: {
    title: "Orbyt — Your $3,000 Content Strategist, for Free",
    description:
      "AI-generated content strategies with production-ready briefs for every post. Free to start.",
    url: SITE_URL,
    siteName: "Orbyt",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Orbyt — AI Content Strategy Generator",
    description:
      "Generate a complete social media content strategy with AI. Free to start.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: "GXvlR41qqSs93doWJ08D2bGhqlqvMWrYTGj03msckE8",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inriaSans.variable} ${bebasNeue.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
