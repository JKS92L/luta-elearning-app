"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
import {
  Star,
  Users,
  Clock,
  Play,
  BookOpen,
  ArrowRight,
  MapPin,
} from "lucide-react";

// Define valid class levels
type ClassLevel = "PRIMARY" | "JUNIOR" | "SENIOR" | "COLLEGE";

// Define class item type
interface ZambianClass {
  id: string;
  title: string;
  description: string;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  price: number;
  image: string;
  subjects: string[];
  level: ClassLevel;
  location: string;
  featured: boolean;
}

// Zambian classroom data
const zambianClasses: ZambianClass[] = [
  // PRIMARY LEVEL
  {
    id: "class_primary_1",
    title: "Grade 7 Comprehensive Revision",
    description:
      "Complete revision class for Grade 7 students covering all primary school subjects as per Zambian curriculum. Perfect preparation for secondary school entrance.",
    instructor: "Mrs. Nkandu Mwamba",
    rating: 4.8,
    students: 324,
    duration: "15 weeks",
    price: 450,
    image: "/api/placeholder/400/250",
    subjects: ["English Language", "Mathematics", "Science", "Social Studies"],
    level: "PRIMARY",
    location: "Lusaka",
    featured: true,
  },
  // JUNIOR SECONDARY
  {
    id: "class_junior_1",
    title: "Junior Secondary Science Intensive",
    description:
      "Focus on Science subjects for Grades 8-9 students with practical experiments and ECZ exam preparation. Hands-on learning approach.",
    instructor: "Mr. Musonda Phiri",
    rating: 4.6,
    students: 287,
    duration: "14 weeks",
    price: 600,
    image: "/api/placeholder/400/250",
    subjects: [
      "Science",
      "Mathematics",
      "English Language",
      "Computer Studies",
    ],
    level: "JUNIOR",
    location: "Kitwe",
    featured: true,
  },
  // SENIOR SECONDARY
  {
    id: "class_senior_1",
    title: "Grade 12 ECZ Examination Prep",
    description:
      "Comprehensive preparation for Grade 12 ECZ examinations with past paper practice and expert marking schemes. Boost your final scores.",
    instructor: "Dr. Chanda Bwalya",
    rating: 4.9,
    students: 512,
    duration: "16 weeks",
    price: 850,
    image: "/api/placeholder/400/250",
    subjects: [
      "Mathematics",
      "Biology",
      "Chemistry",
      "Physics",
      "English Language",
    ],
    level: "SENIOR",
    location: "Ndola",
    featured: true,
  },
  {
    id: "class_senior_2",
    title: "Commerce & Business Studies",
    description:
      "Specialized class for Commerce stream students focusing on Principles of Accounts and Business Studies with real-world case studies.",
    instructor: "Mr. David Lungu",
    rating: 4.7,
    students: 198,
    duration: "18 weeks",
    price: 700,
    image: "/api/placeholder/400/250",
    subjects: [
      "Commerce",
      "Principles of Accounts",
      "Business Studies",
      "Economics",
    ],
    level: "SENIOR",
    location: "Livingstone",
    featured: false,
  },
  // COLLEGE LEVEL
  {
    id: "class_college_1",
    title: "Introduction to Computer Programming",
    description:
      "University-level programming course covering Python, algorithms, and data structures. Perfect for Zambian tech students.",
    instructor: "Dr. Mulenga Tembo",
    rating: 4.8,
    students: 156,
    duration: "18 weeks",
    price: 1200,
    image: "/api/placeholder/400/250",
    subjects: ["Computer Science", "Python", "Algorithms", "Data Structures"],
    level: "COLLEGE",
    location: "Lusaka",
    featured: true,
  },
  {
    id: "class_college_2",
    title: "Business Management Fundamentals",
    description:
      "Essential business management concepts for college students and young entrepreneurs in the Zambian market context.",
    instructor: "Mrs. Beatrice Kasonde",
    rating: 4.5,
    students: 223,
    duration: "12 weeks",
    price: 950,
    image: "/api/placeholder/400/250",
    subjects: [
      "Business Administration",
      "Marketing",
      "Accounting",
      "Economics",
    ],
    level: "COLLEGE",
    location: "Kabwe",
    featured: false,
  },
];

const levelColors: Record<ClassLevel, string> = {
  PRIMARY:
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800",
  JUNIOR:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800",
  SENIOR:
    "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-800",
  COLLEGE:
    "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-800",
};

const levelDisplayNames: Record<ClassLevel, string> = {
  PRIMARY: "Primary School",
  JUNIOR: "Junior Secondary",
  SENIOR: "Senior Secondary",
  COLLEGE: "College/University",
};

