export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt?: string;
  failedLoginAttempts?: number;
  isLocked?: boolean;
  lockUntil?: string | null;
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
  message: string;
  token: string;
  user: User;
}

export interface LockoutError {
  error: string;
  isLocked: boolean;
  remainingSeconds: number;
  lockUntil: string;
  attemptsRemaining?: number;
}
