import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Skip middleware for API routes, static files, and images
  // CRITICAL: Must exclude /api/auth to prevent CLIENT_FETCH_ERROR
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuth = !!token;
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isDashboardPage = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  // 2. Redirect authenticated users away from login/register pages to dashboard
  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 3. Protect dashboard/admin routes - redirect unauthenticated to home (/) instead of /login
  if (isDashboardPage && !isAuth) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

// Matcher configuration
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};
