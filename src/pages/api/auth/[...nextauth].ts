import container from "@/lib/container";
import NextAuth from "next-auth";
import GithubProvider, { GithubProfile } from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import e from "express";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        usernameOrEmail: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;
        const { usernameOrEmail, password } = credentials!;

        return container.AuthService.signin({ usernameOrEmail, password })
          .then(({ user }) => user)
          .catch((err) => {
            throw new Error(err.message);
          });
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github" || account?.provider === "google") {
        const email = user.email;
        console.log(email);
        const username =
          (profile as GithubProfile).login || profile?.name || "unknown";

        const existingUser = await container.UserService.getUserByCondition({
          filter: `email||$eq||${email}`,
        });

        if (!existingUser) {
          await container.UserService.createUser({
            email,
            username,
            isApproved: false,
          });
          return "/auth/pending";
        }

        if (!existingUser.isApproved) {
          return "/auth/still-pending";
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await container.UserService.getUserByCondition({
          filter: `(email||$eq||${user.email})`,
        });
        token.isApproved = dbUser?.isApproved ?? false;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.isApproved = !!token.isApproved;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET as string,
};

export default NextAuth(authOptions);
