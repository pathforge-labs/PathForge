/**
 * PathForge — API Client
 * =======================
 * Type-safe HTTP client for communicating with the FastAPI backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string,
  ) {
    super(detail);
    this.name = "ApiError";
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) ?? {}),
  };

  // Attach bearer token if available
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("pathforge_access_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ detail: "An error occurred" }));
    throw new ApiError(response.status, body.detail ?? "An error occurred");
  }

  return response.json() as Promise<T>;
}

// ── Auth ────────────────────────────────────────────────────
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_verified: boolean;
  auth_provider: string;
  avatar_url: string | null;
  created_at: string;
}

export const auth = {
  register: (data: { email: string; password: string; full_name: string }) =>
    request<UserResponse>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<AuthTokens>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  refresh: (refreshToken: string) =>
    request<AuthTokens>("/api/v1/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    }),
};

// ── Users ───────────────────────────────────────────────────
export const users = {
  me: () => request<UserResponse>("/api/v1/users/me"),
};

// ── Health ──────────────────────────────────────────────────
export interface HealthResponse {
  status: string;
  database: string;
  app: string;
  version: string;
}

export const health = {
  ready: () => request<HealthResponse>("/api/v1/health/ready"),
};

// ── AI Engine ───────────────────────────────────────────────

// Parse Resume
export interface ParseResumeResponse {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: Array<{ name: string; category?: string; level?: string }>;
  experience: Array<{
    title: string;
    company: string;
    start_date?: string;
    end_date?: string;
    description?: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year?: string;
  }>;
  certifications: Array<{ name: string; issuer?: string; year?: string }>;
  languages: Array<{ name: string; proficiency?: string }>;
}

// Embed Resume
export interface EmbedResumeResponse {
  resume_id: string;
  dimensions: number;
  message: string;
}

// Match Resume
export interface MatchCandidate {
  job_id: string;
  score: number;
  title: string;
  company: string;
}

export interface MatchResponse {
  resume_id: string;
  matches: MatchCandidate[];
  total: number;
}

// Tailor CV
export interface TailorCVResponse {
  tailored_summary: string;
  tailored_skills: string[];
  tailored_experience: string[];
  diffs: Array<{
    field: string;
    original: string;
    modified: string;
    reason: string;
  }>;
  ats_score: number;
  ats_suggestions: string[];
}

// Ingest Jobs
export interface IngestJobsResponse {
  total_fetched: number;
  total_new: number;
  total_duplicates: number;
  providers: Array<{
    provider: string;
    fetched: number;
    new: number;
    duplicates: number;
    errors: number;
  }>;
  embedded: number;
}

export const ai = {
  parseResume: (rawText: string) =>
    request<ParseResumeResponse>("/api/v1/ai/parse-resume", {
      method: "POST",
      body: JSON.stringify({ raw_text: rawText }),
    }),

  embedResume: (resumeId: string) =>
    request<EmbedResumeResponse>(`/api/v1/ai/embed-resume/${resumeId}`, {
      method: "POST",
    }),

  matchResume: (resumeId: string, topK: number = 20) =>
    request<MatchResponse>(`/api/v1/ai/match-resume/${resumeId}`, {
      method: "POST",
      body: JSON.stringify({ top_k: topK }),
    }),

  tailorCV: (resumeId: string, jobId: string) =>
    request<TailorCVResponse>("/api/v1/ai/tailor-cv", {
      method: "POST",
      body: JSON.stringify({ resume_id: resumeId, job_id: jobId }),
    }),

  ingestJobs: (params: {
    keywords: string;
    location?: string;
    country?: string;
    pages?: number;
    results_per_page?: number;
    embed?: boolean;
  }) =>
    request<IngestJobsResponse>("/api/v1/ai/ingest-jobs", {
      method: "POST",
      body: JSON.stringify(params),
    }),
};

// ── Applications ────────────────────────────────────────────

export interface ApplicationResponse {
  id: string;
  job_listing_id: string;
  status: string;
  notes: string | null;
  source_url: string | null;
  created_at: string;
  updated_at: string;
  job_title: string | null;
  job_company: string | null;
}

export interface ApplicationListResponse {
  items: ApplicationResponse[];
  total: number;
  page: number;
  per_page: number;
}

export const applications = {
  create: (jobListingId: string, status?: string, notes?: string) =>
    request<ApplicationResponse>("/api/v1/applications", {
      method: "POST",
      body: JSON.stringify({ job_listing_id: jobListingId, status, notes }),
    }),

  list: (status?: string, page: number = 1, perPage: number = 20) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    params.set("page", String(page));
    params.set("per_page", String(perPage));
    return request<ApplicationListResponse>(
      `/api/v1/applications?${params.toString()}`,
    );
  },

  get: (id: string) =>
    request<ApplicationResponse>(`/api/v1/applications/${id}`),

  updateStatus: (id: string, status: string) =>
    request<ApplicationResponse>(`/api/v1/applications/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  delete: (id: string) =>
    request<void>(`/api/v1/applications/${id}`, { method: "DELETE" }),
};

// ── Blacklist ───────────────────────────────────────────────

export interface BlacklistResponse {
  id: string;
  company_name: string;
  reason: string | null;
  is_current_employer: boolean;
  created_at: string;
}

export interface BlacklistListResponse {
  items: BlacklistResponse[];
  total: number;
}

export const blacklist = {
  add: (companyName: string, reason?: string, isCurrentEmployer?: boolean) =>
    request<BlacklistResponse>("/api/v1/blacklist", {
      method: "POST",
      body: JSON.stringify({
        company_name: companyName,
        reason,
        is_current_employer: isCurrentEmployer ?? false,
      }),
    }),

  list: () => request<BlacklistListResponse>("/api/v1/blacklist"),

  remove: (id: string) =>
    request<void>(`/api/v1/blacklist/${id}`, { method: "DELETE" }),
};
