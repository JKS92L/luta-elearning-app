"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Video,
  BookOpen,
  User,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
  Bell,
  Menu,
  CalendarDays,
  MessageCircle,
  Sun,
  Moon,
  Camera,
  Clapperboard,
  Zap,
  SquareActivity,
  Activity,
  ScanEye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
//src/app/providers/auth-provider.tsx
import { useAuth } from "@/providers/auth-provider";

// Mock user data - replace with actual auth context later
const useUser = () => {
  return {
    user: {
      name: "John Doe",
      email: "john@example.com",
      avatar: "",
      role: "student",
    },
    isLoggedIn: false, // Change this to true to test logged in state
  };
};

// Navigation items for logged-out users (public pages)
const loggedOutNavigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Featured Classes", href: "/featured-classes", icon: ScanEye },
  { name: "Latest Classes", href: "/latest-classes", icon: Zap },
  { name: "Trending Classes", href: "/trending-classes", icon: SquareActivity },
  { name: "Popular Classes", href: "/popular-classes", icon: Activity },
];

// Navigation items for logged-in users (protected pages)
const loggedInNavigation = [
  { name: "My Dashboard", href: "/dashboard", icon: Home },
  { name: "My Classes", href: "/classes", icon: BookOpen },
  { name: "Explore", href: "/explore", icon: Video },
  { name: "Free Lessons", href: "/free-lessons", icon: Clapperboard },
  { name: "Become a Teacher", href: "/teacher-apply", icon: User },
  { name: "Calendar", href: "/calendar", icon: CalendarDays },
];

