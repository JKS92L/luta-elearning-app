"use client";

import { createContext, useContext, ReactNode } from "react";
import { authClient } from "@/lib/db/auth-client";

type User = {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  role?: string;
} | null;

type Session = {
  user: User;
  session: {
    id: string;
    token: string;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    ipAddress?: string;
    userAgent?: string;
  };
} | null;

type AuthContextType = {
  user: User;
  // session: Session;
  isLoading: boolean;

  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;

  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  /**
   * ✅ Single source of truth
   */
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user ?? null;

  /**
   * AUTH ACTIONS
   */

  const signIn = async (email: string, password: string) => {
    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/dashboard",
    });

    if (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
      callbackURL: "/dashboard",
    });

    if (error) {
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });

    if (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });

    if (error) {
      throw error;
    }
  };

  const signInWithGithub = async () => {
    const { error } = await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });

    if (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        // session,
        isLoading: isPending,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        signInWithGithub,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
