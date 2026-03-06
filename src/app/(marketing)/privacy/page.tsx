import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Orbyt by E2 Partners LLC collects, uses, and protects your personal and business information.",
  alternates: {
    canonical: "https://getorbyt.io/privacy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#FFF8F0] py-16">
      <div className="max-w-3xl mx-auto px-4">
        <span className="inline-block bg-[#FFA6F6] text-black border-2 border-black shadow-[2px_2px_0px_#000000] rounded-full px-4 py-1 text-sm font-medium mb-4">
          Legal
        </span>
        <h1 className="font-display text-4xl md:text-5xl text-black mb-2">
          PRIVACY POLICY
        </h1>
        <p className="text-[#666] mb-10">Last updated: March 5, 2026</p>

        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_#000000] rounded-xl p-6 md:p-8 space-y-8">
          <Section n="1" title="Introduction">
            E2 Partners LLC (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the Orbyt platform (the &quot;Service&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service. By accessing or using Orbyt, you agree to the terms of this Privacy Policy.
          </Section>

          <Section n="2" title="Information We Collect">
            <p className="text-sm text-[#333] leading-relaxed mb-3">We may collect the following types of information:</p>
            <div className="space-y-3">
              <Sub title="Personal Information">
                When you create an account, we collect your name, email address, and authentication details (e.g., Google OAuth). If you subscribe to the Starter ($19/month) or Pro ($39/month) plan, payment processing is handled by Stripe — we do not store your full credit card number. We store your Stripe customer ID and subscription status to manage your plan access.
              </Sub>
              <Sub title="Business Information">
                To generate your content strategy, we collect information you provide about your business, including business name, industry, description, website, target audience, platforms, goals, content tone, budget, and other preferences.
              </Sub>
              <Sub title="Usage Data">
                We automatically collect certain information when you use the Service, including your IP address, browser type, operating system, pages visited, and interactions with the platform.
              </Sub>
            </div>
          </Section>

          <Section n="3" title="How We Use Your Information">
            <ul className="list-disc list-inside text-sm text-[#333] space-y-2 leading-relaxed">
              <li>To provide, operate, and maintain the Service</li>
              <li>To generate personalized content strategies based on your business information</li>
              <li>To process transactions and manage your account</li>
              <li>To send you service-related communications (e.g., account verification, updates)</li>
              <li>To improve and optimize the Service</li>
              <li>To detect, prevent, and address technical issues or fraud</li>
              <li>To comply with legal obligations</li>
            </ul>
          </Section>

          <Section n="4" title="Sharing Your Information">
            <p className="text-sm text-[#333] leading-relaxed mb-3">We do not sell your personal information. We may share your information only in the following circumstances:</p>
            <ul className="list-disc list-inside text-sm text-[#333] space-y-2 leading-relaxed">
              <li><strong className="text-black">Service Providers:</strong> We share data with third-party providers that assist us in operating the Service (e.g., Stripe for payments, cloud hosting providers, AI model providers for strategy generation).</li>
              <li><strong className="text-black">Legal Requirements:</strong> We may disclose your information if required by law, regulation, or legal process.</li>
              <li><strong className="text-black">Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.</li>
            </ul>
          </Section>

          <Section n="5" title="Data Security">
            We implement industry-standard security measures to protect your information, including encryption in transit (TLS/SSL), secure database storage, and access controls. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </Section>

          <Section n="6" title="Data Retention">
            We retain your personal and business information for as long as your account is active or as needed to provide the Service. You may request deletion of your account and associated data at any time by contacting us at hello@e2partners.co.
          </Section>

          <Section n="7" title="Your Rights">
            <p className="text-sm text-[#333] leading-relaxed mb-3">Depending on your jurisdiction, you may have the following rights:</p>
            <ul className="list-disc list-inside text-sm text-[#333] space-y-2 leading-relaxed">
              <li>Access, correct, or delete your personal information</li>
              <li>Object to or restrict certain processing of your data</li>
              <li>Data portability — receive your data in a structured, machine-readable format</li>
              <li>Withdraw consent for data processing at any time</li>
            </ul>
            <p className="text-sm text-[#333] leading-relaxed mt-3">
              To exercise any of these rights, please contact us at <a href="mailto:hello@e2partners.co" className="text-[#918EFA] underline font-medium">hello@e2partners.co</a>.
            </p>
          </Section>

          <Section n="8" title="Cookies">
            We use essential cookies to maintain your session and authentication state. We do not use third-party advertising or tracking cookies. You can configure your browser to refuse cookies, but some features of the Service may not function properly.
          </Section>

          <Section n="9" title="Third-Party Services">
            The Service may contain links to third-party websites or integrate with third-party services (e.g., Google OAuth, Stripe). We are not responsible for the privacy practices of these third parties and encourage you to review their respective privacy policies.
          </Section>

          <Section n="10" title="Children's Privacy">
            The Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will promptly delete it.
          </Section>

          <Section n="11" title="Changes to This Policy">
            We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on this page and updating the &quot;Last updated&quot; date. Your continued use of the Service after any changes constitutes acceptance of the updated policy.
          </Section>

          <Section n="12" title="Contact Us">
            <p className="text-sm text-[#333] leading-relaxed mb-3">If you have questions about this Privacy Policy or our data practices, please contact us at:</p>
            <div className="bg-[#FFA6F6]/20 border-2 border-black rounded-xl p-4 shadow-[2px_2px_0px_#000000]">
              <p className="text-sm font-bold text-black">E2 Partners LLC</p>
              <p className="text-sm text-[#333]">
                Email: <a href="mailto:hello@e2partners.co" className="text-[#918EFA] underline font-medium">hello@e2partners.co</a>
              </p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl text-black mb-3">{n}. {title}</h2>
      {typeof children === "string" ? (
        <p className="text-sm text-[#333] leading-relaxed">{children}</p>
      ) : (
        children
      )}
    </section>
  );
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-black mb-1">{title}</h3>
      <p className="text-sm text-[#333] leading-relaxed">{children}</p>
    </div>
  );
}
