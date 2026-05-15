// ============================================
// InternTrack — Core Type Definitions
// Maps directly to the PostgreSQL schema
// ============================================

/** User roles enforced at DB level via CHECK constraint */
export type UserRole = "student" | "company" | "admin";

/** Application status pipeline — matches Kanban columns */
export type ApplicationStatus =
  | "applied"
  | "shortlisted"
  | "interview"
  | "offered"
  | "rejected";

/** Deadline badge computed from SQL CASE WHEN logic */
export type DeadlineBadge = "closing_today" | "closing_soon" | "open";

// ============================================
// Database Row Types
// ============================================

export interface User {
  id: number;
  email: string;
  password: string;
  role: UserRole;
  is_banned: boolean;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: number;
  user_id: number;
  full_name: string;
  university: string | null;
  semester: number | null;
  skills: string[];
  cv_url: string | null;
  bio: string | null;
  profile_score: number;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  website: string | null;
  city: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Listing {
  id: number;
  company_id: number;
  title: string;
  description: string | null;
  city: string | null;
  stipend: number | null;
  skills: string[];
  deadline: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: number;
  student_id: number;
  listing_id: number;
  status: ApplicationStatus;
  applied_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  student_id: number;
  company_id: number;
  culture_rating: number;
  learning_rating: number;
  stipend_rating: number;
  comment: string | null;
  created_at: string;
}

// ============================================
// Extended / View Types (for JOINed queries)
// ============================================

/** Listing with computed deadline badge */
export interface ListingWithBadge extends Listing {
  deadline_badge: DeadlineBadge;
  company_name?: string;
}

/** Application with related listing & company info */
export interface ApplicationWithDetails extends Application {
  listing_title: string;
  company_name: string;
}

/** Company stats from aggregated reviews */
export interface CompanyRatingStats {
  avg_culture: number;
  avg_learning: number;
  avg_stipend: number;
  total_reviews: number;
}

/** Dashboard stat card data */
export interface DashboardStat {
  label: string;
  value: number;
  trend?: number;
  color: "primary" | "success" | "warning" | "danger";
}

// ============================================
// Server Action Response Types
// ============================================

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================
// Session / Auth Types
// ============================================

export interface SessionUser {
  id: number;
  email: string;
  role: UserRole;
}
