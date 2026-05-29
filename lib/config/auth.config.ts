import type { NextAuthConfig } from "next-auth";



/**
 * @description Edge-compatible auth configuration used by the middleware.
 * Must not import providers or anything that uses Node.js-only APIs.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;
      const isGuestRoute = pathname.startsWith("/login");

      if (!isLoggedIn && !isGuestRoute) {
        return Response.redirect(new URL("/login", request.nextUrl));
      }

      if (isLoggedIn && isGuestRoute) {
        return Response.redirect(new URL("/", request.nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
