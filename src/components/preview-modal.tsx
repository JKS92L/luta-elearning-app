"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/modal-tabs";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ZambianClass } from "@/components/home/class-cards";
import {
  X,
  Play,
  Pause,
  Volume2,
  Maximize,
  BookOpen,
  MessageCircle,
  Bot,
  Download,
  ThumbsUp,
  ThumbsDown,
  Share,
  Clock,
  Users,
  Star,
  MapPin,
} from "lucide-react";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  classItem: ZambianClass | null;
  onEnroll: (classId: string) => void;
}

export function PreviewModal({
  isOpen,
  onClose,
  classItem,
  onEnroll,
}: PreviewModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(3600); // 1 hour in seconds

  if (!classItem) return null;

  // Mock data for the modal content
  const chapters = [
    {
      id: "1",
      title: "Introduction to Mathematics",
      topics: [
        {
          id: "1-1",
          title: "Basic Concepts",
          lessons: [
            {
              id: "1-1-1",
              title: "What is Mathematics?",
              duration: "15:30",
              videoUrl: "#",
            },
            {
              id: "1-1-2",
              title: "Numbers and Operations",
              duration: "22:15",
              videoUrl: "#",
            },
          ],
        },
        {
          id: "1-2",
          title: "Algebra Fundamentals",
          lessons: [
            {
              id: "1-2-1",
              title: "Variables and Expressions",
              duration: "18:45",
              videoUrl: "#",
            },
            {
              id: "1-2-2",
              title: "Solving Equations",
              duration: "25:20",
              videoUrl: "#",
            },
          ],
        },
      ],
    },
    {
      id: "2",
      title: "Advanced Topics",
      topics: [
        {
          id: "2-1",
          title: "Calculus",
          lessons: [
            {
              id: "2-1-1",
              title: "Introduction to Derivatives",
              duration: "30:10",
              videoUrl: "#",
            },
          ],
        },
      ],
    },
  ];

  const comments = [
    {
      id: "1",
      user: "John Banda",
      avatar: "/api/placeholder/32/32",
      text: "This lesson was very helpful! The instructor explains complex concepts in a simple way.",
      timestamp: "2 hours ago",
      likes: 24,
      dislikes: 2,
      replies: [
        {
          id: "1-1",
          user: "Sarah Mwape",
          avatar: "/api/placeholder/32/32",
          text: "I completely agree! The examples were very relevant to our curriculum.",
          timestamp: "1 hour ago",
          likes: 8,
          dislikes: 0,
        },
      ],
    },
  ];

  const resources = [
    {
      type: "exercise",
      title: "Practice Worksheet 1",
      format: "PDF",
      size: "2.4 MB",
    },
    { type: "notes", title: "Chapter Summary", format: "PDF", size: "1.1 MB" },
    {
      type: "url",
      title: "Additional Reading Material",
      format: "Link",
      size: "External",
    },
  ];

  // Format time for video player
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const tabs = [
    {
      id: "lessons",
      label: "Course Content",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      id: "comments",
      label: "Discussion",
      icon: <MessageCircle className="h-4 w-4" />,
    },
    { id: "tutor", label: "AI Tutor", icon: <Bot className="h-4 w-4" /> },
    {
      id: "resources",
      label: "Resources",
      icon: <Download className="h-4 w-4" />,
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
            >
              Preview
            </Badge>
            <h2 className="text-2xl font-bold text-foreground">
              {classItem.title}
            </h2>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-col h-[80vh]">
        {/* Video Player Section */}
        <div className="p-6 border-b border-border">
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            {/* Video Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
              <div className="text-center text-white">
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-red-700 transition-colors">
                  <Play className="h-8 w-8 ml-1" />
                </div>
                <p className="text-lg font-medium">Click to play preview</p>
                <p className="text-sm text-gray-400 mt-1">
                  5 minutes preview available
                </p>
              </div>
            </div>

            {/* Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center gap-4 text-white">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:bg-white/10 p-2 rounded-full transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </button>

                <div className="flex-1 flex items-center gap-2">
                  <span className="text-sm">{formatTime(currentTime)}</span>
                  <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-600 rounded-full"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm">{formatTime(duration)}</span>
                </div>

                <button className="hover:bg-white/10 p-2 rounded-full transition-colors">
                  <Volume2 className="h-5 w-5" />
                </button>
                <button className="hover:bg-white/10 p-2 rounded-full transition-colors">
                  <Maximize className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Class Info */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{classItem.rating} Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{classItem.students.toLocaleString()} Students</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{classItem.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{classItem.location}</span>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="flex-1 overflow-hidden">
          <Tabs tabs={tabs}>
            {/* Lessons Tab */}
            <div className="h-96 overflow-y-auto">
              <Accordion
                items={chapters.map((chapter, chapterIndex) => ({
                  id: chapter.id,
                  title: `Chapter ${chapterIndex + 1}: ${chapter.title}`,
                  icon: <BookOpen className="h-4 w-4" />,
                  content: (
                    <div className="space-y-3">
                      {chapter.topics.map((topic, topicIndex) => (
                        <div
                          key={topic.id}
                          className="ml-4 border-l-2 border-muted pl-4"
                        >
                          <h4 className="font-medium text-foreground mb-2">
                            Topic {topicIndex + 1}: {topic.title}
                          </h4>
                          <div className="space-y-2">
                            {topic.lessons.map((lesson, lessonIndex) => (
                              <div
                                key={lesson.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-medium">
                                    {lessonIndex + 1}
                                  </div>
                                  <span className="text-sm">
                                    {lesson.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="text-xs text-muted-foreground">
                                    {lesson.duration}
                                  </span>
                                  <Play className="h-3 w-3 text-red-600" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ),
                }))}
              />
            </div>

            {/* Comments Tab */}
            <div className="h-96 overflow-y-auto space-y-4">
              {/* Comment Input */}
              <div className="flex gap-3">
                <img
                  src="/api/placeholder/40/40"
                  alt="Your avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <textarea
                    placeholder="Add a comment..."
                    className="w-full p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-background"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <Button size="sm">Comment</Button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-3">
                  <div className="flex gap-3">
                    <img
                      src={comment.avatar}
                      alt={comment.user}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {comment.user}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="mt-1 text-foreground">{comment.text}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{comment.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                          <ThumbsDown className="h-4 w-4" />
                          <span>{comment.dislikes}</span>
                        </button>
                        <button className="text-sm text-muted-foreground hover:text-foreground">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Replies */}
                  {comment.replies?.map((reply) => (
                    <div key={reply.id} className="flex gap-3 ml-11">
                      <img
                        src={reply.avatar}
                        alt={reply.user}
                        className="w-6 h-6 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-foreground">
                            {reply.user}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {reply.timestamp}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-foreground">
                          {reply.text}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                            <ThumbsUp className="h-3 w-3" />
                            <span>{reply.likes}</span>
                          </button>
                          <button className="text-xs text-muted-foreground hover:text-foreground">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* AI Tutor Tab */}
            <div className="h-96 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-muted rounded-lg p-4 max-w-[80%]">
                    <p className="text-foreground">
                      Hello! I'm your AI tutor. I can help explain concepts from
                      this lesson, provide additional examples, or answer any
                      questions you have about the material. What would you like
                      to know?
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div className="bg-red-600 text-white rounded-lg p-4 max-w-[80%]">
                    <p>
                      Can you explain the concept of variables in simpler terms?
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-muted rounded-lg p-4 max-w-[80%]">
                    <p className="text-foreground">
                      Certainly! Think of variables like labeled containers. In
                      mathematics, a variable (like x or y) is a symbol that
                      represents a number we don't know yet. It's like having a
                      box with a label "x" - we know there's a number inside,
                      but we need to figure out what that number is based on the
                      information given in the problem.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask your AI tutor..."
                  className="flex-1 p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-background"
                />
                <Button className="bg-red-600 hover:bg-red-700">
                  <Bot className="h-4 w-4 mr-2" />
                  Ask
                </Button>
              </div>
            </div>

            {/* Resources Tab */}
            <div className="h-96 overflow-y-auto space-y-3">
              {resources.map((resource, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                      <Download className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">
                        {resource.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {resource.format} • {resource.size}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6 bg-muted/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-500">
                ZMW {classItem.price}
              </p>
              <p className="text-sm text-muted-foreground">
                Full course access • Certificate included
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              >
                Close Preview
              </Button>
              <Button
                onClick={() => onEnroll(classItem.id)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Enroll Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
