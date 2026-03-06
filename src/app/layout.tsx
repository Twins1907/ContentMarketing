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
  title: "Orbyt - AI-Powered Content Strategy",
  description:
    "Get a complete, customized content strategy with per-post briefs in minutes. AI-powered content strategy platform for any business.",
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
