"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { X, Mail, Lock, Eye, EyeOff, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AnimatedBubbles } from "./animated-bubbles";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function SignupModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}: SignupModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Get actual theme to use (handles system theme)
  const currentTheme = theme === "system" ? systemTheme : theme;

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    onClose();
  };

  // Determine text colors based on theme
  const textPrimary = currentTheme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary =
    currentTheme === "dark" ? "text-gray-300" : "text-gray-700";
  const textMuted = currentTheme === "dark" ? "text-gray-400" : "text-gray-500";

  return (
    <>
      {/* Backdrop - prevents click through and scrolling */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl transition-opacity duration-300 cursor-default"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatedBubbles />

        {/* Glass Effect Modal with gradient border - Like preview modal */}
        <div
          className={cn(
            "relative w-full max-w-md rounded-2xl overflow-hidden",
            "transition-all duration-500 animate-in fade-in slide-in-from-bottom-10",
            "border border-transparent",
            "bg-gradient-to-br from-background via-background to-muted/20",
            "before:absolute before:inset-0 before:rounded-2xl before:p-[1px]",
            currentTheme === "dark"
              ? "before:bg-gradient-to-br before:from-white/20 before:via-red-500/30 before:to-white/20"
              : "before:bg-gradient-to-br before:from-gray-300/50 before:via-red-500/20 before:to-gray-300/50",
            "before:pointer-events-none"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60 animate-pulse" />
          <div className="h-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-white/10 dark:hover:bg-black/10 transition-all group cursor-pointer"
            aria-label="Close modal"
          >
            <X
              className={cn(
                "h-5 w-5 transition-transform group-hover:scale-110",
                currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
              )}
            />
          </button>

          <div className="p-8">
            {/* Logo - Netflix inspired */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="text-3xl font-extrabold tracking-wide">
                  <span className="text-red-600 group-hover:text-red-500 transition-colors">
                    Luta
                  </span>
                  <span
                    className={cn(
                      "group-hover:text-gray-300 transition-colors",
                      currentTheme === "dark" ? "text-white" : "text-gray-900"
                    )}
                  >
                    Zed
                  </span>
                </div>
                <Sparkles className="absolute -top-2 -right-4 h-5 w-5 text-yellow-400 animate-pulse" />
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className={cn("text-2xl font-bold mb-2", textPrimary)}>
                Start Your Journey
              </h2>
              <p className={textSecondary}>
                Create your account and unlock premium features
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className={textPrimary}>
                  Full Name
                </Label>
                <div className="relative group">
                  <User
                    className={cn(
                      "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5",
                      currentTheme === "dark"
                        ? "text-gray-400"
                        : "text-gray-500",
                      "group-focus-within:text-red-500 transition-colors"
                    )}
                  />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className={cn(
                      "pl-10 pr-4 py-3 cursor-text",
                      currentTheme === "dark"
                        ? "bg-black/30 backdrop-blur-sm border-gray-700 text-white placeholder:text-gray-500"
                        : "bg-white/50 backdrop-blur-sm border-gray-300 text-gray-900 placeholder:text-gray-500",
                      "focus:border-red-500 focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-transparent",
                      "transition-all duration-300"
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className={textPrimary}>
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail
                    className={cn(
                      "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5",
                      currentTheme === "dark"
                        ? "text-gray-400"
                        : "text-gray-500",
                      "group-focus-within:text-red-500 transition-colors"
                    )}
                  />
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className={cn(
                      "pl-10 pr-4 py-3 cursor-text",
                      currentTheme === "dark"
                        ? "bg-black/30 backdrop-blur-sm border-gray-700 text-white placeholder:text-gray-500"
                        : "bg-white/50 backdrop-blur-sm border-gray-300 text-gray-900 placeholder:text-gray-500",
                      "focus:border-red-500 focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-transparent",
                      "transition-all duration-300"
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className={textPrimary}>
                  Password
                </Label>
                <div className="relative group">
                  <Lock
                    className={cn(
                      "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5",
                      currentTheme === "dark"
                        ? "text-gray-400"
                        : "text-gray-500",
                      "group-focus-within:text-red-500 transition-colors"
                    )}
                  />
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={cn(
                      "pl-10 pr-12 py-3 cursor-text",
                      currentTheme === "dark"
                        ? "bg-black/30 backdrop-blur-sm border-gray-700 text-white placeholder:text-gray-500"
                        : "bg-white/50 backdrop-blur-sm border-gray-300 text-gray-900 placeholder:text-gray-500",
                      "focus:border-red-500 focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-transparent",
                      "transition-all duration-300"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 dark:hover:bg-black/10 rounded transition-colors cursor-pointer"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff
                        className={cn(
                          "h-4 w-4",
                          currentTheme === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        )}
                      />
                    ) : (
                      <Eye
                        className={cn(
                          "h-4 w-4",
                          currentTheme === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        )}
                      />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className={textPrimary}>
                  Confirm Password
                </Label>
                <div className="relative group">
                  <Lock
                    className={cn(
                      "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5",
                      currentTheme === "dark"
                        ? "text-gray-400"
                        : "text-gray-500",
                      "group-focus-within:text-red-500 transition-colors"
                    )}
                  />
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={cn(
                      "pl-10 pr-4 py-3 cursor-text",
                      currentTheme === "dark"
                        ? "bg-black/30 backdrop-blur-sm border-gray-700 text-white placeholder:text-gray-500"
                        : "bg-white/50 backdrop-blur-sm border-gray-300 text-gray-900 placeholder:text-gray-500",
                      "focus:border-red-500 focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-transparent",
                      "transition-all duration-300"
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full py-3 mt-6 text-base font-semibold",
                  "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
                  "text-white shadow-lg",
                  "transition-all duration-300",
                  "hover:shadow-red-500/25 hover:scale-[1.02]",
                  "active:scale-[0.98]",
                  "relative overflow-hidden group",
                  isLoading ? "cursor-wait" : "cursor-pointer"
                )}
              >
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-red-500 to-red-600 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className={textSecondary}>
                Already have an account?{" "}
                <button
                  onClick={onSwitchToLogin}
                  className="text-red-400 hover:text-red-500 font-semibold transition-colors hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>

          <div className="h-2 bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
        </div>
      </div>
    </>
  );
}
