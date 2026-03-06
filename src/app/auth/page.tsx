"use client";

import { useState, Suspense } from "react";
import { signIn, getProviders } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Play, Loader2, CheckCircle, ArrowRight, Eye, EyeOff } from "lucide-react";

function AuthContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const error = searchParams.get("error");

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [providers, setProviders] = useState<Record<string, { id: string; name: string }> | null>(null);
  if (!providers && typeof window !== "undefined") {
    getProviders().then(setProviders);
  }
  const showGoogle = providers?.google;

  const handleDemo = async () => {
    setLoading("demo");
    await signIn("demo", { callbackUrl: "/dashboard" });
  };

  const handleGoogle = async () => {
    setLoading("google");
    await signIn("google", { callbackUrl });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setFormError(null);
    setLoading("credentials");

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: false,
    });

    setLoading(null);

    if (result?.error) {
      setFormError("Invalid email or password. Please try again.");
    } else if (result?.url) {
      window.location.href = result.url;
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setFormError(null);
    setLoading("signup");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(null);
      setFormError(data.error || "Something went wrong.");
      return;
    }

    // Auto sign in after signup
    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/onboarding",
      redirect: false,
    });

    setLoading(null);

    if (result?.url) {
      window.location.href = result.url;
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0] px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-[#B8FF9F] border-2 border-black rounded-xl shadow-[4px_4px_0px_#000000] flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-black" />
          </div>
          <h2 className="font-display text-3xl text-black mb-2">ACCOUNT CREATED!</h2>
          <p className="text-[#333] mb-6">Redirecting you to your dashboard...</p>
        </div>
      </div>
    );
  }

  const authError = error
    ? error === "OAuthAccountNotLinked"
      ? "This email is already linked to another sign-in method."
      : error === "CredentialsSignin"
      ? "Invalid email or password."
      : "Something went wrong. Please try again."
    : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-4xl text-black">
            ORBYT
          </Link>
        </div>

        {(authError || formError) && (
          <div className="mb-4 bg-[#FF9F9F] border-2 border-black rounded-xl shadow-[2px_2px_0px_#000000] p-3 text-sm text-black text-center font-medium">
            {authError || formError}
          </div>
        )}

        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_#000000] rounded-xl p-6 md:p-8">
          {/* Mode toggle */}
          <div className="flex bg-[#FFF8F0] border-2 border-black rounded-lg p-1 mb-6">
            <button
              onClick={() => { setMode("signin"); setFormError(null); }}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                mode === "signin"
                  ? "bg-black text-white shadow-[2px_2px_0px_#666]"
                  : "text-[#666] hover:text-black"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode("signup"); setFormError(null); }}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                mode === "signup"
                  ? "bg-black text-white shadow-[2px_2px_0px_#666]"
                  : "text-[#666] hover:text-black"
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="space-y-4">
            {/* Email + Password form */}
            <form onSubmit={mode === "signin" ? handleSignIn : handleSignUp} className="space-y-3">
              {mode === "signup" && (
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-black mb-1">
                    Your name <span className="text-[#999] font-normal">(optional)</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Jane Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-2 border-black rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#918EFA] shadow-[2px_2px_0px_#000000]"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-black mb-1">
                  Email address
                </label>
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

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-black mb-1">
                  Password
                  {mode === "signup" && (
                    <span className="text-[#999] font-normal ml-1">(min. 8 characters)</span>
                  )}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={mode === "signup" ? "Create a password" : "Enter your password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={mode === "signup" ? 8 : undefined}
                    className="w-full border-2 border-black rounded-lg px-4 py-3 pr-12 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#918EFA] shadow-[2px_2px_0px_#000000]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-black transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!!loading}
                className="w-full flex items-center justify-center gap-2 bg-[#918EFA] text-black border-2 border-black shadow-[4px_4px_0px_#000000] rounded-lg px-6 py-3.5 font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50"
              >
                {loading === "credentials" || loading === "signup" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                {mode === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-black/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-[#999] font-medium">or</span>
              </div>
            </div>

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

            {/* Demo */}
            <button
              onClick={handleDemo}
              disabled={!!loading}
              className="w-full flex items-center justify-center gap-2 bg-[#FFE500] text-black border-2 border-black shadow-[4px_4px_0px_#000000] rounded-lg px-6 py-3.5 font-bold hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50"
            >
              {loading === "demo" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Try Demo Account
            </button>
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
