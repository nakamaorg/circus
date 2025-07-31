import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";
import { auth } from "@/lib/helpers/auth.helper";



/**
 * @description Middleware for handling authentication routes.
 * It checks if the user is authenticated and redirects them accordingly.
 * If the user is not authenticated, they are redirected to the login page.
 *
 * @param request - The incoming request object.
 * @returns {NextResponse} The response object, either allowing the request to continue or redirect
 */
export default async function middleware(request: NextRequest): Promise<NextResponse> {
  const session = await auth();
  const isLoggedIn = !!session;
  const { pathname } = request.nextUrl;
  const isGuestRoute = pathname.startsWith("/login") || pathname.match(/^\/\(guest\)/);

  if (!isLoggedIn && !isGuestRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoggedIn && isGuestRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
};
