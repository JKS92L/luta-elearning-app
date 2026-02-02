// src/lib/utils/subject-utils.ts
// Helper function to format curriculum type display
export const formatCurriculumType = (curriculumType?: string) => {
  if (!curriculumType) return null;
  
  const displayNames: Record<string, string> = {
    "COMPETENCE_BASED_OUTCOME": "Competence Based Outcome",
    "OBJECTIVE_BASED_OUTCOME": "Objective Based Outcome",
  };
  
  return displayNames[curriculumType] || curriculumType;
};

// Helper function to get curriculum type badge color
export const getCurriculumTypeBadgeColor = (curriculumType?: string) => {
  if (!curriculumType) return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  
  const colors: Record<string, string> = {
    "COMPETENCE_BASED_OUTCOME": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "OBJECTIVE_BASED_OUTCOME": "bg-green-500/10 text-green-400 border-green-500/20",
  };
  
  return colors[curriculumType] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
};

// Helper function to get level display name
export const getLevelDisplayName = (level?: string) => {
  if (!level) return null;
  
  const displayNames: Record<string, string> = {
    "PRIMARY": "Primary",
    "JUNIOR": "Junior",
    "SENIOR": "Senior", 
    "COLLEGE": "College",
    "SKILLS": "Skills",
  };
  
  return displayNames[level] || level;
};