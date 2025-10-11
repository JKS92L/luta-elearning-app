"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight, Star, Users, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background text-foreground transition-colors duration-500">
      {/* 🎥 Background Video with theme-aware gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVideoLoaded ? 1 : 0 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-red-900/30 to-background z-10 dark:from-black/90 dark:via-red-700/40 dark:to-background" />
        <motion.video
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          className="w-full h-full object-cover"
          poster="/api/placeholder/1920/1080"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        >
          <source src="/api/placeholder/1920/1080" type="video/mp4" />
        </motion.video>
      </motion.div>

      {/* ⚡ Hero Content */}
      <div className="relative z-20 text-center container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* 🧠 Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight"
          >
            Empower Your
            <span className="block bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent dark:from-red-500 dark:to-red-300 drop-shadow-lg">
              Learning Journey
            </span>
          </motion.h1>

          {/* 💬 Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto"
          >
            Learn from industry experts and join a global community of learners
            — anytime, anywhere.
          </motion.p>

          {/* 🎯 CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-4"
          >
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl px-10 py-6 transition-all hover:scale-105 shadow-lg hover:shadow-red-600/50"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Learning Free
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border border-foreground/50 text-foreground rounded-2xl px-10 py-6 hover:bg-foreground/10 hover:text-red-500 transition-all hover:scale-105"
            >
              Explore Classes
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          {/* 📊 Stats Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 max-w-3xl mx-auto"
          >
            {[
              {
                icon: (
                  <Users className="h-7 w-7 text-red-500 dark:text-red-400" />
                ),
                value: "10K+",
                label: "Active Students",
              },
              {
                icon: (
                  <BookOpen className="h-7 w-7 text-red-500 dark:text-red-400" />
                ),
                value: "500+",
                label: "Expert Classes",
              },
              {
                icon: (
                  <Star className="h-7 w-7 text-red-500 dark:text-red-400" />
                ),
                value: "4.9",
                label: "Average Rating",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center gap-3 bg-background/60 border border-border backdrop-blur-lg p-5 rounded-2xl transition-all hover:border-red-500/60 hover:shadow-lg hover:shadow-red-500/20"
              >
                {stat.icon}
                <div className="text-left">
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* 🖱 Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-red-500 rounded-full flex justify-center items-start p-1">
            <div className="w-1 h-3 bg-red-500 rounded-full animate-pulse" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
