"use client";

import { useState, Suspense } from "react";
import { signIn, getProviders } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Play, Mail, Loader2, CheckCircle, ArrowRight } from "lucide-react";

function AuthContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [providers, setProviders] = useState<Record<string, { id: string; name: string }> | null>(null);

  if (!providers && typeof window !== "undefined") {
    getProviders().then(setProviders);
  }

  const showGoogle = providers?.google;
  const showEmail = providers?.email;

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
    const result = await signIn("email", { email, callbackUrl, redirect: false });
    setLoading(null);
    if (result?.ok) setEmailSent(true);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0] px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-[#B8FF9F] border-2 border-black rounded-xl shadow-[4px_4px_0px_#000000] flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-black" />
          </div>
          <h2 className="font-display text-3xl text-black mb-2">CHECK YOUR EMAIL</h2>
          <p className="text-[#333] mb-6">
            We sent a magic link to <strong>{email}</strong>. Click the link to sign in.
          </p>
          <button
            onClick={() => setEmailSent(false)}
            className="w-full bg-white text-black border-2 border-black shadow-[4px_4px_0px_#000000] rounded-lg px-6 py-3 font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] transition-all"
          >
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-4xl text-black">
            ORBYT
          </Link>
        </div>

        {error && (
          <div className="mb-4 bg-[#FF9F9F] border-2 border-black rounded-xl shadow-[2px_2px_0px_#000000] p-3 text-sm text-black text-center font-medium">
            {error === "OAuthAccountNotLinked"
              ? "This email is already linked to another sign-in method."
              : error === "EmailSignin"
              ? "Could not send the magic link. Please try again."
              : "Something went wrong. Please try again."}
          </div>
        )}

        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_#000000] rounded-xl p-6 md:p-8">
          <div className="text-center mb-6">
            <h1 className="font-display text-2xl text-black mb-1">GET YOUR FREE STRATEGY</h1>
            <p className="text-sm text-[#666]">Create your AI-powered content strategy</p>
          </div>

          <div className="space-y-4">
            {/* Demo */}
            <button
              onClick={handleDemo}
              disabled={!!loading}
              className="w-full flex items-center justify-center gap-2 bg-[#FFE500] text-black border-2 border-black shadow-[4px_4px_0px_#000000] rounded-lg px-6 py-3.5 font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50"
            >
              {loading === "demo" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Try Demo Account
            </button>

            {(showGoogle || showEmail) && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-black/10" /></div>
                <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-[#999] font-medium">or continue with</span></div>
              </div>
            )}

            {/* Google */}
            {showGoogle && (
              <button
                onClick={handleGoogle}
                disabled={!!loading}
                className="w-full flex items-center justify-center gap-2 bg-white text-black border-2 border-black shadow-[4px_4px_0px_#000000] rounded-lg px-6 py-3.5 font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50"
              >
                {loading === "google" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                )}
                Continue with Google
              </button>
            )}

            {/* Email */}
            {showEmail && (
              <>
                {showGoogle && (
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-black/10" /></div>
                    <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-[#999] font-medium">or</span></div>
                  </div>
                )}
                <form onSubmit={handleEmail} className="space-y-3">
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-black mb-1">Email address</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full border-2 border-black rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#918EFA] shadow-[2px_2px_0px_#000000]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!!loading}
                    className="w-full flex items-center justify-center gap-2 bg-white text-black border-2 border-black shadow-[4px_4px_0px_#000000] rounded-lg px-6 py-3.5 font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50"
                  >
                    {loading === "email" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                    Continue with Email
                  </button>
                </form>
              </>
            )}
          </div>

          <p className="text-xs text-center text-[#999] mt-6">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-black">Terms of Service</Link>{" "}and{" "}
            <Link href="/privacy" className="underline hover:text-black">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <AuthContent />
    </Suspense>
  );
}
