// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      /** User ID */
      id?: string;
      /** Username */
      username?: string;
      /** The user's email */
      email?: string | null;
      /** The user's name */
      name?: string | null;
      /** Whether the user is approved */
      isApproved?: boolean;
      /** The user's image */
      image?: string | null;
      /** Access token */
      access_token?: string;
      /** Refresh token */
      refresh_token?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username?: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
    isApproved?: boolean;
    access_token?: string;
    refresh_token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string;
    email?: string | null;
    access_token?: string;
    refresh_token?: string;
  }
}
