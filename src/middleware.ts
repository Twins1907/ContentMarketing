import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // If user is authenticated and hasn't completed onboarding,
    // redirect to /onboarding (unless already there or on /auth)
    if (
      token &&
      pathname !== "/onboarding" &&
      pathname !== "/auth" &&
      !pathname.startsWith("/api/")
    ) {
      // We check onboardingComplete in session callback,
      // but for middleware we just let them through — the page itself
      // will handle redirecting if needed
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public routes
        const publicRoutes = ["/", "/auth", "/pricing"];
        if (publicRoutes.includes(pathname)) {
          return true;
        }

        // API auth routes are always public
        if (pathname.startsWith("/api/auth")) {
          return true;
        }

        // Stripe webhook is public
        if (pathname === "/api/stripe/webhook") {
          return true;
        }

        // All /dashboard, /onboarding, /generating, /account, /new-strategy require auth
        if (
          pathname.startsWith("/dashboard") ||
          pathname.startsWith("/onboarding") ||
          pathname.startsWith("/generating") ||
          pathname.startsWith("/account") ||
          pathname.startsWith("/new-strategy")
        ) {
          return !!token;
        }

        // Allow everything else
        return true;
      },
    },
    pages: {
      signIn: "/auth",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/generating/:path*",
    "/account/:path*",
    "/new-strategy/:path*",
  ],
};