const userNavigation = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Messages", href: "/messages", icon: MessageCircle },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { setTheme, theme } = useTheme();
  const pathname = usePathname();
  const { user, isLoggedIn } = useUser();

  // Get the auth context to show login/signup modals
  const { showLogin, showSignup } = useAuth();

  // Get appropriate navigation items based on login status
  const navigationItems = isLoggedIn ? loggedInNavigation : loggedOutNavigation;

  // Detect client mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll background effect - Netflix style
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle Netflix-inspired scroll effect with gradient
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 10);

      // Netflix-style fade effect
      const header = document.querySelector("header");
      if (header) {
        const opacity = Math.min(scrollY / 200, 0.95);
        header.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle auth button clicks - close sheet and open modal
  const handleLoginClick = () => {
    setSheetOpen(false); // Close the mobile sheet
    showLogin(); // Open login modal
  };

  const handleSignupClick = () => {
    setSheetOpen(false); // Close the mobile sheet
    showSignup(); // Open signup modal
  };

  if (!mounted) {
    // Avoid rendering theme-dependent UI before hydration
    return (
      <header className="sticky top-0 z-50 w-full bg-black border-b border-red-600/30">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="w-32 h-8 bg-gray-800 rounded animate-pulse"></div>
            <div className="w-40 h-8 bg-gray-800 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
        isScrolled
          ? "bg-black/95 backdrop-blur-md shadow-lg border-red-600/40"
          : "bg-gradient-to-b from-black/90 via-black/70 to-transparent border-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-6">
            {/* Mobile menu */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-white hover:bg-red-600/20 hover:text-red-500 transition-all"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-64 bg-black text-white border-r border-red-700/50"
              >
                <VisuallyHidden>
                  <SheetTitle>Navigation Menu</SheetTitle>
                </VisuallyHidden>
                <MobileNavigation
                  isLoggedIn={isLoggedIn}
                  user={user}
                  onLoginClick={handleLoginClick}
                  onSignupClick={handleSignupClick}
                  onCloseSheet={() => setSheetOpen(false)}
                />
              </SheetContent>
            </Sheet>

            {/* Brand - Netflix inspired */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="text-2xl font-extrabold tracking-wide">
                <span className="text-red-600 group-hover:text-red-500 transition-colors">
                  Luta
                </span>
                <span className="text-white group-hover:text-gray-300 transition-colors">
                  ZedApp
                </span>
              </div>
              <span className="text-xs text-red-500 font-semibold bg-red-500/10 px-2 py-1 rounded-full">
                BETA
              </span>
            </Link>

            {/* Desktop nav - only show appropriate items */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Button
                    key={item.name}
                    asChild
                    variant="ghost"
                    size="sm"
                    className={`text-sm flex items-center gap-2 transition-all duration-200 ${
                      isActive
                        ? "text-red-500 font-semibold bg-red-500/10"
                        : "text-gray-300 hover:text-red-500 hover:bg-red-500/10"
                    }`}
                  >
                    <Link href={item.href}>
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Show messages only for logged-in users */}
            {isLoggedIn && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-300 hover:text-red-500 hover:bg-red-500/10"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-black border-red-600 text-white">
                    <p>Messages</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Show notifications only for logged-in users */}
            {isLoggedIn && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative text-gray-300 hover:text-red-500 hover:bg-red-500/10"
                    >
                      <Bell className="h-5 w-5" />
                      <Badge className="absolute -top-1 -right-1 bg-red-600 text-white text-xs h-5 w-5 p-0 flex items-center justify-center border border-black">
                        3
                      </Badge>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-black border-red-600 text-white">
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Theme Toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="text-gray-300 hover:text-red-500 hover:bg-red-500/10"
                  >
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-black border-red-600 text-white">
                  <p>Toggle Theme</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Profile / Auth */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full hover:ring-2 hover:ring-red-500 transition-all"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-red-600 to-red-800 text-white">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-black text-white border border-red-800/50 shadow-xl"
                  align="end"
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                      <div className="flex items-center gap-1">
                        <span className="text-xs px-2 py-0.5 bg-red-600/20 text-red-400 rounded-full">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-red-900/50" />
                  {userNavigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <DropdownMenuItem
                        key={item.name}
                        asChild
                        className={isActive ? "bg-red-600/20" : ""}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-2 text-gray-300 hover:text-red-500 cursor-pointer"
                        >
                          <Icon className="h-4 w-4" />
                          {item.name}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator className="bg-red-900/50" />
                  <DropdownMenuItem className="flex items-center gap-2 text-red-500 hover:bg-red-600/20 hover:text-red-400 cursor-pointer">
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleLoginClick}
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Login</span>
                </Button>
                <Button
                  onClick={handleSignupClick}
                  size="sm"
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-md shadow-lg hover:shadow-red-500/25 transition-all"
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Up</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

interface MobileNavigationProps {
  isLoggedIn: boolean;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  onLoginClick: () => void;
  onSignupClick: () => void;
  onCloseSheet: () => void;
}

function MobileNavigation({
  isLoggedIn,
  user,
  onLoginClick,
  onSignupClick,
  onCloseSheet,
}: MobileNavigationProps) {
  const pathname = usePathname();
  const navigationItems = isLoggedIn ? loggedInNavigation : loggedOutNavigation;

  const allMobileItems = [
    ...navigationItems,
    ...(isLoggedIn ? userNavigation : []),
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-red-700/50">
        <div className="text-xl font-bold text-red-500">Luta ZedApp</div>
        <span className="text-xs text-red-500/70 font-semibold bg-red-500/10 px-2 py-1 rounded-full">
          {isLoggedIn ? "PREMIUM" : "FREE"}
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {allMobileItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <SheetClose asChild key={item.name}>
              <Button
                asChild
                variant="ghost"
                className={`w-full justify-start gap-3 transition-all ${
                  isActive
                    ? "text-red-500 bg-red-500/10"
                    : "text-gray-300 hover:text-red-500 hover:bg-red-500/10"
                }`}
                onClick={() => {
                  // Small delay to allow sheet animation before navigation
                  setTimeout(() => onCloseSheet(), 100);
                }}
              >
                <Link href={item.href}>
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            </SheetClose>
          );
        })}
      </nav>

      {/* Auth section in mobile nav */}
      <div className="p-4 border-t border-red-700/50">
        {isLoggedIn ? (
          <>
            <div className="flex items-center gap-3 mb-3 p-2 rounded-lg bg-red-500/5">
              <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-red-600 to-red-800 text-white">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">
                  {user.name}
                </span>
                <span className="text-xs text-gray-400">{user.email}</span>
              </div>
            </div>
            <SheetClose asChild>
              <Button
                variant="outline"
                className="w-full text-red-500 border-red-700/50 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                onClick={() => {
                  // Close sheet and trigger sign out
                  onCloseSheet();
                  // Add your sign out logic here
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </SheetClose>
          </>
        ) : (
          <div className="space-y-2">
            <SheetClose asChild>
              <Button
                onClick={onLoginClick}
                variant="outline"
                className="w-full text-gray-300 border-red-700/50 hover:text-red-500 hover:border-red-500 transition-all"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button
                onClick={onSignupClick}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all"
              >
                <UserPlus className="h-4 w-4" />
                Sign Up Free
              </Button>
            </SheetClose>
          </div>
        )}
      </div>
    </div>
  );
}
