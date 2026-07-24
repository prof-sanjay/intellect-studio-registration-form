import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Login/logout must always be reachable, even without a session.
  if (pathname === '/api/admin/login' || pathname === '/api/admin/logout') {
    return NextResponse.next();
  }

  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isValid = token ? await verifyAdminToken(token).then(() => true).catch(() => false) : false;

  if (pathname === '/admin/login') {
    // Already-authenticated admins shouldn't see the login page again.
    return isValid ? NextResponse.redirect(new URL('/admin', req.url)) : NextResponse.next();
  }

  if (!isValid) {
    return pathname.startsWith('/api/')
      ? NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      : NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
