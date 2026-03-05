import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
          Terms &amp; Conditions
        </h1>
        <p className="text-muted-foreground mb-10">
          Last updated: March 5, 2026
        </p>

        <Card className="border-2 border-foreground shadow-[3px_3px_0px_#272727]">
          <CardContent className="pt-8 pb-8 prose prose-sm max-w-none space-y-8">
            {/* 1 */}
            <section>
              <h2 className="font-display text-xl font-bold mb-3">1. Agreement to Terms</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                By accessing or using the LaunchMap platform (the &quot;Service&quot;), operated by E2 Partners LLC (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these Terms and Conditions (&quot;Terms&quot;). If you do not agree to these Terms, you may not use the Service.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="font-display text-xl font-bold mb-3">2. Description of Service</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                LaunchMap is an AI-powered content strategy platform that generates social media strategies, content calendars, and per-post content briefs based on information you provide about your business. The Service uses artificial intelligence to create recommendations and content suggestions.
              </p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="font-display text-xl font-bold mb-3">3. Account Registration</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To use certain features of the Service, you must create an account. You agree to provide accurate, current, and complete information during registration and to keep your account information up to date. You are responsible for safeguarding your account credentials and for all activities that occur under your account.
              </p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="font-display text-xl font-bold mb-3">4. Plans and Pricing</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-bold mb-1">Free Plan</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The free plan provides one AI-generated content strategy with a limited calendar preview and content briefs. No payment is required.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1">Starter Plan</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The Starter plan is a one-time purchase that unlocks the full calendar and all content briefs for a single strategy. Access is perpetual once purchased.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1">Pro Plan</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The Pro plan is a monthly subscription that provides unlimited strategy generation, multiple business profiles, and priority features. You may cancel your subscription at any time; access continues until the end of the current billing period.
                  </p>
                </div>
              </div>
            </section>

            {/* 5 */}
            <section>
              <h2 className="font-display text-xl font-bold mb-3">5. Payments and Refunds</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                All payments are processed securely through Stripe. By making a purchase, you authorize us to charge the applicable fees to your payment method.
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 leading-relaxed">
                <li><span className="font-semibold text-foreground">Starter Plan:</span> One-time payment. We offer a 7-day money-back guarantee — if you are not satisfied, contact us within 7 days of purchase for a full refund.</li>
                <li><span className="font-semibold text-foreground">Pro Plan:</span> Billed monthly. You may cancel at any time. Refunds for the current billing period are not provided upon cancellation, but you retain access until the period ends.</li>
              </ul>
            </section>

            {/* 6 */}
            <section>
              <h2 className="font-display text-xl font-bold mb-3">6. AI-Generated Content</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                The strategies, content briefs, and recommendations generated by the Service are produced by artificial intelligence and are intended as suggestions and starting points. You acknowledge that:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 leading-relaxed">
                <li>AI-generated content may not always be accurate, complete, or suitable for your specific needs</li>
                <li>You are solely responsible for reviewing, editing, and approving all content before publishing</li>
                <li>The Company does not guarantee any specific business results from using the generated strategies</li>
                <li>You should use your own judgment and, where appropriate, consult with a professional before acting on any recommendations</li>
              </ul>
            </section>

            {/* 7 */}
            <section>
              <h2 className="font-display text-xl font-bold mb-3">7. Intellectual Property</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-bold mb-1">Your Content</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    You retain ownership of all business information and content you provide to the Service. By using the Service, you grant us a limited license to process this information solely for the purpose of generating your strategies.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1">Generated Content</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Content strategies, briefs, and recommendations generated by the Service are licensed to you for your personal or business use. You may use, modify, and publish the generated content as you see fit.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1">Our Platform</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The Service, including its design, code, algorithms, and branding, is owned by E2 Partners LLC and protected by intellectual property laws. You may not copy, modify, distribute, or reverse-engineer any part of the platform.
                  </p>
                </div>
              </div>
            </section>

            {/* 8 */}
            <section>
              <h2 className="font-display text-xl font-bold mb-3">8. Acceptable Use</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 leading-relaxed">
                <li>Violate any applicable laws or regulations</li>
                <li>Generate content that is defamatory, obscene, fraudulent, or harmful</li>
                <li>Impersonate any person or entity</li>
                <li>Interfere with or disrupt the Service or its infrastructure</li>
                <li>Attempt to gain unauthorized access to any part of the Service</li>
                <li>Use the Service to compete directly with LaunchMap</li>
              </ul>
            </section>

            {/* 9 */}
            <section>
              <h2 className="font-display text-xl font-bold mb-3">9. Limitation of Liability</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law, E2 Partners LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service, including but not limited to loss of revenue, loss of data, or business interruption. Our total liability for any claim arising from the Service shall not exceed the amount you paid to us in the twelve (12) months preceding the claim.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="font-display text-xl font-bold mb-3">10. Disclaimer of Warranties</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Service will be uninterrupted, error-free, or secure.
              </p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="font-display text-xl font-bold mb-3">11. Termination</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We may suspend or terminate your access to the Service at any time for violation of these Terms or for any other reason at our discretion. You may delete your account at any time by contacting us. Upon termination, your right to use the Service ceases immediately.
              </p>
            </section>

            {/* 12 */}
            <section>
              <h2 className="font-display text-xl font-bold mb-3">12. Governing Law</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the United States. Any disputes arising from these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
              </p>
            </section>

            {/* 13 */}
            <section>
              <h2 className="font-display text-xl font-bold mb-3">13. Changes to Terms</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on this page and updating the &quot;Last updated&quot; date. Your continued use of the Service after changes constitutes acceptance of the revised Terms.
              </p>
            </section>

            {/* 14 */}
            <section>
              <h2 className="font-display text-xl font-bold mb-3">14. Contact Us</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="mt-3 p-4 rounded-xl bg-[#89CFF0]/10 border-2 border-foreground">
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
