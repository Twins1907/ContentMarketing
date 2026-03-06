"use client";

import { useState, Suspense } from "react";
import { signIn, getProviders } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Rocket, Play, Mail, Loader2, CheckCircle } from "lucide-react";

function AuthContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const error = searchParams.get("error");
  const verified = searchParams.get("verified");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const hasGoogle = !!(
    typeof window !== "undefined" &&
    (window as Window & { __NEXT_DATA__?: { props?: { providers?: Record<string, unknown> } } }).__NEXT_DATA__
  );

  const handleDemo = async () => {
    setLoading("demo");
    await signIn("demo", { callbackUrl: "/dashboard" });
  };

  const handleGoogle = async () => {
    setLoading("google");
    await signIn("google", { callbackUrl });
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading("email");
    const result = await signIn("email", {
      email,
      callbackUrl,
      redirect: false,
    });
    setLoading(null);
    if (result?.ok) {
      setEmailSent(true);
    }
  };

  const checkProviders = async () => {
    const providers = await getProviders();
    return providers;
  };

  const [providers, setProviders] = useState<Record<string, { id: string; name: string }> | null>(null);

  if (!providers && typeof window !== "undefined") {
    checkProviders().then(setProviders);
  }

  const showGoogle = providers?.google;
  const showEmail = providers?.email;

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0] px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">Check your email</h2>
          <p className="text-muted-foreground mb-6">
            We sent a magic link to <strong>{email}</strong>. Click the link to sign in.
          </p>
          <Button variant="outline" onClick={() => setEmailSent(false)} className="w-full">
            Use a different email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-[#89CFF0] border-2 border-foreground rounded-lg flex items-center justify-center shadow-[3px_3px_0px_#272727]">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-3xl font-bold">Orbyt</span>
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 text-center">
            {error === "OAuthAccountNotLinked"
              ? "This email is already linked to another sign-in method."
              : error === "EmailSignin"
              ? "Could not send the magic link. Please try again."
              : "Something went wrong. Please try again."}
          </div>
        )}

        {verified && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 text-center">
            Email verified! You can now sign in.
          </div>
        )}

        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle className="font-display text-2xl">
              Get Your Free Strategy
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Create your AI-powered content strategy
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Demo Button */}
            <Button
              onClick={handleDemo}
              disabled={!!loading}
              className="w-full bg-[#E8614D] text-foreground border-2 border-foreground hover:bg-[#E8614D]/90 shadow-[3px_3px_0px_#272727] hover:shadow-[1px_1px_0px_#272727] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              size="lg"
            >
              {loading === "demo" ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              Try Demo Account
            </Button>

            {(showGoogle || showEmail) && (
              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                  or continue with
                </span>
              </div>
            )}

            {/* Google */}
            {showGoogle && (
              <Button
                onClick={handleGoogle}
                disabled={!!loading}
                variant="outline"
                className="w-full"
                size="lg"
              >
                {loading === "google" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                Continue with Google
              </Button>
            )}

            {/* Email */}
            {showEmail && (
              <>
                {showGoogle && (
                  <div className="relative">
                    <Separator />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                      or
                    </span>
                  </div>
                )}
                <form onSubmit={handleEmail} className="space-y-3">
                  <div>
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!!loading}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    {loading === "email" ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4 mr-2" />
                    )}
                    Continue with Email
                  </Button>
                </form>
              </>
            )}

            <p className="text-xs text-center text-muted-foreground pt-2">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <AuthContent />
    </Suspense>
  );
}
