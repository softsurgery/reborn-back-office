//@ts-nocheck
import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "@/api";
import { OAuthProvider } from "@/types";

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development" || false,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        usernameOrEmail: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;
        const { usernameOrEmail, password } = credentials;

        try {
          const data = await api.auth.signIn({ usernameOrEmail, password });
          return {
            ...data.user,
            access_token: data.access_token,
            refresh_token: data.refresh_token,
          };
        } catch (err: any) {
          throw new Error(err.response.data.message);
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      authorization: {
        params: { redirect_uri: process.env.GITHUB_CALLBACK_URL },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider === "google" || account?.provider === "github") {
        const idToken = account.id_token || account.access_token;
        if (!idToken) {
          console.warn("No ID token found for OAuth provider");
          return false;
        }
        try {
          // Call your backend OAuth login
          const data = await api.auth.oauth({
            provider: account.provider as OAuthProvider,
            idToken,
          });
          // Attach tokens directly to user for jwt callback
          user.access_token = data.access_token;
          user.refresh_token = data.refresh_token;
          return true;
        } catch (err: any) {
          console.error("OAuth sign-in failed:", err);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.access_token = user.access_token;
        token.refresh_token = user.refresh_token;
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.access_token = token.access_token;
        // @ts-ignore
        session.user.refresh_token = token.refresh_token;
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.email = token.email;
        // @ts-ignore
        session.user.username = token.username;
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
