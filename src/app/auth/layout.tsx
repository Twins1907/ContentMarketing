import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up — Get Your Free Content Strategy",
  description:
    "Create your free Orbyt account and generate a complete AI-powered social media content strategy in under 2 minutes. No credit card required.",
  openGraph: {
    title: "Sign Up for Orbyt — Free AI Content Strategy",
    description:
      "Create your free account and get a complete content strategy with audience persona, content calendar, and production-ready briefs.",
  },
  alternates: {
    canonical: "https://getorbyt.io/auth",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
