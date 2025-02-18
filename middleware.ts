import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server'

export default withAuth(
  function middleware(req) {
    const isAdmin = req.nextauth.token?.role === "admin";
    const isAdminPath = req.nextUrl.pathname.startsWith("/admin");

    if (isAdminPath && !isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers)

  // Add the ngrok header
  requestHeaders.set('ngrok-skip-browser-warning', 'true')

  // Return response with the new header
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/api/:path*"],
}; 