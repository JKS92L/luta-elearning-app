"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Users,
  Clock,
  Play,
  BookOpen,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { useState, useEffect } from "react";
import { PreviewModal } from "@/components/preview-modal";
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

// -----------------------------
// 🔹 TYPES
// -----------------------------

type ClassLevel = "PRIMARY" | "JUNIOR" | "SENIOR" | "COLLEGE";

export interface Lesson {
  id: string;
  title: string;
  duration: string;
}

export interface Discussion {
  id: string;
  user: string;
  message: string;
  date: string;
}

export interface AITutorResponse {
  question: string;
  answer: string;
}

export interface Resource {
  id: string;
  title: string;
  type: string;
  url: string;
}

export interface ZambianClass {
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
  level: "PRIMARY" | "JUNIOR" | "SENIOR" | "COLLEGE";
  location: string;
  featured: boolean;
  
  // Add the new properties
  lessons?: Lesson[];
  discussions?: Discussion[];
  aiTutorResponses?: AITutorResponse[];
  resources?: Resource[];
}

// -----------------------------
// 🔹 DATA
// -----------------------------
const zambianClasses: ZambianClass[] = [
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

    // 🧾 Lessons tab
    lessons: [
      { id: "l1", title: "Introduction to Grade 7 Revision", duration: "10m" },
      {
        id: "l2",
        title: "Mathematics Review: Fractions & Decimals",
        duration: "25m",
      },
      { id: "l3", title: "English Grammar Practice", duration: "30m" },
    ],

    // 💬 Discussions tab
    discussions: [
      {
        id: "d1",
        user: "Chipo M.",
        message: "Can someone explain the Science experiment in Lesson 2?",
        date: "2025-10-10",
      },
      {
        id: "d2",
        user: "Teacher Nkandu",
        message: "Sure, I'll upload a video on that soon!",
        date: "2025-10-11",
      },
    ],

    // 🤖 AI Tutor tab
    aiTutorResponses: [
      {
        question: "What's the best way to prepare for Grade 7 exams?",
        answer:
          "Focus on daily revision, especially on mathematics and comprehension. Practice ECZ past papers weekly.",
      },
    ],

    // 📚 Resources tab
    resources: [
      {
        id: "r1",
        title: "Grade 7 Revision Guide (PDF)",
        type: "PDF",
        url: "/resources/grade7-revision.pdf",
      },
      {
        id: "r2",
        title: "Maths Practice Video",
        type: "Video",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
    ],
  },
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

    // 🧾 Lessons tab
    lessons: [
      { id: "l1", title: "Introduction to Junior Science", duration: "15m" },
      {
        id: "l2",
        title: "Biology: Human Body Systems",
        duration: "35m",
      },
      { id: "l3", title: "Chemistry: Elements & Compounds", duration: "30m" },
      { id: "l4", title: "Physics: Forces & Motion", duration: "40m" },
    ],

    // 💬 Discussions tab
    discussions: [
      {
        id: "d1",
        user: "James K.",
        message: "How do we conduct the chemistry experiment safely?",
        date: "2025-09-15",
      },
      {
        id: "d2",
        user: "Mr. Musonda",
        message:
          "Always wear safety goggles and follow the lab manual carefully.",
        date: "2025-09-16",
      },
    ],

    // 🤖 AI Tutor tab
    aiTutorResponses: [
      {
        question: "What are the most important topics for Grade 9 Science?",
        answer:
          "Focus on human biology, chemical reactions, electricity, and environmental science. These are frequently tested in ECZ exams.",
      },
    ],

    // 📚 Resources tab
    resources: [
      {
        id: "r1",
        title: "Science Practical Guide (PDF)",
        type: "PDF",
        url: "/resources/junior-science-guide.pdf",
      },
      {
        id: "r2",
        title: "Biology Diagrams Collection",
        type: "PDF",
        url: "/resources/biology-diagrams.pdf",
      },
    ],
  },
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

    // 🧾 Lessons tab
    lessons: [
      { id: "l1", title: "ECZ Exam Strategy & Planning", duration: "20m" },
      {
        id: "l2",
        title: "Advanced Mathematics: Calculus",
        duration: "45m",
      },
      { id: "l3", title: "Biology: Genetics & Evolution", duration: "35m" },
      { id: "l4", title: "Chemistry: Organic Chemistry", duration: "40m" },
    ],

    // 💬 Discussions tab
    discussions: [
      {
        id: "d1",
        user: "Sarah M.",
        message: "How many past papers should we attempt per week?",
        date: "2025-08-20",
      },
      {
        id: "d2",
        user: "Dr. Chanda",
        message:
          "I recommend 2-3 past papers weekly with thorough review of mistakes.",
        date: "2025-08-21",
      },
    ],

    // 🤖 AI Tutor tab
    aiTutorResponses: [
      {
        question: "How to manage time during ECZ exams?",
        answer:
          "Practice with timed sessions, allocate time per question based on marks, and always leave time for review. Science papers need careful time management.",
      },
    ],

    // 📚 Resources tab
    resources: [
      {
        id: "r1",
        title: "ECZ Past Papers 2020-2024 (PDF)",
        type: "PDF",
        url: "/resources/ecz-past-papers.pdf",
      },
      {
        id: "r2",
        title: "Formula Sheet - All Sciences",
        type: "PDF",
        url: "/resources/science-formulas.pdf",
      },
    ],
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

    // 🧾 Lessons tab
    lessons: [
      {
        id: "l1",
        title: "Introduction to Commerce Principles",
        duration: "25m",
      },
      {
        id: "l2",
        title: "Accounting: Double Entry System",
        duration: "40m",
      },
      {
        id: "l3",
        title: "Business Studies: Market Structures",
        duration: "35m",
      },
      { id: "l4", title: "Economics: Supply & Demand", duration: "30m" },
    ],

    // 💬 Discussions tab
    discussions: [
      {
        id: "d1",
        user: "Peter L.",
        message: "Can you explain the balance sheet format again?",
        date: "2025-09-05",
      },
      {
        id: "d2",
        user: "Mr. David",
        message:
          "I'll create a detailed video tutorial on balance sheets this weekend.",
        date: "2025-09-06",
      },
    ],

    // 🤖 AI Tutor tab
    aiTutorResponses: [
      {
        question:
          "What's the difference between commerce and business studies?",
        answer:
          "Commerce focuses on trade and distribution, while Business Studies covers overall business operations including management, marketing, and finance.",
      },
    ],

    // 📚 Resources tab
    resources: [
      {
        id: "r1",
        title: "Accounting Practice Workbook (PDF)",
        type: "PDF",
        url: "/resources/accounting-workbook.pdf",
      },
      {
        id: "r2",
        title: "Business Case Studies Collection",
        type: "PDF",
        url: "/resources/business-cases.pdf",
      },
    ],
  },
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

    // 🧾 Lessons tab
    lessons: [
      { id: "l1", title: "Programming Fundamentals", duration: "30m" },
      {
        id: "l2",
        title: "Python Syntax & Data Types",
        duration: "45m",
      },
      { id: "l3", title: "Control Structures & Loops", duration: "40m" },
      { id: "l4", title: "Functions & Modules", duration: "35m" },
    ],

    // 💬 Discussions tab
    discussions: [
      {
        id: "d1",
        user: "Lisa B.",
        message: "How do I debug Python code effectively?",
        date: "2025-07-12",
      },
      {
        id: "d2",
        user: "Dr. Mulenga",
        message:
          "Use print statements strategically and learn to use the debugger in VS Code.",
        date: "2025-07-13",
      },
    ],

    // 🤖 AI Tutor tab
    aiTutorResponses: [
      {
        question: "What programming language should I learn after Python?",
        answer:
          "After Python, consider JavaScript for web development, Java for enterprise applications, or C++ for system programming. It depends on your career goals.",
      },
    ],

    // 📚 Resources tab
    resources: [
      {
        id: "r1",
        title: "Python Cheat Sheet (PDF)",
        type: "PDF",
        url: "/resources/python-cheatsheet.pdf",
      },
      {
        id: "r2",
        title: "Coding Exercises Collection",
        type: "PDF",
        url: "/resources/python-exercises.pdf",
      },
    ],
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

    // 🧾 Lessons tab
    lessons: [
      {
        id: "l1",
        title: "Introduction to Business Management",
        duration: "25m",
      },
      {
        id: "l2",
        title: "Marketing Strategies for Zambian Market",
        duration: "40m",
      },
      { id: "l3", title: "Financial Management Basics", duration: "35m" },
      { id: "l4", title: "Business Plan Development", duration: "45m" },
    ],

    // 💬 Discussions tab
    discussions: [
      {
        id: "d1",
        user: "Daniel C.",
        message: "How do I conduct market research in rural Zambia?",
        date: "2025-08-08",
      },
      {
        id: "d2",
        user: "Mrs. Beatrice",
        message:
          "Focus on community engagement and local leader partnerships for accurate data.",
        date: "2025-08-09",
      },
    ],

    // 🤖 AI Tutor tab
    aiTutorResponses: [
      {
        question: "What are the key elements of a successful business plan?",
        answer:
          "Executive summary, market analysis, organization structure, product/service line, marketing strategy, financial projections, and funding request if applicable.",
      },
    ],

    // 📚 Resources tab
    resources: [
      {
        id: "r1",
        title: "Business Plan Template (PDF)",
        type: "PDF",
        url: "/resources/business-plan-template.pdf",
      },
      {
        id: "r2",
        title: "Zambian Market Analysis Report",
        type: "PDF",
        url: "/resources/zambia-market-report.pdf",
      },
    ],
  },
];