export default function ClassCards() {
  const [filter, setFilter] = useState<"ALL" | ClassLevel>("ALL");
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredClasses =
    filter === "ALL"
      ? zambianClasses
      : zambianClasses.filter((cls) => cls.level === filter);

  const featuredClasses = zambianClasses.filter((cls) => cls.featured);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(
        (prev) =>
          (prev + 1) % Math.ceil(Math.max(1, featuredClasses.length) / 3)
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredClasses.length]);

  return (
    <section className="py-20 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Zambian Curriculum Classes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-3">
            Quality education tailored to the Zambian curriculum across all
            levels - Primary, Secondary, and Tertiary education.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button
            variant={filter === "ALL" ? "default" : "outline"}
            onClick={() => setFilter("ALL")}
            className={`${
              filter === "ALL"
                ? "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                : "border-red-600 text-red-600 hover:bg-red-600 hover:text-white dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white"
            }`}
          >
            All Levels
          </Button>
          {Object.entries(levelDisplayNames).map(([level, name]) => (
            <Button
              key={level}
              variant={filter === level ? "default" : "outline"}
              onClick={() => setFilter(level as ClassLevel)}
              className={`${
                filter === level
                  ? "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                  : "border-red-600 text-red-600 hover:bg-red-600 hover:text-white dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white"
              }`}
            >
              {name}
            </Button>
          ))}
        </div>

        {/* Featured Classes */}
        {filter === "ALL" && featuredClasses.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center text-foreground">
              Featured Classes
            </h3>

            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" custom={currentIndex}>
                <motion.div
                  key={currentIndex}
                  custom={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {featuredClasses
                    .slice(currentIndex * 3, (currentIndex + 1) * 3)
                    .map((classItem) => (
                      <FeaturedClassCard
                        key={classItem.id}
                        classItem={classItem}
                      />
                    ))}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="absolute inset-y-0 left-0 flex items-center justify-center pl-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    setCurrentIndex(
                      (prev) =>
                        (prev - 1 + Math.ceil(featuredClasses.length / 3)) %
                        Math.ceil(featuredClasses.length / 3)
                    )
                  }
                  className="bg-background/70 hover:bg-background text-red-600 border-red-500 hover:text-white hover:bg-red-600 dark:bg-background/80 dark:hover:bg-background rounded-full shadow-lg"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center justify-center pr-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    setCurrentIndex(
                      (prev) =>
                        (prev + 1) % Math.ceil(featuredClasses.length / 3)
                    )
                  }
                  className="bg-background/70 hover:bg-background text-red-600 border-red-500 hover:text-white hover:bg-red-600 dark:bg-background/80 dark:hover:bg-background rounded-full shadow-lg"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* All Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredClasses.map((classItem) => (
            <ClassCard key={classItem.id} classItem={classItem} />
          ))}
        </div>

        {/* Empty State */}
        {filteredClasses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              No classes found for the selected level. Check back soon for new
              classes!
            </div>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="gap-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white"
          >
            View All Zambian Classes
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

function ClassCard({ classItem }: { classItem: ZambianClass }) {
  return (
    <Card className="group bg-card border border-border/50 hover:border-red-500/40 transition-all hover:shadow-lg hover:shadow-red-500/20 hover:scale-[1.02]">
      {/* Image + Level Badge */}
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={classItem.image}
          alt={classItem.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <Badge className={`${levelColors[classItem.level]} border`}>
            {levelDisplayNames[classItem.level]}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge
            variant="secondary"
            className="bg-background/90 text-foreground"
          >
            <MapPin className="h-3 w-3 mr-1" />
            {classItem.location}
          </Badge>
        </div>
      </div>

      {/* Card Header */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg group-hover:text-red-500 transition-colors line-clamp-2">
            {classItem.title}
          </CardTitle>
          <div className="text-lg font-bold text-red-600 dark:text-red-500 whitespace-nowrap">
            ZMW {classItem.price}
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
            <span className="font-medium text-right">
              {classItem.instructor}
            </span>
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
            {classItem.subjects.slice(0, 3).map((subject, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs border-red-500 text-red-500 dark:border-red-400 dark:text-red-400"
              >
                {subject}
              </Badge>
            ))}
            {classItem.subjects.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{classItem.subjects.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      {/* Card Footer */}
      <CardFooter className="flex gap-2">
        <Button
          className="flex-1 bg-red-600 text-white hover:bg-red-700 hover:shadow-red-500/40 dark:bg-red-700 dark:hover:bg-red-800"
          size="sm"
        >
          <Play className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-red-600 text-red-500 hover:bg-red-600 hover:text-white dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Enroll
        </Button>
      </CardFooter>
    </Card>
  );
}

function FeaturedClassCard({ classItem }: { classItem: ZambianClass }) {
  return (
    <Card className="group relative bg-gradient-to-br from-red-50 to-white dark:from-red-950/30 dark:to-background border border-red-200 dark:border-red-800/50 hover:border-red-500 dark:hover:border-red-400 transition-all hover:shadow-xl hover:shadow-red-500/30 dark:hover:shadow-red-500/20">
      {/* Featured Badge */}
      <div className="absolute -top-2 -right-2 z-10">
        <Badge className="bg-red-600 text-white animate-pulse">Featured</Badge>
      </div>

      {/* Image */}
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={classItem.image}
          alt={classItem.title}
          className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-background/90 text-foreground">
            {levelDisplayNames[classItem.level]}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardHeader className="pb-3">
        <CardTitle className="text-lg group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
          {classItem.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {classItem.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium">{classItem.instructor}</span>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{classItem.rating}</span>
          </div>
        </div>
        <div className="text-lg font-bold text-red-600 dark:text-red-500 text-center py-2">
          ZMW {classItem.price}
        </div>
      </CardContent>

      {/* Harmonized footer: Preview + Enroll */}
      <CardFooter className="flex gap-2">
        <Button
          className="flex-1 bg-red-600 text-white hover:bg-red-700 hover:shadow-red-500/40 dark:bg-red-700 dark:hover:bg-red-800"
          size="sm"
        >
          <Play className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-red-600 text-red-500 hover:bg-red-600 hover:text-white dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Enroll Now
        </Button>
      </CardFooter>
    </Card>
  );
}
