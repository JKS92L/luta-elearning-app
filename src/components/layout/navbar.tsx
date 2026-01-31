"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { useAuth } from "@/providers/auth-provider";

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
  { name: "Become a Member", href: "/member-apply", icon: User },
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
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const { setTheme, theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  
  // Sign/ signout with Better Auth
  const { user, isLoading, signOut, signInWithGoogle, signInWithGithub } = useAuth();
  const isLoggedIn = !!user;

  // Get appropriate navigation items based on login status
  const navigationItems = isLoggedIn ? loggedInNavigation : loggedOutNavigation;

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Detect client mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    updateScreenSize();
    
    const handleResize = () => {
      updateScreenSize();
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const updateScreenSize = () => {
    const width = window.innerWidth;
    if (width < 768) {
      setScreenSize("mobile");
    } else if (width < 1024) {
      setScreenSize("tablet");
    } else {
      setScreenSize("desktop");
    }
  };

  // Handle scroll background effect - Netflix style
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

  const handleSignOut = async () => {
    await signOut();
    setSheetOpen(false);
  };

  const handleLogin = () => {
    setSheetOpen(false);
    router.push('/login');
  };

  const handleSignup = () => {
    setSheetOpen(false);
    router.push('/signup');
  };

  if (!mounted || isLoading) {
    // Show skeleton while loading
    return (
      <header className="sticky top-0 z-50 w-full bg-black border-b border-red-600/30">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-32 h-8 bg-gray-800 rounded animate-pulse"></div>
              <div className="hidden md:flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-20 h-8 bg-gray-800 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-800 rounded-full animate-pulse"></div>
              <div className="w-24 h-8 bg-gray-800 rounded animate-pulse"></div>
            </div>
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
            {/* Mobile menu - shown on mobile only */}
            {screenSize === "mobile" && (
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-red-600/20 hover:text-red-500 transition-all"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-64 bg-black text-white border-r border-red-700/50 sm:w-72"
                >
                  <VisuallyHidden>
                    <SheetTitle>Navigation Menu</SheetTitle>
                  </VisuallyHidden>
                  <MobileNavigation
                    user={user}
                    isLoggedIn={isLoggedIn}
                    onLoginClick={handleLogin}
                    onSignupClick={handleSignup}
                    onSignOutClick={handleSignOut}
                    onCloseSheet={() => setSheetOpen(false)}
                  />
                </SheetContent>
              </Sheet>
            )}

            {/* Brand - Netflix inspired */}
            <Link href="/" className="flex items-center space-x-2 group flex-shrink-0">
              <div className="text-2xl font-extrabold tracking-wide">
                <span className="text-red-600 group-hover:text-red-500 transition-colors">
                  Luta
                </span>
                <span className="text-white group-hover:text-gray-300 transition-colors">
                  Zed
                </span>
              </div>
            </Link>

            {/* Desktop/Tablet nav - Show ALL items */}
            {screenSize !== "mobile" && (
              <nav className="hidden md:flex items-center space-x-1">
                <TooltipProvider delayDuration={300}>
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    // On tablet, show icon only with tooltip
                    const isTablet = screenSize === "tablet";

                    return (
                      <Tooltip key={item.name}>
                        <TooltipTrigger asChild>
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className={`flex items-center gap-2 transition-all duration-200 ${
                              isTablet 
                                ? "px-3 h-10 w-10 justify-center" 
                                : "px-3 h-9"
                            } ${
                              isActive
                                ? "text-red-500 font-semibold bg-red-500/10"
                                : "text-gray-300 hover:text-red-500 hover:bg-red-500/10"
                            }`}
                          >
                            <Link href={item.href}>
                              <Icon className="h-5 w-5" />
                              {!isTablet && (
                                <span className="text-sm">{item.name}</span>
                              )}
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        {isTablet && (
                          <TooltipContent 
                            side="bottom" 
                            className="bg-black border-red-600 text-white animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                          >
                            <p>{item.name}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  })}
                </TooltipProvider>
              </nav>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Show messages only for logged-in users */}
            {isLoggedIn && screenSize !== "mobile" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-300 hover:text-red-500 hover:bg-red-500/10"
                      asChild
                    >
                      <Link href="/messages">
                        <MessageCircle className="h-5 w-5" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-black border-red-600 text-white">
                    <p>Messages</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Show notifications only for logged-in users */}
            {isLoggedIn && screenSize !== "mobile" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative text-gray-300 hover:text-red-500 hover:bg-red-500/10"
                      asChild
                    >
                      <Link href="/notifications">
                        <Bell className="h-5 w-5" />
                        <Badge className="absolute -top-1 -right-1 bg-red-600 text-white text-xs h-5 w-5 p-0 flex items-center justify-center border border-black">
                          3
                        </Badge>
                      </Link>
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
                      <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                      <AvatarFallback className="bg-gradient-to-br from-red-600 to-red-800 text-white">
                        {getUserInitials()}
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
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-400">{user?.email || ""}</p>
                      <div className="flex items-center gap-1">
                        <span className="text-xs px-2 py-0.5 bg-red-600/20 text-red-400 rounded-full">
                          {user?.role || "ROLE UNKNOWN"}
                           
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
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-red-500 hover:bg-red-600/20 hover:text-red-400 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                {screenSize !== "mobile" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size={screenSize === "tablet" ? "icon" : "sm"}
                          className={`text-gray-300 hover:text-red-500 hover:bg-red-500/10 transition-all ${
                            screenSize === "tablet" ? "h-9 w-9" : ""
                          }`}
                          onClick={handleLogin}
                        >
                          <LogIn className="h-4 w-4" />
                          {screenSize === "desktop" && (
                            <span>Login</span>
                          )}
                        </Button>
                      </TooltipTrigger>
                      {screenSize === "tablet" && (
                        <TooltipContent className="bg-black border-red-600 text-white">
                          <p>Login</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size={screenSize === "tablet" ? "icon" : "sm"}
                        className={`bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-md shadow-lg hover:shadow-red-500/25 transition-all ${
                          screenSize === "tablet" ? "h-9 w-9" : ""
                        }`}
                        onClick={handleSignup}
                      >
                        <UserPlus className="h-4 w-4" />
                        {screenSize === "desktop" && <span>Sign Up</span>}
                        {screenSize === "mobile" && <span className="sr-only">Sign Up</span>}
                      </Button>
                    </TooltipTrigger>
                    {screenSize === "tablet" && (
                      <TooltipContent className="bg-black border-red-600 text-white">
                        <p>Sign Up</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

interface MobileNavigationProps {
  user: any;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onSignOutClick: () => void;
  onCloseSheet: () => void;
}

function MobileNavigation({
  user,
  isLoggedIn,
  onLoginClick,
  onSignupClick,
  onSignOutClick,
  onCloseSheet,
}: MobileNavigationProps) {
  const pathname = usePathname();
  const navigationItems = isLoggedIn ? loggedInNavigation : loggedOutNavigation;

  const allMobileItems = [
    ...navigationItems,
    ...(isLoggedIn ? userNavigation : []),
  ];

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-red-700/50">
        <div className="text-xl font-bold text-red-500">Luta Zed</div>
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
                  onCloseSheet();
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
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback className="bg-gradient-to-br from-red-600 to-red-800 text-white">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">
                  {user?.name || "User"}
                </span>
                <span className="text-xs text-gray-400">{user?.email || ""}</span>
              </div>
            </div>
            <SheetClose asChild>
              <Button
                variant="outline"
                className="w-full text-red-500 border-red-700/50 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                onClick={() => {
                  onCloseSheet();
                  onSignOutClick();
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