// -----------------------------
// 🔹 CONSTANTS
// -----------------------------

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

// -----------------------------
// 🔹 MAIN COMPONENT
// -----------------------------

export default function ClassCards() {
  const [filter, setFilter] = useState<"ALL" | ClassLevel>("ALL");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ZambianClass | null>(null);

  const handlePreview = (classItem: ZambianClass) => {
    setSelectedClass(classItem);
    setPreviewModalOpen(true);
  };

  const handleEnroll = (classId: string) => {
    console.log("Enrolling in class:", classId);
    setPreviewModalOpen(false);
  };

  const filteredClasses =
    filter === "ALL"
      ? zambianClasses
      : zambianClasses.filter((cls) => cls.level === filter);

  const featuredClasses = zambianClasses.filter((cls) => cls.featured);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(
        (prev) => (prev + 1) % Math.ceil(featuredClasses.length / 3)
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

        {/* Featured Section */}
        {filter === "ALL" && featuredClasses.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center text-foreground">
              Featured Classes
            </h3>
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" custom={currentIndex}>
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.8 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {featuredClasses
                    .slice(currentIndex * 3, (currentIndex + 1) * 3)
                    .map((classItem) => (
                      <FeaturedClassCard
                        key={classItem.id}
                        classItem={classItem}
                        onPreview={handlePreview}
                      />
                    ))}
                </motion.div>
              </AnimatePresence>

              {/* Nav Buttons */}
              <div className="absolute inset-y-0 left-0 flex items-center pl-2">
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
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    setCurrentIndex(
                      (prev) =>
                        (prev + 1) % Math.ceil(featuredClasses.length / 3)
                    )
                  }
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
            <ClassCard
              key={classItem.id}
              classItem={classItem}
              onPreview={handlePreview}
            />
          ))}
        </div>

        {/* Preview Modal */}
        <PreviewModal
          isOpen={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          classItem={selectedClass}
          onEnroll={handleEnroll}
        />

        {/* Empty State */}
        {filteredClasses.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No classes found for the selected level. Check back soon for new
            classes!
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="gap-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
          >
            View All Zambian Classes
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

// -----------------------------
// 🔹 CLASS CARD COMPONENT
// -----------------------------

function ClassCard({
  classItem,
  onPreview,
}: {
  classItem: ZambianClass;
  onPreview: (classItem: ZambianClass) => void;
}) {
  return (
    <Card className="group bg-card border hover:border-red-500/40 transition-all hover:scale-[1.02]">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={classItem.image}
          alt={classItem.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
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

      <CardHeader>
        <CardTitle className="text-lg">{classItem.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {classItem.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between text-sm mb-3">
          <span>👩‍🏫 {classItem.instructor}</span>
          <span>⭐ {classItem.rating}</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {classItem.subjects.slice(0, 3).map((subject, i) => (
            <Badge
              key={i}
              variant="outline"
              className="text-xs border-red-500 text-red-500"
            >
              {subject}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          className="flex-1 bg-red-600 text-white"
          size="sm"
          onClick={() => onPreview(classItem)}
        >
          <Play className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-red-600 text-red-500"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Enroll
        </Button>
      </CardFooter>
    </Card>
  );
}

// -----------------------------
// 🔹 FEATURED CLASS CARD
// -----------------------------

function FeaturedClassCard({
  classItem,
  onPreview,
}: {
  classItem: ZambianClass;
  onPreview: (classItem: ZambianClass) => void;
}) {
  return (
    <Card className="group relative border border-red-200 hover:border-red-500 transition-all">
      <div className="absolute -top-2 -right-2">
        <Badge className="bg-red-600 text-white animate-pulse">Featured</Badge>
      </div>

      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={classItem.image}
          alt={classItem.title}
          className="w-full h-40 object-cover group-hover:scale-110 transition-transform"
        />
      </div>

      <CardHeader>
        <CardTitle className="text-lg group-hover:text-red-500 transition-colors">
          {classItem.title}
        </CardTitle>
        <CardDescription>{classItem.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between text-sm mb-2">
          <span>{classItem.instructor}</span>
          <span>⭐ {classItem.rating}</span>
        </div>
        <div className="text-center text-lg font-bold text-red-600">
          ZMW {classItem.price}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          className="flex-1 bg-red-600 text-white"
          size="sm"
          onClick={() => onPreview(classItem)}
        >
          <Play className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-red-600 text-red-500"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Enroll Now
        </Button>
      </CardFooter>
    </Card>
  );
}
