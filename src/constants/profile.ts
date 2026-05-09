export const RELATION_OPTIONS = [
  "father",
  "mother",
  "brother",
  "sister",
  "uncle",
  "aunt",
  "guardian",
] as const;

export const EDUCATION_VARIETY_OPTIONS = [
  "SSC",
  "HSC",
  "Diploma",
  "Bachelor",
  "Masters",
  "Engineering",
  "Medical",
  "PhD",
  "Other",
] as const;

/** Maps each education type to the correct institution field label */
export const EDUCATION_INSTITUTION_LABEL: Record<string, string> = {
  HSC: "College Name",
  Bachelor: "University Name",
  Masters: "University Name",
  Engineering: "University Name",
  Medical: "University Name",
  PhD: "University Name",
  SSC: "Institution Name",
  Diploma: "Institution Name",
  Other: "Institution Name",
};

/** Returns which API data source to use for institution lookup */
export const EDUCATION_USES_UNIVERSITY_API = new Set([
  "Bachelor",
  "Masters",
  "Engineering",
  "Medical",
  "PhD",
]);

export const FAITH_OPTIONS = [
  "Islam",
  "Hinduism",
  "Buddhism",
  "Christianity",
  "Other",
] as const;

export const PRACTICE_LEVEL_OPTIONS = [
  "Practicing",
  "Regular",
  "Occasional",
  "Not Practicing",
] as const;

export const PERSONALITY_OPTIONS = [
  "Caring Soul",
  "Balanced Thinker",
  "Ambitious Mind",
] as const;

export const HABIT_OPTIONS = [
  "Reading Books",
  "Traveling",
  "Cooking",
  "Sports",
  "Gym/Fitness",
  "Watching Movies",
  "Listening to Music",
  "Photography",
  "Gardening",
  "Gaming",
  "Writing",
  "Art & Craft",
  "Social Work",
  "Entrepreneurship",
  "Technology",
  "others",
] as const;

export const ECONOMICAL_STATUS_OPTIONS = [
  "Low",
  "Medium",
  "High",
  "Upper Middle Class",
  "Middle Class",
] as const;

export const GENDER_OPTIONS = ["male", "female"] as const;

export const MARITAL_STATUS_OPTIONS = [
  "Single",
  "Divorced",
  "Widowed",
] as const;

export const SKIN_TONE_OPTIONS = [
  "Fair",
  "Medium",
  "Olive",
  "Tan",
  "Dark",
] as const;

export const DREAM_PARTNER_HABIT_OPTIONS = [
  "Reading Books",
  "Traveling",
  "Cooking",
  "Sports",
  "Music",
  "Photography",
  "Gaming",
] as const;
