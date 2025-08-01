import type { TUnsafe } from "@eoussama/core";

import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { env } from "@/lib/config/env.config";



declare module "next-auth" {
  interface User {
    discordId: TUnsafe<string>;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Discord({
      clientId: env.AUTH_DISCORD_ID,
      clientSecret: env.AUTH_DISCORD_SECRET,
      authorization: { params: { scope: "identify" } },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.discordId = account.providerAccountId;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.discordId = token.discordId as TUnsafe<string>;

      return session;
    },
  },
});
