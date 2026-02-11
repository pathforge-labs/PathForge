/**
 * PathForge Shared Types — API Utilities
 * ========================================
 */

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  detail: string;
  status_code: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface HealthResponse {
  status: string;
  database: string;
  app: string;
  version: string;
}
