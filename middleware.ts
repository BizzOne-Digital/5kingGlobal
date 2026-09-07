import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { SESSION_COOKIE_NAME } from '@/lib/auth/session';

// Middleware runs on the Edge runtime, so we verify the JWT directly here
// with `jose` rather than importing the Node-only current-user helpers.
async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  const isApiAdminRoute = pathname.startsWith('/api/admin');
  const isAdminPageRoute = pathname.startsWith('/admin');

  const isPublicAuthEndpoint =
    pathname === '/api/admin/login' ||
    pathname === '/api/admin/logout' ||
    pathname === '/admin/login';

  if (isPublicAuthEndpoint) {
    return NextResponse.next();
  }

  if (isApiAdminRoute || isAdminPageRoute) {
    const valid = await isValidSession(token);
    if (!valid) {
      if (isApiAdminRoute) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
