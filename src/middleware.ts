import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isEnteringLogin = request.nextUrl.pathname === '/admin/login';
  const isAccessingAdmin = request.nextUrl.pathname.startsWith('/admin') && !isEnteringLogin;
  
  const session = request.cookies.get('admin_session')?.value;
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  const expectedToken = adminPassword ? btoa(`wildgamingcafe@gmail.com:${adminPassword}`) : null;
  const isAuthenticated = session && expectedToken && session === expectedToken;

  // 1. OBFUSCATION LAYER: Hide the login page from customers.
  // To see the login page, the admin MUST append ?key=... to the URL.
  if (isEnteringLogin && !isAuthenticated) {
    const providedKey = request.nextUrl.searchParams.get('key');
    const requiredKey = process.env.ADMIN_PORTAL_KEY || 'wild'; 
    if (providedKey !== requiredKey) {
      // Act like the page doesn't exist by throwing them to the homepage
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 2. GATEKEEPER LAYER: Protect the dashboard.
  // If they try to access /admin directly without a cookie, throw them to the homepage.
  if (isAccessingAdmin && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
