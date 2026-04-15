import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  // Public paths that don't require auth
  const publicPaths = ['/login', '/register', '/', '/properties', '/tenant/dashboard'];
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const decoded = await verifyToken(token);
    // Check if user is trying to access landlord routes
    if (pathname.startsWith('/landlord') && decoded.role !== 'landlord') {
      // Redirect tenant to tenant dashboard
      return NextResponse.redirect(new URL('/tenant/dashboard', request.url));
    }
    // Check if user is trying to access tenant routes
    if (pathname.startsWith('/tenant') && decoded.role !== 'tenant') {
      // Redirect landlord to landlord dashboard
      return NextResponse.redirect(new URL('/landlord/dashboard', request.url));
    }
    return NextResponse.next();
  } catch (error) {
    // Invalid token, redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth-token');
    return response;
  }
}

export const config = {
  matcher: ['/landlord/:path*', '/tenant/:path*', '/dashboard/:path*']
};
