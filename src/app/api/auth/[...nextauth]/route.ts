import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import NextAuth from "next-auth/next";

const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: "Iv23liY5XuM1GDHouBJX",
      clientSecret: "7a7d92bcd8391fc957c7637d4a79b0d48ba757c9",
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      session.user.name = `${session?.user?.name}_${token?.sub}`;
      return session;
    },
  },
  secret: "default_secret_key",
};

const nextAuth = NextAuth(authOptions);
export { nextAuth as GET, nextAuth as POST };
