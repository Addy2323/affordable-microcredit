import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const sessionToken = request.cookies.get("session_token")?.value;
    const { pathname } = request.nextUrl;

    // Protect /admin and /dashboard routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
        if (!sessionToken) {
            const loginUrl = new URL("/login", request.url);
            // Store the original destination to redirect back after login
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Redirect logged-in users away from login/register pages
    if (pathname === "/login" || pathname === "/register") {
        if (sessionToken) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/register"],
};
