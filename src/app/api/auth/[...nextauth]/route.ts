import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          process.env.LOGIN_USERNAME === credentials?.username &&
          process.env.LOGIN_PASSWORD === credentials?.password
        ) {
          const user = { id: "1", name: "Admin", email: "admin@admin.com" };
          return user;
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
