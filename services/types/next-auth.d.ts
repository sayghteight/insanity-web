import NextAuth from "next-auth";
import { DefaultSession, DefaultUser } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    discordId?: string;
    username?: string;
    roles?: string[];  // Define roles aquí
    hasRequiredRole?: boolean;
    isInInsanity?: boolean;
  }
}

declare module "next-auth" {
  interface Profile {
    id?: string; // Extiende Profile para incluir 'id'
    username?: string;
  }

  interface Session extends DefaultSession {
    accessToken?: string;  // Asegúrate de incluir accessToken aquí
    discordId?: string;
    username?: string;
    roles?: string[];
    hasRequiredRole?: boolean;
    isInInsanity?: boolean;
  }

  interface User extends DefaultUser {
    id?: string;
  }
}