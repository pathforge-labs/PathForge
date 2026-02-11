/**
 * PathForge Shared Types — User Domain
 * ======================================
 */

export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_verified: boolean;
  auth_provider: string;
  avatar_url: string | null;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserRegisterPayload {
  email: string;
  password: string;
  full_name: string;
}

export interface UserLoginPayload {
  email: string;
  password: string;
}
