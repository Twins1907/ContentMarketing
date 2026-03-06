import type { Metadata } from "next";
import { Inria_Sans, Bebas_Neue } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inriaSans = Inria_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Orbyt — AI Content Strategy Generator | Social Media Content Plans in Minutes",
  description:
    "Generate a complete social media content strategy with AI. Get audience personas, content calendars, and production-ready briefs for every post. Free to start.",
  openGraph: {
    title: "Orbyt — Your $3,000 Content Strategist, for Free",
    description:
      "AI-generated content strategies with production-ready briefs for every post. Free to start.",
    url: "https://getorbyt.io",
    siteName: "Orbyt",
    type: "website",
  },
  alternates: {
    canonical: "https://getorbyt.io",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inriaSans.variable} ${bebasNeue.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
