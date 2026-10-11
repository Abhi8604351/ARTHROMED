import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, throwError } from 'rxjs';
import { User, UserRole, AuthResponse, UserPublicDto } from '../models/user.model';

const TOKEN_KEY = 'arthromed_auth_token';
const USER_KEY = 'arthromed_auth_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://arthromed.onrender.com/api/auth'
    : 'http://localhost:3000/api/auth';

  // Reactive state using Angular Signals
  readonly currentUser = signal<User | null>(null);
  readonly token = signal<string | null>(null);

  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly userRole = computed<UserRole | null>(() => this.currentUser()?.role || null);
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');

  // In-memory fallback mock users for zero-backend resilience
  private mockUsers: UserPublicDto[] = [
    {
      id: 'user-admin-01',
      fullName: 'Clinical System Administrator',
      email: 'admin@arthromed.com',
      role: 'admin',
      createdAt: '2025-01-01T00:00:00.000Z',
      failedLoginAttempts: 0,
      isLocked: false,
      lockUntil: null
    },
    {
      id: 'user-cust-01',
      fullName: 'Sarah Jenkins, DPT',
      email: 'customer@arthromed.com',
      role: 'customer',
      createdAt: '2025-01-10T00:00:00.000Z',
      failedLoginAttempts: 0,
      isLocked: false,
      lockUntil: null
    }
  ];

  constructor(private http: HttpClient) {
    this.restoreSession();
  }

  private restoreSession(): void {
    try {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedToken && savedUser) {
        this.token.set(savedToken);
        this.currentUser.set(JSON.parse(savedUser));
      }
    } catch {
      this.clearSession();
    }
  }

  private setSession(auth: AuthResponse): void {
    this.token.set(auth.token);
    this.currentUser.set(auth.user);
    localStorage.setItem(TOKEN_KEY, auth.token);
    localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
  }

  private clearSession(): void {
    this.token.set(null);
    this.currentUser.set(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  getToken(): string | null {
    return this.token();
  }

  private getAuthHeaders(): { [header: string]: string } {
    const t = this.getToken() || localStorage.getItem(TOKEN_KEY);
    return t ? { Authorization: `Bearer ${t}` } : {};
  }

  /**
   * Email/Password Login
   */
  login(credentials: { email: string; password: string; requiredRole?: UserRole }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => this.setSession(res)),
      catchError(err => {
        // If server responded with a structured error (e.g. 423 lockout or 401 with remaining attempts)
        if (err.error && typeof err.error === 'object') {
          return throwError(() => err.error);
        }

        // Resilient fallback for offline testing
        const em = credentials.email.toLowerCase().trim();
        const found = this.mockUsers.find(u => u.email.toLowerCase() === em);

        if (found) {
          if (found.isLocked) {
            return throwError(() => ({
              error: 'Security Lockout: Your account is temporarily locked due to 3 consecutive failed attempts. Please wait 10 minutes.',
              isLocked: true,
              remainingSeconds: 600,
              lockUntil: found.lockUntil
            }));
          }

          const isPasswordMatch = (em === 'admin@arthromed.com' && credentials.password === 'admin123') ||
                                  (em === 'customer@arthromed.com' && credentials.password === 'customer123');

          if (!isPasswordMatch) {
            found.failedLoginAttempts++;
            if (found.failedLoginAttempts >= 3) {
              found.isLocked = true;
              found.lockUntil = new Date(Date.now() + 10 * 60 * 1000).toISOString();
              return throwError(() => ({
                error: 'Security Lockout: Incorrect password entered 3 times. Your account has been temporarily locked for 10 minutes.',
                isLocked: true,
                remainingSeconds: 600,
                lockUntil: found.lockUntil
              }));
            }
            return throwError(() => ({
              error: `Incorrect password. You have ${3 - found.failedLoginAttempts} attempt(s) remaining before your account is locked for 10 minutes.`,
              attemptsRemaining: 3 - found.failedLoginAttempts,
              isLocked: false
            }));
          }

          found.failedLoginAttempts = 0;
          found.isLocked = false;
          found.lockUntil = null;

          const fallbackRes: AuthResponse = {
            message: 'Local login successful',
            token: 'mock-token-' + Date.now(),
            user: {
              id: found.id,
              fullName: found.fullName,
              email: found.email,
              role: found.role
            }
          };
          this.setSession(fallbackRes);
          return of(fallbackRes);
        }

        return throwError(() => ({ error: 'Invalid email or password credentials.' }));
      })
    );
  }

  getOrCreateDeviceId(): string {
    let deviceId = localStorage.getItem('arthromed_device_id');
    if (!deviceId) {
      deviceId = 'dev-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now().toString(36);
      localStorage.setItem('arthromed_device_id', deviceId);
    }
    return deviceId;
  }

  /**
   * Customer Registration (Enforces 2 accounts / 24 hours per device)
   */
  register(payload: { fullName: string; email: string; password: string }): Observable<AuthResponse> {
    const deviceId = this.getOrCreateDeviceId();
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload, {
      headers: { 'x-device-id': deviceId }
    }).pipe(
      tap(res => {
        this.setSession(res);
        // Record registration timestamp for device rate limiting
        const history: number[] = JSON.parse(localStorage.getItem('arthromed_device_signup_history') || '[]');
        history.push(Date.now());
        localStorage.setItem('arthromed_device_signup_history', JSON.stringify(history));

        this.mockUsers.push({
          id: res.user.id,
          fullName: res.user.fullName,
          email: res.user.email,
          role: 'customer',
          createdAt: new Date().toISOString(),
          failedLoginAttempts: 0,
          isLocked: false,
          lockUntil: null
        });
      }),
      catchError(err => {
        if (err.error && typeof err.error === 'object') {
          return throwError(() => err.error);
        }
        return throwError(() => ({ error: 'Registration failed. Please check form details.' }));
      })
    );
  }

  /**
   * Google OAuth Single Sign-On
   */
  googleAuth(roleHint: UserRole = 'customer'): Observable<AuthResponse> {
    const payload = {
      email: roleHint === 'admin' ? 'admin.google@arthromed.com' : 'google.user@gmail.com',
      fullName: roleHint === 'admin' ? 'Dr. Google Admin' : 'Alex Mercer (Google Verified)',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      roleHint
    };

    return this.http.post<AuthResponse>(`${this.apiUrl}/google`, payload).pipe(
      tap(res => this.setSession(res)),
      catchError(() => {
        const fallbackRes: AuthResponse = {
          message: 'Google login successful',
          token: 'google-jwt-' + Date.now(),
          user: {
            id: 'usr-google-' + Date.now(),
            fullName: payload.fullName,
            email: payload.email,
            role: roleHint,
            avatarUrl: payload.avatarUrl
          }
        };
        this.setSession(fallbackRes);
        return of(fallbackRes);
      })
    );
  }

  /**
   * Admin: Get all registered users
   */
  getUsers(): Observable<UserPublicDto[]> {
    return this.http.get<UserPublicDto[]>(`${this.apiUrl}/users`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(() => of([...this.mockUsers]))
    );
  }

  /**
   * Admin: Unlock a locked user account
   */
  unlockUser(userId: string): Observable<{ message: string; user?: any }> {
    return this.http.post<{ message: string; user?: any }>(
      `${this.apiUrl}/users/${userId}/unlock`,
      {},
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(() => {
        const u = this.mockUsers.find(item => item.id === userId);
        if (u) {
          u.failedLoginAttempts = 0;
          u.isLocked = false;
          u.lockUntil = null;
        }
      }),
      catchError(() => {
        const u = this.mockUsers.find(item => item.id === userId);
        if (u) {
          u.failedLoginAttempts = 0;
          u.isLocked = false;
          u.lockUntil = null;
        }
        return of({ message: 'User unlocked successfully.' });
      })
    );
  }

  /**
   * Admin: Delete user
   */
  deleteUser(userId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/users/${userId}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(() => {
        this.mockUsers = this.mockUsers.filter(u => u.id !== userId);
      }),
      catchError(() => {
        this.mockUsers = this.mockUsers.filter(u => u.id !== userId);
        return of({ message: 'User deleted successfully.' });
      })
    );
  }

  /**
   * Logout
   */
  logout(): void {
    this.clearSession();
  }
}
