import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import NextAuth from "next-auth/next";

const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      console.log("SignIn callback triggered");
      if (user) {
        console.log("User:", user);
      } else {
        console.log("User not found");
      }

      if (user.name === "Razi Benvidi") {
        console.log("User allowed:", user);
        return true;
      } else {
        console.log("User not allowed:", user);
        return false;
      }
    },
    async session({ session, token }: any) {
      console.log("Session callback triggered");
      session.user.name = `${session?.user?.name}_${token?.sub}`;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const nextAuth = NextAuth(authOptions);
export { nextAuth as GET, nextAuth as POST };
