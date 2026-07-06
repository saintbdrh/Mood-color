import { getServerSession } from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function isAdmin(email: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  return adminEmail ? email === adminEmail : false;
}
