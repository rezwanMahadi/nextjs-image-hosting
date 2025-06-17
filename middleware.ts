import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // For files in the uploads directory
  if (request.nextUrl.pathname.startsWith('/uploads/')) {
    // Rewriting to ensure proper static file handling
    return NextResponse.rewrite(new URL(request.nextUrl.pathname, request.url));
  }
  
  return NextResponse.next();
}

// Configure the paths that should trigger the middleware
export const config = {
  matcher: ['/uploads/:path*'],
}; 