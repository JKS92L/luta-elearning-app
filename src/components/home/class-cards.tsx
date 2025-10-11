"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Clock, Play, BookOpen, ArrowRight } from "lucide-react";

// Mock data - replace with actual API data
const mockClasses = [
  {
    id: 1,
    title: "Advanced Mathematics",
    description:
      "Master calculus, algebra, and advanced mathematical concepts with interactive lessons.",
    instructor: "Dr. Sarah Johnson",
    rating: 4.9,
    students: 1247,
    duration: "12 weeks",
    price: 99,
    image: "/api/placeholder/400/250",
    subjects: ["Calculus", "Algebra", "Statistics"],
    level: "Advanced",
  },
  {
    id: 2,
    title: "Web Development Bootcamp",
    description:
      "Learn modern web development with React, Next.js, and TypeScript from industry experts.",
    instructor: "Mike Chen",
    rating: 4.8,
    students: 2893,
    duration: "16 weeks",
    price: 149,
    image: "/api/placeholder/400/250",
    subjects: ["React", "Next.js", "TypeScript"],
    level: "Beginner",
  },
  {
    id: 3,
    title: "Data Science Fundamentals",
    description:
      "Dive into data analysis, machine learning, and visualization with Python.",
    instructor: "Dr. Emily Rodriguez",
    rating: 4.7,
    students: 1562,
    duration: "14 weeks",
    price: 129,
    image: "/api/placeholder/400/250",
    subjects: ["Python", "Machine Learning", "Data Analysis"],
    level: "Intermediate",
  },
  {
    id: 4,
    title: "Mobile App Development",
    description:
      "Build cross-platform mobile applications with React Native and Expo.",
    instructor: "Alex Thompson",
    rating: 4.6,
    students: 987,
    duration: "10 weeks",
    price: 119,
    image: "/api/placeholder/400/250",
    subjects: ["React Native", "JavaScript", "Mobile"],
    level: "Intermediate",
  },
  {
    id: 5,
    title: "UI/UX Design Masterclass",
    description:
      "Learn professional design principles and tools to create stunning user interfaces.",
    instructor: "Sophia Williams",
    rating: 4.9,
    students: 2034,
    duration: "8 weeks",
    price: 89,
    image: "/api/placeholder/400/250",
    subjects: ["Figma", "Design", "Prototyping"],
    level: "Beginner",
  },
  {
    id: 6,
    title: "Digital Marketing Strategy",
    description:
      "Master digital marketing channels and create effective marketing campaigns.",
    instructor: "David Kim",
    rating: 4.5,
    students: 1756,
    duration: "6 weeks",
    price: 79,
    image: "/api/placeholder/400/250",
    subjects: ["SEO", "Social Media", "Analytics"],
    level: "All Levels",
  },
];

export function ClassCards() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(mockClasses.length / 3));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-background via-muted/20 to-background transition-colors duration-500">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Featured Classes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-3">
            Discover our most popular courses taught by top instructors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockClasses.map((classItem) => (
            <Card
              key={classItem.id}
              className="group bg-card border border-border/50 hover:border-red-500/40 transition-all hover:shadow-lg hover:shadow-red-500/20 hover:scale-[1.03]"
            >
              {/* Image + Level */}
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={classItem.image}
                  alt={classItem.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <Badge
                    variant="secondary"
                    className="bg-red-600/90 text-white"
                  >
                    {classItem.level}
                  </Badge>
                </div>
              </div>

              {/* Card Header */}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="group-hover:text-red-500 transition-colors">
                    {classItem.title}
                  </CardTitle>
                  <div className="text-lg font-bold text-red-600">
                    ${classItem.price}
                  </div>
                </div>
                <CardDescription className="text-muted-foreground line-clamp-2">
                  {classItem.description}
                </CardDescription>
              </CardHeader>

              {/* Card Content */}
              <CardContent className="pb-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Instructor</span>
                    <span className="font-medium">{classItem.instructor}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{classItem.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{classItem.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{classItem.duration}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {classItem.subjects.map((subject, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs border-red-500 text-red-500"
                      >
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>

              {/* Card Footer */}
              <CardFooter className="flex gap-2">
                <Button
                  className="flex-1 bg-red-600 text-white hover:bg-red-700 hover:shadow-red-500/40"
                  size="sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-red-600 text-red-500 hover:bg-red-600 hover:text-white"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Enroll
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="gap-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
          >
            View All Classes
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
