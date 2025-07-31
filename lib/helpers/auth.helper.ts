import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { env } from "@/lib/config/env.config";



type TUser = {
  discordId?: string;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: env.AUTH_SECRET,
  session: { strategy: "jwt" },
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
      (session.user as TUser).discordId = token.discordId as string | undefined;

      return session;
    },
  },
});
