/* ── Shared types ── */

export interface ToastData {
  message: string;
  type: "success" | "error";
}

/* ── Profile Types ── */

export interface ProfileAddress {
  divisionId: string | { _id: string; name: string };
  districtId: string | { _id: string; name: string };
  thanaId?: string | { _id: string; name: string };
  details?: string;
}

export interface ProfileEducation {
  graduation?: {
    universityId?: string | { _id: string; name: string };
    variety?: string;
    department?: string;
    institution?: string;
    passingYear?: string;
    collegeName?: string;
  };
}

export interface ProfileReligion {
  faith?: string;
  sectOrCaste?: string;
  practiceLevel?: string;
  dailyLifeStyleSummary?: string;
  religiousLifestyleDetails?: string;
}

export interface MissingField {
  key: string;
  label: string;
}

export interface Profile {
  isLiked: boolean;
  likeCount: number;
  _id: string;
  userId?: { _id: string; name: string; phone?: string; gender: string };
  user?: { _id: string; name: string; gender: string };
  relation?: string;
  fatherOccupation?: string;
  motherOccupation?: string;
  address?: ProfileAddress;
  education?: ProfileEducation;
  religion?: ProfileReligion;
  personality?: string;
  habits?: string[];
  birthDate?: string;
  economicalStatus?: string;
  salaryRange?: string;
  profession?: string;
  gender?: string;
  aboutMe?: string;
  height?: string;
  weight?: string;
  skinTone?: string;
  maritalStatus?: string;
  completionPercentage?: number;
  completionLabel?: string;
  missingFields?: MissingField[];
  university?: { name: string }[];
  division?: { name: string }[];
  district?: { name: string }[];
  thana?: { name: string }[];
}

export interface ProfileListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GeoItem {
  _id: string;
  name: string;
}

export interface ProfileFilters {
  search?: string;
  gender?: string;
  minAge?: number;
  maxAge?: number;
  division?: string;
  district?: string;
  thana?: string;
  university?: string;
  faith?: string;
  practiceLevel?: string;
  educationVariety?: string;
  personality?: string;
  habits?: string[];
  page?: number;
  limit?: number;
  sort?: string;
}


export interface DreamPartnerPreference {
  _id: string;
  userId: string;
  practiceLevel: string;
  economicalStatus: string;
  habits: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type DreamPartnerMatch = Profile; // matches are Profile objects from backend