/**
 * PathForge Shared Types — Job Domain
 * =====================================
 */

export interface JobListing {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string | null;
  work_type: string | null;
  salary_info: string | null;
  source_url: string | null;
  source_platform: string | null;
  structured_data: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface MatchResult {
  id: string;
  user_id: string;
  job_listing_id: string;
  overall_score: number;
  explanation: string | null;
  dimensional_scores: Record<string, number> | null;
  is_dismissed: boolean;
  created_at: string;
}
