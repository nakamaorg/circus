import { NextResponse } from "next/server";

import { auth } from "@/lib/helpers/auth.helper";



export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Define route patterns
  const isAuthRoute = nextUrl.pathname.startsWith("/dashboard")
    || nextUrl.pathname.match(/^\/\(auth\)/);
  const isGuestRoute = nextUrl.pathname.startsWith("/login")
    || nextUrl.pathname.match(/^\/\(guest\)/);

  // If user is not logged in and trying to access protected (auth) routes
  if (!isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // If user is logged in and trying to access guest routes (like login)
  if (isLoggedIn && isGuestRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Allow the request to continue
  return NextResponse.next();
});

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
