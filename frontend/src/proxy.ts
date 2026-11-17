import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_COOKIE } from '@/lib/constants';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = Boolean(request.cookies.get(AUTH_COOKIE)?.value);
  const isLogin = pathname === '/login';

  if (!hasToken && !isLogin) return NextResponse.redirect(new URL('/login', request.url));
  if (hasToken && isLogin) return NextResponse.redirect(new URL('/dashboard', request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
