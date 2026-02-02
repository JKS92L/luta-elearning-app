// src/app/subjects/create/page.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LevelType, CurriculumType } from "@/lib/db/schema";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Hash,
  Tag,
  Layers,
  GraduationCap,
  Info,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Loader2,
  Bookmark,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldError,
  FieldDescription,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

// Define allowed roles
const ALLOWED_ROLES = [
  "SYSTEM_ADMIN",
  "SYSTEM_SUPER_ADMIN",
  "SYSTEM_DEVELOPER",
  "TEACHER",
  "LECTURER",
];

// Common categories
const CATEGORY_SUGGESTIONS = [
  "Sciences",
  "Mathematics",
  "Humanities",
  "Languages",
  "Arts",
  "Technology",
  "Business",
  "Social Sciences",
  "Health Sciences",
  "Vocational",
  "Natural Sciences",
];

export default function CreateSubjectPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  // Check authorization
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
        return;
      }
      
      if (!user.role || !ALLOWED_ROLES.includes(user.role)) {
        toast.error("You don't have permission to create subjects");
        router.push("/subjects");
        return;
      }
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (values: any) => {
    try {
      // Clean up data before sending
      const payload = {
        ...values,
        level: values.level === "not_specified" ? null : values.level,
        curriculum_type: values.curriculum_type === "not_specified" ? null : values.curriculum_type,
      };

      const response = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || data.details || "Failed to create subject");
      }

      const newSubject = await response.json();
      
      toast.success("Subject created successfully!", {
        description: `"${newSubject.name}" has been added to the system.`,
      });

      // Redirect after a brief delay
      setTimeout(() => {
        router.push("/subjects");
        router.refresh();
      }, 1500);
      
    } catch (error) {
      toast.error("Failed to create subject", {
        description: error instanceof Error ? error.message : "Please try again",
      });
      throw error;
    }
  };

  const [formData, setFormData] = React.useState({
    name: "",
    short_tag: "",
    code: "",
    curriculum_type: "not_specified",
    category: "",
    level: "not_specified",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleInputChange = (field: string, value: string) => {
    setErrors(prev => ({ ...prev, [field]: "" }));
    
    if (field === "name" && !formData.short_tag) {
      const generatedShortTag = value
        .replace(/[^a-zA-Z0-9\s]/g, '') // Allow uppercase letters
        .replace(/\s+/g, '_')
        .substring(0, 20)
        .toUpperCase(); // Convert to uppercase
      
      setFormData(prev => ({
        ...prev,
        name: value,
        short_tag: generatedShortTag
      }));
      return;
    }
    
    if (field === "short_tag") {
      const cleanValue = value.toUpperCase().replace(/[^A-Z0-9_]/g, ''); // Uppercase, allow numbers and underscore
      if (!formData.code) {
        const generatedCode = cleanValue.replace(/[^A-Z0-9]/g, '');
        setFormData(prev => ({
          ...prev,
          short_tag: cleanValue,
          code: generatedCode
        }));
        return;
      }
      setFormData(prev => ({ ...prev, short_tag: cleanValue }));
      return;
    }
    
    if (field === "code") {
      const cleanValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      setFormData(prev => ({ ...prev, code: cleanValue }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "Subject name is required";
    if (formData.name.length > 100) newErrors.name = "Name must be less than 100 characters";
    
    if (!formData.short_tag.trim()) newErrors.short_tag = "Short tag is required";
    if (!/^[A-Z0-9_]+$/.test(formData.short_tag)) newErrors.short_tag = "Only uppercase letters, numbers, and underscores allowed";
    if (formData.short_tag.length > 20) newErrors.short_tag = "Must be 20 characters or less";
    
    if (!formData.code.trim()) newErrors.code = "Subject code is required";
    if (!/^[A-Z0-9]+$/.test(formData.code)) newErrors.code = "Only uppercase letters and numbers allowed";
    if (formData.code.length > 10) newErrors.code = "Must be 10 characters or less";
    
    if (!formData.category.trim()) newErrors.category = "Category is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setIsSubmitting(true);

    try {
      await handleSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate form completion
  const getFieldCompletion = () => {
    const fields = [
      { 
        key: 'name', 
        label: 'Name', 
        isValid: formData.name.trim().length > 0 && formData.name.length <= 100,
        required: true 
      },
      { 
        key: 'short_tag', 
        label: 'Short Tag', 
        isValid: formData.short_tag.trim().length > 0 && 
                 formData.short_tag.length <= 20 && 
                 /^[A-Z0-9_]+$/.test(formData.short_tag),
        required: true 
      },
      { 
        key: 'code', 
        label: 'Code', 
        isValid: formData.code.trim().length > 0 && 
                 formData.code.length <= 10 && 
                 /^[A-Z0-9]+$/.test(formData.code),
        required: true 
      },
      { 
        key: 'category', 
        label: 'Category', 
        isValid: formData.category.trim().length > 0,
        required: true 
      },
      { 
        key: 'level', 
        label: 'Level', 
        isValid: formData.level !== 'not_specified',
        required: false 
      },
      { 
        key: 'curriculum_type', 
        label: 'Curriculum Type', 
        isValid: formData.curriculum_type !== 'not_specified',
        required: false 
      },
    ];

    const requiredFields = fields.filter(f => f.required);
    const completedRequired = requiredFields.filter(f => f.isValid).length;
    const totalCompletion = fields.filter(f => f.isValid).length;
    
    return {
      fields,
      requiredCompletion: requiredFields.length > 0 ? 
        Math.round((completedRequired / requiredFields.length) * 100) : 0,
      totalCompletion: fields.length > 0 ? 
        Math.round((totalCompletion / fields.length) * 100) : 0,
    };
  };

  const completion = getFieldCompletion();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.role || !ALLOWED_ROLES.includes(user.role)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/subjects"
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                  <BookOpen className="h-8 w-8 text-red-400" />
                  Create New Subject
                </h1>
                <p className="text-muted-foreground mt-1">
                  Add a new subject to organize courses and resources
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={() => router.push("/subjects")}
            >
              View All Subjects
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-red-400" />
                      Subject Details
                    </CardTitle>
                    <CardDescription>
                      All fields marked with * are required
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className={cn(
                    "text-xs font-medium",
                    completion.requiredCompletion === 100 
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  )}>
                    {completion.requiredCompletion === 100 ? "✓ Ready" : `${completion.requiredCompletion}% Complete`}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <form
                  id="subject-form"
                  onSubmit={handleFormSubmit}
                  className="space-y-6"
                >
                  <FieldGroup>
                    {/* Name Field */}
                    <Field data-invalid={!!errors.name}>
                      <FieldLabel htmlFor="name">
                        Subject Name *
                      </FieldLabel>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onBlur={() => {
                          if (!formData.name.trim()) {
                            setErrors(prev => ({ ...prev, name: "Subject name is required" }));
                          }
                        }}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        aria-invalid={!!errors.name}
                        placeholder="Mathematics, Physics, Chemistry"
                      />
                      <FieldError errors={errors.name ? [{ message: errors.name }] : []} />
                      <FieldDescription>
                        Full name of the subject
                      </FieldDescription>
                    </Field>

                    {/* Short Tag Field */}
                    <Field data-invalid={!!errors.short_tag}>
                      <div className="flex items-center justify-between">
                        <FieldLabel htmlFor="short_tag">
                          Short Tag *
                        </FieldLabel>
                        <span className={cn(
                          "text-xs",
                          formData.short_tag.length > 20 ? "text-red-400" : "text-muted-foreground"
                        )}>
                          {formData.short_tag.length}/20
                        </span>
                      </div>
                      <Input
                        id="short_tag"
                        name="short_tag"
                        value={formData.short_tag}
                        onBlur={() => {
                          if (!formData.short_tag.trim()) {
                            setErrors(prev => ({ ...prev, short_tag: "Short tag is required" }));
                          }
                        }}
                        onChange={(e) => handleInputChange("short_tag", e.target.value)}
                        aria-invalid={!!errors.short_tag}
                        placeholder="MATH, PHYSICS, CHEM"
                        maxLength={20}
                        className="font-mono uppercase"
                      />
                      <FieldError errors={errors.short_tag ? [{ message: errors.short_tag }] : []} />
                      <FieldDescription>
                        Used for URLs and references. Uppercase letters, numbers, and underscores only.
                      </FieldDescription>
                    </Field>

                    {/* Code Field */}
                    <Field data-invalid={!!errors.code}>
                      <div className="flex items-center justify-between">
                        <FieldLabel htmlFor="code">
                          Subject Code *
                        </FieldLabel>
                        <span className={cn(
                          "text-xs",
                          formData.code.length > 10 ? "text-red-400" : "text-muted-foreground"
                        )}>
                          {formData.code.length}/10
                        </span>
                      </div>
                      <Input
                        id="code"
                        name="code"
                        value={formData.code}
                        onBlur={() => {
                          if (!formData.code.trim()) {
                            setErrors(prev => ({ ...prev, code: "Subject code is required" }));
                          }
                        }}
                        onChange={(e) => handleInputChange("code", e.target.value)}
                        aria-invalid={!!errors.code}
                        placeholder="4024, 7030, 4027"
                        maxLength={10}
                        className="font-mono uppercase"
                      />
                      <FieldError errors={errors.code ? [{ message: errors.code }] : []} />
                      <FieldDescription>
                        Unique identifier for the subject. LNumbers as they appear on ECZ Exam timetable.
                      </FieldDescription>
                    </Field>

                    <FieldSeparator />

                    {/* Category Field */}
                    <Field data-invalid={!!errors.category}>
                      <FieldLabel htmlFor="category">
                        Category *
                      </FieldLabel>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleInputChange("category", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORY_SUGGESTIONS.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="mt-2">
                        <Input
                          value={formData.category}
                          onChange={(e) => handleInputChange("category", e.target.value)}
                          placeholder="Or type a custom category"
                          list="category-suggestions"
                        />
                        <datalist id="category-suggestions">
                          {CATEGORY_SUGGESTIONS.map((category) => (
                            <option key={category} value={category} />
                          ))}
                        </datalist>
                      </div>
                      <FieldError errors={errors.category ? [{ message: errors.category }] : []} />
                      <FieldDescription>
                        Main category or field of study
                      </FieldDescription>
                    </Field>

                    {/* Level Field */}
                    <Field>
                      <FieldLabel htmlFor="level">
                        Level
                      </FieldLabel>
                      <Select
                        value={formData.level}
                        onValueChange={(value) => handleInputChange("level", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a level (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not_specified">Not specified</SelectItem>
                          {Object.entries(LevelType).map(([key, value]) => (
                            <SelectItem key={key} value={value}>
                              <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4" />
                                {key.charAt(0) + key.slice(1).toLowerCase().replace(/_/g, ' ')}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldDescription>
                        Educational level for this subject
                      </FieldDescription>
                    </Field>

                    {/* Curriculum Type Field */}
                    <Field>
                      <FieldLabel htmlFor="curriculum_type">
                        Curriculum Type
                      </FieldLabel>
                      <Select
                        value={formData.curriculum_type}
                        onValueChange={(value) => handleInputChange("curriculum_type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a curriculum type (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not_specified">Not specified</SelectItem>
                          {Object.entries(CurriculumType).map(([key, value]) => (
                            <SelectItem key={key} value={value}>
                              <div className="flex items-center gap-2">
                                <Bookmark className="h-4 w-4" />
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {key.split('_').map(word => 
                                      word.charAt(0) + word.slice(1).toLowerCase()
                                    ).join(' ')}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {value.toLowerCase().replace(/_/g, ' ')}
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldDescription>
                        Type of curriculum framework used for this subject
                      </FieldDescription>
                    </Field>

                    {/* Form Actions */}
                    <Field>
                      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => router.push("/subjects")}
                          disabled={isSubmitting}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting || completion.requiredCompletion < 100}
                          className={cn(
                            "flex-1",
                            completion.requiredCompletion < 100 
                              ? "bg-muted text-muted-foreground cursor-not-allowed"
                              : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
                          )}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Creating...
                            </>
                          ) : completion.requiredCompletion < 100 ? (
                            "Complete Required Fields"
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Create Subject
                            </>
                          )}
                        </Button>
                      </div>
                    </Field>
                  </FieldGroup>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Information Card */}
            <Card className="border-border bg-gradient-to-br from-red-500/5 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Info className="h-4 w-4 text-red-400" />
                  Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    {
                      icon: Tag,
                      title: "Short Tag",
                      description: "Use uppercase with underscores (e.g., 'ADVANCED_MATH')",
                    },
                    {
                      icon: Hash,
                      title: "Subject Code",
                      description: "Use uppercase letters and numbers (e.g., 'MATH101')",
                    },
                    {
                      icon: Layers,
                      title: "Category",
                      description: "Choose a broad category that groups similar subjects",
                    },
                    {
                      icon: Bookmark,
                      title: "Curriculum Type",
                      description: "Select the educational framework used for this subject",
                    },
                    {
                      icon: AlertCircle,
                      title: "Important",
                      description: "Both Short Tag and Code must be unique across all subjects",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <item.icon className="h-3 w-3 text-red-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Preview Card */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-sm">Subject Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {[
                    { label: "Name", value: formData.name || "Not set", valid: !!formData.name.trim() },
                    { label: "Short Tag", value: formData.short_tag || "---", valid: !!formData.short_tag.trim() && /^[A-Z0-9_]+$/.test(formData.short_tag) },
                    { label: "Code", value: formData.code || "---", valid: !!formData.code.trim() && /^[A-Z0-9]+$/.test(formData.code) },
                    { label: "Category", value: formData.category || "Not set", valid: !!formData.category.trim() },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "h-3 w-3 rounded-full flex items-center justify-center",
                          item.valid 
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        )}>
                          {item.valid ? (
                            <Check className="h-2 w-2" />
                          ) : (
                            <X className="h-2 w-2" />
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">{item.label}</span>
                      </div>
                      <span className={cn(
                        "text-xs font-medium truncate max-w-[150px]",
                        item.label === "Code" && "font-mono bg-red-500/10 text-red-400 px-2 py-0.5 rounded",
                        item.label === "Short Tag" && "font-mono bg-muted px-2 py-0.5 rounded"
                      )}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
                
                {formData.level && formData.level !== "not_specified" && (
                  <Alert className="bg-blue-500/10 border-blue-500/20">
                    <GraduationCap className="h-4 w-4 text-blue-400" />
                    <AlertDescription className="text-xs">
                      This subject is tagged for{" "}
                      <span className="font-medium">
                        {formData.level.toLowerCase().replace('_', ' ')}
                      </span>{" "}
                      level
                    </AlertDescription>
                  </Alert>
                )}
                
                {formData.curriculum_type && formData.curriculum_type !== "not_specified" && (
                  <Alert className="bg-green-500/10 border-green-500/20">
                    <Bookmark className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-xs">
                      Curriculum type:{" "}
                      <span className="font-medium">
                        {Object.entries(CurriculumType).find(([_, value]) => 
                          value === formData.curriculum_type
                        )?.[0].split('_').map(word => 
                          word.charAt(0) + word.slice(1).toLowerCase()
                        ).join(' ')}
                      </span>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Field Requirements Card */}
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Field Requirements</CardTitle>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs",
                      completion.requiredCompletion === 100 
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    )}
                  >
                    {completion.requiredCompletion}% Complete
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress Bars */}
                  <div className="space-y-3">
                    {completion.fields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "h-4 w-4 rounded-full flex items-center justify-center",
                              field.isValid 
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                            )}>
                              {field.isValid ? (
                                <Check className="h-2 w-2" />
                              ) : (
                                <X className="h-2 w-2" />
                              )}
                            </div>
                            <span className={cn(
                              "text-xs",
                              field.isValid ? "text-foreground" : "text-muted-foreground"
                            )}>
                              {field.label}
                            </span>
                            {field.required && (
                              <Badge variant="outline" className="h-4 px-1 text-[10px]">
                                Required
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {field.key === 'name' && (
                              <span className={cn(
                                "text-xs",
                                formData.name.length > 100 ? "text-red-400" : 
                                formData.name.length > 0 ? "text-green-400" : "text-muted-foreground"
                              )}>
                                {formData.name.length}/100
                              </span>
                            )}
                            {field.key === 'short_tag' && (
                              <span className={cn(
                                "text-xs",
                                formData.short_tag.length > 20 ? "text-red-400" : 
                                formData.short_tag.length > 0 ? "text-green-400" : "text-muted-foreground"
                              )}>
                                {formData.short_tag.length}/20
                              </span>
                            )}
                            {field.key === 'code' && (
                              <span className={cn(
                                "text-xs",
                                formData.code.length > 10 ? "text-red-400" : 
                                formData.code.length > 0 ? "text-green-400" : "text-muted-foreground"
                              )}>
                                {formData.code.length}/10
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Progress bar for character-limited fields */}
                        {(field.key === 'name' || field.key === 'short_tag' || field.key === 'code') && (
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-300",
                                field.key === 'name' && formData.name.length > 100 ? "bg-red-400" :
                                field.key === 'short_tag' && formData.short_tag.length > 20 ? "bg-red-400" :
                                field.key === 'code' && formData.code.length > 10 ? "bg-red-400" :
                                field.isValid ? "bg-green-400" : "bg-blue-400"
                              )}
                              style={{
                                width: field.key === 'name' 
                                  ? `${Math.min((formData.name.length / 100) * 100, 100)}%`
                                  : field.key === 'short_tag'
                                    ? `${Math.min((formData.short_tag.length / 20) * 100, 100)}%`
                                    : field.key === 'code'
                                      ? `${Math.min((formData.code.length / 10) * 100, 100)}%`
                                      : field.isValid ? '100%' : '0%'
                              }}
                            />
                          </div>
                        )}
                        
                        {/* Validation hints */}
                        {!field.isValid && (
                          <div className="text-xs text-muted-foreground pl-6">
                            {field.key === 'name' && (
                              <span>Enter a subject name (max 100 characters)</span>
                            )}
                            {field.key === 'short_tag' && (
                              <span>Uppercase letters, numbers, underscores only (max 20)</span>
                            )}
                            {field.key === 'code' && (
                              <span>Uppercase letters and numbers only (max 10)</span>
                            )}
                            {field.key === 'category' && (
                              <span>Select or enter a category</span>
                            )}
                            {field.key === 'level' && (
                              <span>Optional: Select an educational level</span>
                            )}
                            {field.key === 'curriculum_type' && (
                              <span>Optional: Select a curriculum type</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Overall Completion */}
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Required Fields</span>
                      <span className="text-xs font-medium">
                        {completion.fields.filter(f => f.required && f.isValid).length}/
                        {completion.fields.filter(f => f.required).length} completed
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-400 rounded-full transition-all duration-300"
                        style={{ width: `${completion.requiredCompletion}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}