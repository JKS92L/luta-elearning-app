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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";

// Mock user data
const useUser = () => {
  return {
    user: {
      name: "John Doe",
      email: "john@example.com",
      avatar: "",
      role: "student",
    },
    isLoggedIn: true,
  };
};

const navigationItems = [
  { name: "Home", href: "/", icon: Home }, // for logout users
  { name: "Featured Classes", href: "/featured-classes", icon: Camera }, // for logout users
  { name: "Latest Classes", href: "/latest-classes", icon: Zap }, // for logout users
  { name: "Trending Classes", href: "/trending-classes", icon: SquareActivity }, // for logout users
  { name: "Popular Classes", href: "/popular-classes", icon: Activity }, // for logout users <Activity />
  { name: "My Classes", href: "/classes", icon: BookOpen },//for logged in users
  { name: "Explore", href: "/explore", icon: Video },//for logged in users
  {name: "Become a Teacher", href: "/teacher-apply", icon: BookOpen },//for logged in users
  { name: "Free Lessons", href: "/free-lessons", icon: Clapperboard },//for logged in users
];

const userNavigation = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();
  const pathname = usePathname();
  const { user, isLoggedIn } = useUser();

  // Detect client mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll background effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) {
    // Avoid rendering theme-dependent UI before hydration
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
        isScrolled
          ? "bg-black/90 backdrop-blur-md shadow-md border-red-600/30"
          : "bg-black/70 backdrop-blur-sm border-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-6">
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-white"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-64 bg-black text-white border-red-700"
              >
                <MobileNavigation />
              </SheetContent>
            </Sheet>

            {/* Brand */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-extrabold tracking-wide">
                <span className="text-red-600">Luta</span>
                <span className="text-white">App</span>
              </div>
            </Link>

            {/* Desktop nav */}
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
                    className={`text-sm flex items-center gap-2 text-gray-300 hover:text-red-500 transition-all ${
                      isActive ? "text-red-500 font-semibold" : ""
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
          <div className="flex items-center gap-3">
            {/* Calendar */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-300 hover:text-red-500"
                  >
                    <CalendarDays className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Calendar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Chat */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-300 hover:text-red-500"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Messages</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Notifications */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-gray-300 hover:text-red-500"
                  >
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 bg-red-600 text-white text-xs h-4 w-4 p-0 flex items-center justify-center">
                      3
                    </Badge>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

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
                    className="text-gray-300 hover:text-red-500"
                  >
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
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
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-red-600 text-white">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-black text-white border border-red-800"
                  align="end"
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-red-900" />
                  {userNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link
                          href={item.href}
                          className="flex items-center gap-2 text-gray-300 hover:text-red-500"
                        >
                          <Icon className="h-4 w-4" />
                          {item.name}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator className="bg-red-900" />
                  <DropdownMenuItem className="flex items-center gap-2 text-red-500">
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-red-500"
                >
                  <Link href="/login">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  <Link href="/signup">
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileNavigation() {
  const pathname = usePathname();
  const { user, isLoggedIn } = useUser();
  const mobileItems = [
    ...navigationItems,
    ...(isLoggedIn ? userNavigation : []),
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-red-700">
        <div className="text-xl font-bold text-red-500">Luta App</div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.name}
              asChild
              variant="ghost"
              className={`w-full justify-start gap-3 text-gray-300 hover:text-red-500 ${
                isActive ? "text-red-500" : ""
              }`}
            >
              <Link href={item.href}>
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          );
        })}
      </nav>

      {isLoggedIn && (
        <div className="p-4 border-t border-red-700">
          <div className="flex items-center gap-3 mb-3">
            <Avatar>
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-red-600 text-white">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-gray-400">{user.email}</span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full text-red-500 border-red-700 hover:bg-red-600 hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      )}
    </div>
  );
}
