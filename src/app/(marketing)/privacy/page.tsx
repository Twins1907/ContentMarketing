import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mb-10">
          Last updated: March 5, 2026
        </p>

        <Card className="border-2 border-foreground shadow-[3px_3px_0px_#272727]">
          <CardContent className="pt-8 pb-8 prose prose-sm max-w-none space-y-8">
            {/* 1 */}
            <section>
              <h2 className="font-display text-xl font-bold mb-3">1. Introduction</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                E2 Partners LLC (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the Orbyt platform (the &quot;Service&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service. By accessing or using Orbyt, you agree to the terms of this Privacy Policy.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="font-display text-xl font-bold mb-3">2. Information We Collect</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                We may collect the following types of information:
              </p>
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-bold mb-1">Personal Information</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    When you create an account, we collect your name, email address, and authentication details (e.g., Google OAuth). If you subscribe to the Starter ($19/month) or Pro ($39/month) plan, payment processing is handled by Stripe — we do not store your full credit card number. We store your Stripe customer ID and subscription status to manage your plan access.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1">Business Information</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    To generate your content strategy, we collect information you provide about your business, including business name, industry, description, website, target audience, platforms, goals, content tone, budget, and other preferences.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1">Usage Data</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We automatically collect certain information when you use the Service, including your IP address, browser type, operating system, pages visited, and interactions with the platform.
                  </p>
                </div>
              </div>
            </section>

            {/* 3 */}
            <section>
              <h2 className="font-display text-xl font-bold mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 leading-relaxed">
                <li>To provide, operate, and maintain the Service</li>
                <li>To generate personalized content strategies based on your business information</li>
                <li>To process transactions and manage your account</li>
                <li>To send you service-related communications (e.g., account verification, updates)</li>
                <li>To improve and optimize the Service</li>
                <li>To detect, prevent, and address technical issues or fraud</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            {/* 4 */}
            <section>
              <h2 className="font-display text-xl font-bold mb-3">4. Sharing Your Information</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 leading-relaxed">
                <li><span className="font-semibold text-foreground">Service Providers:</span> We share data with third-party providers that assist us in operating the Service (e.g., Stripe for payments, cloud hosting providers, AI model providers for strategy generation).</li>
                <li><span className="font-semibold text-foreground">Legal Requirements:</span> We may disclose your information if required by law, regulation, or legal process.</li>
                <li><span className="font-semibold text-foreground">Business Transfers:</span> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.</li>
              </ul>
            </section>

            {/* 5 */}
            <section>
              <h2 className="font-display text-xl font-bold mb-3">5. Data Security</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We implement industry-standard security measures to protect your information, including encryption in transit (TLS/SSL), secure database storage, and access controls. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="font-display text-xl font-bold mb-3">6. Data Retention</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We retain your personal and business information for as long as your account is active or as needed to provide the Service. You may request deletion of your account and associated data at any time by contacting us at hello@e2partners.co.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="font-display text-xl font-bold mb-3">7. Your Rights</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Depending on your jurisdiction, you may have the following rights:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 leading-relaxed">
                <li>Access, correct, or delete your personal information</li>
                <li>Object to or restrict certain processing of your data</li>
                <li>Data portability — receive your data in a structured, machine-readable format</li>
                <li>Withdraw consent for data processing at any time</li>
              </ul>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                To exercise any of these rights, please contact us at <a href="mailto:hello@e2partners.co" className="text-[#C9A7EB] underline">hello@e2partners.co</a>.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="font-display text-xl font-bold mb-3">8. Cookies</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We use essential cookies to maintain your session and authentication state. We do not use third-party advertising or tracking cookies. You can configure your browser to refuse cookies, but some features of the Service may not function properly.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="font-display text-xl font-bold mb-3">9. Third-Party Services</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Service may contain links to third-party websites or integrate with third-party services (e.g., Google OAuth, Stripe). We are not responsible for the privacy practices of these third parties and encourage you to review their respective privacy policies.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="font-display text-xl font-bold mb-3">10. Children&apos;s Privacy</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will promptly delete it.
              </p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="font-display text-xl font-bold mb-3">11. Changes to This Policy</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on this page and updating the &quot;Last updated&quot; date. Your continued use of the Service after any changes constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* 12 */}
            <section>
              <h2 className="font-display text-xl font-bold mb-3">12. Contact Us</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="mt-3 p-4 rounded-xl bg-[#C9A7EB]/10 border-2 border-foreground">
                <p className="text-sm font-bold">E2 Partners LLC</p>
                <p className="text-sm text-muted-foreground">
                  Email: <a href="mailto:hello@e2partners.co" className="text-[#C9A7EB] underline">hello@e2partners.co</a>
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
