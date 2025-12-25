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
  const [duration, setDuration] = useState(3600);

  if (!classItem) return null;

  // Mock data
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
      ],
    },
  ];

  const comments = [
    {
      id: "1",
      user: "John Banda",
      avatar: "/api/placeholder/32/32",
      text: "This lesson was very helpful!",
      timestamp: "2 hours ago",
      likes: 24,
      dislikes: 2,
    },
  ];

  const resources = [
    {
      type: "exercise",
      title: "Practice Worksheet 1",
      format: "PDF",
      size: "2.4 MB",
    },
  ];

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
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-6xl w-[95vw]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
        <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <Badge
              variant="secondary"
              className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 flex-shrink-0"
            >
              Preview
            </Badge>
            <h2 className="text-lg md:text-2xl font-bold text-foreground truncate">
              {classItem.title}
            </h2>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="flex-shrink-0 hover:bg-muted"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-col h-[85vh] md:h-[80vh]">
        {/* Video Player Section */}
        <div className="p-4 md:p-6 border-b border-border flex-shrink-0">
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
              <div className="text-center text-white">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-red-700 transition-colors"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 md:h-8 md:w-8" />
                  ) : (
                    <Play className="h-6 w-6 md:h-8 md:w-8 ml-1" />
                  )}
                </button>
                <p className="text-base md:text-lg font-medium">
                  Click to play preview
                </p>
                <p className="text-xs md:text-sm text-gray-400 mt-1">
                  5 minutes preview available
                </p>
              </div>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-4 text-white">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:bg-white/10 p-1.5 md:p-2 rounded-full transition-colors"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 md:h-5 md:w-5" />
                  ) : (
                    <Play className="h-4 w-4 md:h-5 md:w-5" />
                  )}
                </button>

                <div className="flex-1 flex items-center gap-1 md:gap-2">
                  <span className="text-xs md:text-sm">
                    {formatTime(currentTime)}
                  </span>
                  <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-600 rounded-full"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs md:text-sm">
                    {formatTime(duration)}
                  </span>
                </div>

                <button
                  className="hover:bg-white/10 p-1.5 md:p-2 rounded-full transition-colors"
                  aria-label="Volume"
                >
                  <Volume2 className="h-4 w-4 md:h-5 md:w-5" />
                </button>
                <button
                  className="hover:bg-white/10 p-1.5 md:p-2 rounded-full transition-colors"
                  aria-label="Fullscreen"
                >
                  <Maximize className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Class Info */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-xs md:text-sm">
            <div className="flex items-center gap-1 md:gap-2">
              <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
              <span className="truncate">{classItem.rating} Rating</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <Users className="h-3 w-3 md:h-4 md:w-4" />
              <span className="truncate">
                {classItem.students.toLocaleString()} Students
              </span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <Clock className="h-3 w-3 md:h-4 md:w-4" />
              <span className="truncate">{classItem.duration}</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <MapPin className="h-3 w-3 md:h-4 md:w-4" />
              <span className="truncate">{classItem.location}</span>
            </div>
          </div>
        </div>

        {/* Tabs Section - Now with proper structure */}
        <div className="flex-1 min-h-0 overflow-hidden border-b border-border">
          <Tabs tabs={tabs} defaultTab="lessons">
            <Tabs.Content id="lessons">
              <div className="h-full overflow-y-auto p-4">
                <Accordion
                  items={chapters.map((chapter, chapterIndex) => ({
                    id: chapter.id,
                    title: `Chapter ${chapterIndex + 1}: ${chapter.title}`,
                    icon: <BookOpen className="h-4 w-4" />,
                    content: (
                      <div className="space-y-3 pt-2">
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
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-medium flex-shrink-0">
                                      {lessonIndex + 1}
                                    </div>
                                    <span className="text-sm truncate">
                                      {lesson.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
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
            </Tabs.Content>

            <Tabs.Content id="comments">
              <div className="h-full overflow-y-auto p-4 space-y-4">
                {/* Comment Input */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-medium">U</span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      placeholder="Add a comment..."
                      className="w-full p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-background text-sm"
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
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-medium">
                          {comment.user.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-foreground text-sm">
                            {comment.user}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {comment.timestamp}
                          </span>
                        </div>
                        <p className="mt-1 text-foreground text-sm">
                          {comment.text}
                        </p>
                        <div className="flex items-center gap-4 mt-2 flex-wrap">
                          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                            <ThumbsUp className="h-3 w-3 md:h-4 md:w-4" />
                            <span className="text-xs">{comment.likes}</span>
                          </button>
                          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                            <ThumbsDown className="h-3 w-3 md:h-4 md:w-4" />
                            <span className="text-xs">{comment.dislikes}</span>
                          </button>
                          <button className="text-sm text-muted-foreground hover:text-foreground text-xs">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Tabs.Content>

            <Tabs.Content id="tutor">
              <div className="h-full flex flex-col p-4">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-muted rounded-lg p-4 max-w-[80%]">
                      <p className="text-foreground text-sm">
                        Hello! I'm your AI tutor. I can help explain concepts
                        from this lesson, provide additional examples, or answer
                        any questions you have about the material. What would
                        you like to know?
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <div className="bg-red-600 text-white rounded-lg p-4 max-w-[80%]">
                      <p className="text-sm">
                        Can you explain the concept of variables in simpler
                        terms?
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-muted rounded-lg p-4 max-w-[80%]">
                      <p className="text-foreground text-sm">
                        Certainly! Think of variables like labeled containers...
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask your AI tutor..."
                    className="flex-1 p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-background text-sm"
                  />
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    <Bot className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                    Ask
                  </Button>
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content id="resources">
              <div className="h-full overflow-y-auto p-4 space-y-3">
                {resources.map((resource, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 md:p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                        <Download className="h-4 w-4 md:h-5 md:w-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-foreground text-sm md:text-base truncate">
                          {resource.title}
                        </h4>
                        <p className="text-xs md:text-sm text-muted-foreground truncate">
                          {resource.format} • {resource.size}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0"
                    >
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </Tabs.Content>
          </Tabs>
        </div>

        {/* Footer - Always visible now */}
        <div className="border-t border-border p-4 md:p-6 bg-muted/20 flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-xl md:text-2xl font-bold text-red-600 dark:text-red-500">
                ZMW {classItem.price}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">
                Full course access • Certificate included
              </p>
            </div>
            <div className="flex gap-2 md:gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                size="sm"
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white flex-1 sm:flex-none"
              >
                Close Preview
              </Button>
              <Button
                onClick={() => onEnroll(classItem.id)}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white flex-1 sm:flex-none"
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
