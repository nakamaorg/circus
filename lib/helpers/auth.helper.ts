/* eslint-disable node/prefer-global/process */
import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";



type TUser = {
  discordId?: string;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
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
