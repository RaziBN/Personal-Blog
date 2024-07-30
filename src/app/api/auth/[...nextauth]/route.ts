import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import NextAuth from "next-auth/next";

const isProduction = process.env.NODE_ENV === "production";

const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: isProduction
        ? process.env.GITHUB_ID_PROD ?? ""
        : process.env.GITHUB_ID_LOCAL ?? "",
      clientSecret: isProduction
        ? process.env.GITHUB_SECRET_PROD ?? ""
        : process.env.GITHUB_SECRET_LOCAL ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.name === "Razi Benvidi") {
        return true;
      } else {
        return false;
      }
    },
    async session({ session, token }: any) {
      session.user.name = `${session?.user?.name}_${token?.sub}`;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

const nextAuth = NextAuth(authOptions);
export { nextAuth as GET, nextAuth as POST };
