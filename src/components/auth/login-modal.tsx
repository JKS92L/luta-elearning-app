"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { X, Mail, Lock, Eye, EyeOff, LogIn, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { AnimatedBubbles } from "./animated-bubbles";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

export function LoginModal({
  isOpen,
  onClose,
  onSwitchToSignup,
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
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
        {/* Animated Background Bubbles */}
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
          {/* Glowing Top Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60 animate-pulse" />

          {/* Netflix-inspired Top Gradient */}
          <div className="h-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-white/10 dark:hover:bg-black/10 transition-all group cursor-pointer"
            aria-label="Close"
          >
            <X
              className={cn(
                "h-5 w-5 transition-transform group-hover:scale-110",
                currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
              )}
            />
          </button>

          {/* Content */}
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
                    ZedApp
                  </span>
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-4 w-4 text-yellow-400 animate-spin-slow" />
                </div>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="text-center mb-8">
              <h2 className={cn("text-2xl font-bold mb-2", textPrimary)}>
                Welcome Back
              </h2>
              <p className={textSecondary}>
                Sign in to continue your learning journey
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className={textPrimary}>
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
                    id="email"
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

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className={textPrimary}>
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
                    id="password"
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                    className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 cursor-pointer"
                  />
                  <Label
                    htmlFor="remember"
                    className={cn("text-sm cursor-pointer", textSecondary)}
                  >
                    Remember me
                  </Label>
                </div>
                <button
                  type="button"
                  className="text-sm text-red-400 hover:text-red-500 transition-colors cursor-pointer"
                  onClick={() => console.log("Forgot password clicked")}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full py-3 text-base font-semibold",
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
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    Sign In
                    {/* Glow effect */}
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-red-500 to-red-600 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div
                  className={cn(
                    "w-full border-t",
                    currentTheme === "dark"
                      ? "border-gray-700"
                      : "border-gray-300"
                  )}
                />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={cn("px-4 bg-transparent", textMuted)}>
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin("google")}
                className={cn(
                  "transition-all duration-300 hover:scale-[1.02] cursor-pointer",
                  currentTheme === "dark"
                    ? "bg-gray-800/50 hover:bg-gray-800 border-gray-700 text-gray-300"
                    : "bg-white/50 hover:bg-white border-gray-300 text-gray-700"
                )}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin("github")}
                className={cn(
                  "transition-all duration-300 hover:scale-[1.02] cursor-pointer",
                  currentTheme === "dark"
                    ? "bg-gray-800/50 hover:bg-gray-800 border-gray-700 text-gray-300"
                    : "bg-white/50 hover:bg-white border-gray-300 text-gray-700"
                )}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className={textSecondary}>
                Don't have an account?{" "}
                <button
                  onClick={onSwitchToSignup}
                  className="text-red-400 hover:text-red-500 font-semibold transition-colors hover:underline cursor-pointer"
                >
                  Sign up for free
                </button>
              </p>
            </div>
          </div>

          {/* Bottom Gradient */}
          <div className="h-2 bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
        </div>
      </div>
    </>
  );
}
