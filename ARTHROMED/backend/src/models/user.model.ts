export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  failedLoginAttempts?: number;
  lockUntil?: number | null; // Timestamp (ms) until which user is locked
  isLocked?: boolean;
}

export interface UserPublicDto {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  failedLoginAttempts: number;
  isLocked: boolean;
  lockUntil: string | null;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
  };
}
