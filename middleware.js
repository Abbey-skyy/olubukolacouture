import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;

    // Block admin routes for non-admins
    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login?callbackUrl=/admin', req.url));
    }

    // Protect profile and checkout
    if (
      (pathname.startsWith('/profile') || pathname.startsWith('/checkout')) &&
      !token
    ) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${pathname}`, req.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (
          pathname.startsWith('/profile') ||
          pathname.startsWith('/checkout') ||
          pathname.startsWith('/admin')
        ) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/profile/:path*', '/checkout/:path*', '/admin/:path*'],
};
