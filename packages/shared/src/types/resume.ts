/**
 * PathForge Shared Types — Resume Domain
 * ========================================
 */

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  raw_text: string | null;
  structured_data: Record<string, unknown> | null;
  version: number;
  file_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  resume_id: string;
  name: string;
  category: string | null;
  proficiency_level: string | null;
  years_experience: number | null;
  verified: boolean;
}
