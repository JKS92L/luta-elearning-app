"use client";

import { createContext, useContext, useState } from "react";
import { LoginModal } from "@/components/auth/login-modal";
import { SignupModal } from "@/components/auth/signup-modal";

type AuthContextType = {
  showLogin: () => void;
  showSignup: () => void;
  hideAuth: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const showLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  const showSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const hideAuth = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
  };

  return (
    <AuthContext.Provider value={{ showLogin, showSignup, hideAuth }}>
      {children}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={hideAuth}
        onSwitchToSignup={showSignup}
      />

      {/* Signup Modal */}
      <SignupModal
        isOpen={showSignupModal}
        onClose={hideAuth}
        onSwitchToLogin={showLogin}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
