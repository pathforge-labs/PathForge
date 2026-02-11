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
