// types/next-auth.d.ts
import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      /** The user's email */
      email?: string;
      /** The user's name */
      name?: string;
      /** Whether the user is approved */
      isApproved?: boolean;
      /** The user's image */
      image?: string;
    } & DefaultSession["user"];
  }
}
