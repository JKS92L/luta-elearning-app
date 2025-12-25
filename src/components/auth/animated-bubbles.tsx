"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

export function AnimatedBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Get actual theme to use
  const currentTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Create initial bubbles
    const initialBubbles: Bubble[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 80 + 30,
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.3 + 0.1,
    }));
    setBubbles(initialBubbles);

    // Animate bubbles
    const interval = setInterval(() => {
      setBubbles((prev) =>
        prev
          .map((bubble) => ({
            ...bubble,
            y: bubble.y - bubble.speed,
            x: bubble.x + Math.sin(Date.now() / 1000 + bubble.id) * 0.3,
            opacity: Math.sin(Date.now() / 2000 + bubble.id) * 0.15 + 0.15,
          }))
          .map((bubble) => ({
            ...bubble,
            y: bubble.y < -10 ? 110 : bubble.y,
            x: bubble.x > 110 ? -10 : bubble.x < -10 ? 110 : bubble.x,
          }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, [mounted]);

  if (!mounted) return null;

  const getBubbleColor = (bubble: Bubble) => {
    const isRed = bubble.id % 3 === 0;

    if (currentTheme === "dark") {
      return isRed
        ? `radial-gradient(circle at 30% 30%, rgba(239, 68, 68, ${
            bubble.opacity
          }), rgba(220, 38, 38, ${bubble.opacity * 0.5}), transparent 70%)`
        : `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, ${
            bubble.opacity * 0.8
          }), rgba(255, 255, 255, ${bubble.opacity * 0.3}), transparent 70%)`;
    } else {
      return isRed
        ? `radial-gradient(circle at 30% 30%, rgba(239, 68, 68, ${
            bubble.opacity * 0.8
          }), rgba(220, 38, 38, ${bubble.opacity * 0.4}), transparent 70%)`
        : `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, ${
            bubble.opacity
          }), rgba(240, 240, 240, ${bubble.opacity * 0.6}), transparent 70%)`;
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full"
          style={{
            left: `${bubble.x}vw`,
            top: `${bubble.y}vh`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            background: getBubbleColor(bubble),
            filter: "blur(15px)",
            transition: "all 0.1s linear",
            willChange: "transform, opacity",
          }}
        />
      ))}

      {/* Theme-aware gradient overlays */}
      <div
        className={cn(
          "absolute inset-0",
          currentTheme === "dark"
            ? "bg-gradient-to-b from-black/40 via-transparent to-black/60"
            : "bg-gradient-to-b from-white/30 via-transparent to-white/50"
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-transparent to-red-600/10" />
      <div
        className={cn(
          "absolute inset-0",
          currentTheme === "dark"
            ? "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/20 via-transparent to-black/40"
            : "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-white/30"
        )}
      />
    </div>
  );
}
