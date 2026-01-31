// src/app/subjects/create/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LevelType } from "@/lib/db/schema";
import { useAuth } from "./../../../providers/auth-provider";

// Define allowed roles
const ALLOWED_ROLES = [
  "SYSTEM_ADMIN",
  "SYSTEM_SUPER_ADMIN",
  "SYSTEM_DEVELOPER",
  "TEACHER",
  "LECTURER",
  "CONTENT_CREATOR",
];

export default function CreateSubjectPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    short_tag: "",
    code: "",
    description: "",
    category: "",
    level: "" as keyof typeof LevelType | "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check authorization
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
        return;
      }
      
      if (!user.role || !ALLOWED_ROLES.includes(user.role)) {
        router.push("/subjects");
        return;
      }
    }
  }, [user, isLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Auto-generate short_tag from name if name changes and short_tag is empty
    if (name === "name" && !formData.short_tag) {
      const generatedShortTag = value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // Remove special characters
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .substring(0, 20); // Limit length
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        short_tag: generatedShortTag
      }));
      return;
    }
    
    // Auto-generate code from short_tag if short_tag changes and code is empty
    if (name === "short_tag" && !formData.code) {
      const generatedCode = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: value,
        code: generatedCode
      }));
      return;
    }
    
    // For code input, auto-uppercase
    if (name === "code") {
      setFormData(prev => ({
        ...prev,
        code: value.toUpperCase().replace(/[^A-Z0-9]/g, '')
      }));
      return;
    }
    
    // For short_tag input, ensure lowercase with underscores
    if (name === "short_tag") {
      setFormData(prev => ({
        ...prev,
        short_tag: value.toLowerCase().replace(/[^a-z0-9_]/g, '')
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.name.trim()) errors.push("Name is required");
    if (!formData.short_tag.trim()) errors.push("Short tag is required");
    if (!formData.code.trim()) errors.push("Code is required");
    if (!formData.category.trim()) errors.push("Category is required");
    
    if (formData.short_tag && !/^[a-z0-9_]+$/.test(formData.short_tag)) {
      errors.push("Short tag can only contain lowercase letters, numbers, and underscores");
    }
    
    if (formData.code && !/^[A-Z0-9]+$/.test(formData.code)) {
      errors.push("Code can only contain uppercase letters and numbers");
    }
    
    if (formData.short_tag.length > 20) {
      errors.push("Short tag must be 20 characters or less");
    }
    
    if (formData.code.length > 10) {
      errors.push("Code must be 10 characters or less");
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(". "));
      return;
    }
    
    setSubmitting(true);

    try {
      const response = await fetch("/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || data.details || "Failed to create subject");
      }

      const newSubject = await response.json();
      
      // Show success message
      setSuccess(`Subject "${newSubject.name}" created successfully!`);
      
      // Reset form
      setFormData({
        name: "",
        short_tag: "",
        code: "",
        description: "",
        category: "",
        level: "" as keyof typeof LevelType | "",
      });
      
      // Redirect after delay
      setTimeout(() => {
        router.push("/subjects");
        router.refresh();
      }, 1500);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !user.role || !ALLOWED_ROLES.includes(user.role)) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create New Subject</h1>
            <p className="text-gray-600 mt-2">
              Add a new subject to the system. All fields marked with * are required.
            </p>
          </div>
          
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="e.g., Mathematics, Physics, Chemistry"
                maxLength={100}
              />
              <p className="mt-1 text-sm text-gray-500">
                Full name of the subject
              </p>
            </div>

            {/* Short Tag Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Short Tag *
                </label>
                <span className="text-xs text-gray-500">
                  {formData.short_tag.length}/20
                </span>
              </div>
              <input
                type="text"
                name="short_tag"
                required
                value={formData.short_tag}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono"
                placeholder="e.g., math, physics, chem"
                maxLength={20}
              />
              <p className="mt-1 text-sm text-gray-500">
                Used for URLs and references. Lowercase letters, numbers, and underscores only.
              </p>
            </div>

            {/* Code Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Subject Code *
                </label>
                <span className="text-xs text-gray-500">
                  {formData.code.length}/10
                </span>
              </div>
              <input
                type="text"
                name="code"
                required
                value={formData.code}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono uppercase"
                placeholder="e.g., MATH101, PHY201"
                maxLength={10}
              />
              <p className="mt-1 text-sm text-gray-500">
                Unique identifier for the subject. Uppercase letters and numbers only.
              </p>
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Describe the subject content, objectives, and key topics..."
                maxLength={500}
              />
              <p className="mt-1 text-sm text-gray-500">
                Optional detailed description of the subject
              </p>
            </div>

            {/* Category Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <input
                type="text"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="e.g., Sciences, Humanities, Languages, Arts"
                list="category-suggestions"
              />
              <datalist id="category-suggestions">
                <option value="Sciences" />
                <option value="Mathematics" />
                <option value="Humanities" />
                <option value="Languages" />
                <option value="Arts" />
                <option value="Technology" />
                <option value="Business" />
                <option value="Social Sciences" />
                <option value="Health Sciences" />
                <option value="Vocational" />
              </datalist>
              <p className="mt-1 text-sm text-gray-500">
                Main category or field of study
              </p>
            </div>

            {/* Level Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select a level (optional)</option>
                {Object.entries(LevelType).map(([key, value]) => (
                  <option key={key} value={key}>
                    {key.charAt(0) + key.slice(1).toLowerCase().replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Educational level for this subject
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push("/subjects")}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow"
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  "Create Subject"
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Information Card */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Tips for creating subjects:</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Short Tag:</strong> Use lowercase with underscores (e.g., "advanced_math")</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Code:</strong> Use uppercase letters and numbers (e.g., "MATH101")</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Category:</strong> Choose a broad category that groups similar subjects</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Both <strong>Short Tag</strong> and <strong>Code</strong> must be unique across all subjects</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}