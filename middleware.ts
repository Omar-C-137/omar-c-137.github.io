import { NextResponse } from 'next/server';

export function middleware() {
  // This middleware would typically check for auth token
  // For now, we'll let client-side components handle redirect logic
  return NextResponse.next();
}

export const config = {
  matcher: ['/coach/:path*', '/trainee/:path*'],
};
