import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-ambient-circle"></div>

      <div class="auth-card-container">
        <div class="auth-card">
          <!-- Header with Medora Brand Logo -->
          <div class="auth-header text-center">
            <a routerLink="/" class="auth-brand" title="ArthroMed - Healthcare for better life !">
              <img
                src="/Breg/Logo.png"
                alt="ArthroMed - Healthcare for better life !"
                class="auth-brand-logo-img"
              />
            </a>
            <span class="auth-eyebrow">Connect with Us</span>
            <h1 class="auth-title">Welcome Back</h1>
            <p class="auth-subtitle">Connect with us to access certified orthopedic bracing, clinical consultations, and order status.</p>
          </div>

          <!-- 10-Minute Lockout Banner with Live Countdown -->
          @if (isAccountLocked()) {
            <div class="lockout-banner">
              <div class="lockout-header">
                <div class="lockout-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <div>
                  <h4 class="lockout-title">Account Temporarily Locked</h4>
                  <p class="lockout-sub">3 consecutive incorrect password attempts detected. Security cooldown active.</p>
                </div>
              </div>

              <div class="timer-display-box">
                <span class="timer-label">Cooldown Remaining:</span>
                <span class="timer-countdown">{{ formattedRemainingTime() }}</span>
              </div>
              <p class="lockout-footer-note">Please wait until the countdown ends, or contact clinic administration.</p>
            </div>
          }

          <!-- Normal / Attempt Warning Error Banner -->
          @if (errorMessage() && !isAccountLocked()) {
            <div class="auth-alert" [class.warning]="attemptsRemaining() !== null && attemptsRemaining()! > 0" [class.error]="attemptsRemaining() === null">
              <div class="alert-content">
                <span class="alert-text">{{ errorMessage() }}</span>
                @if (attemptsRemaining() !== null) {
                  <span class="attempts-warning-badge">
                    {{ attemptsRemaining() }} attempt{{ attemptsRemaining() === 1 ? '' : 's' }} left before 10m lock
                  </span>
                }
              </div>
            </div>
          }

          <!-- Clinical Login Form (Google SSO Removed as requested) -->
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
            <!-- Email Input -->
            <div class="form-group">
              <label class="form-label" for="email">Email Address</label>
              <div class="input-icon-wrapper">
                <svg class="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  id="email"
                  type="email"
                  formControlName="email"
                  class="form-control with-icon"
                  placeholder="name@clinic.com"
                  autocomplete="email"
                  [disabled]="isAccountLocked()"
                />
              </div>
              @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                <span class="field-error">Please enter a valid email address.</span>
              }
            </div>

            <!-- Password Input with Show/Hide Toggle -->
            <div class="form-group">
              <div class="label-with-link">
                <label class="form-label" for="password">Password</label>
                <a href="javascript:void(0)" class="forgot-link">Forgot password?</a>
              </div>
              <div class="input-icon-wrapper">
                <svg class="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  id="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  class="form-control with-icon with-eye"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                  [disabled]="isAccountLocked()"
                />
                <button
                  type="button"
                  class="eye-toggle-btn"
                  (click)="togglePasswordVisibility()"
                  tabindex="-1"
                  title="Toggle password visibility"
                >
                  @if (showPassword()) {
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  } @else {
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  }
                </button>
              </div>
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <span class="field-error">Password is required.</span>
              }
            </div>

            <!-- Submit Button (Forest Green Pill matching reference) -->
            <button
              type="submit"
              class="btn-auth-submit"
              [disabled]="loginForm.invalid || isLoading() || isAccountLocked()"
            >
              @if (isLoading()) {
                <span>Verifying Credentials...</span>
              } @else if (isAccountLocked()) {
                <span>Locked (Wait {{ formattedRemainingTime() }})</span>
              } @else {
                <span>Sign In to Account &rarr;</span>
              }
            </button>
          </form>

          <!-- Demo Quick Fill Box -->
          <div class="demo-box">
            <span class="demo-label">Instant Demo Credentials:</span>
            <button type="button" class="btn-demo-fill" (click)="fillDemoCustomer()" [disabled]="isAccountLocked()">
              Quick Fill: <strong>customer&#64;arthromed.com</strong>
            </button>
          </div>

          <!-- Footer Switch to Signup -->
          <div class="auth-card-footer text-center">
            <p class="signup-prompt">
              New patient or clinic?
              <a routerLink="/signup" class="auth-toggle-link">Create Account</a>
            </p>
            <p class="admin-portal-link-row">
              Hospital administrator or clinical governance?
              <a routerLink="/admin/login" class="admin-link">Access Admin Portal &rarr;</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: calc(100vh - 76px);
      background-color: #f8faf9;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3.5rem 1.5rem;
      position: relative;
      overflow: hidden;
    }

    .auth-ambient-circle {
      position: absolute;
      top: -15%;
      right: 15%;
      width: 550px;
      height: 550px;
      background: radial-gradient(circle, rgba(18, 56, 46, 0.05) 0%, rgba(220, 252, 231, 0.08) 50%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }

    .auth-card-container {
      width: 100%;
      max-width: 470px;
      position: relative;
      z-index: 2;
    }

    /* Pristine Crisp White Card */
    .auth-card {
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.07);
      border-radius: 26px;
      padding: 2.75rem 2.25rem;
      box-shadow: 
        0 20px 45px -10px rgba(18, 56, 46, 0.09),
        0 4px 12px rgba(0, 0, 0, 0.03);
      color: #0f172a;
    }

    @media (max-width: 540px) {
      .auth-card {
        padding: 2rem 1.5rem;
        border-radius: 20px;
      }
    }

    .text-center {
      text-align: center;
    }

    /* Medora Style Brand Logo */
    .auth-brand {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
      text-decoration: none;
    }

    .auth-brand-logo-img {
      height: 48px;
      max-height: 52px;
      width: auto;
      object-fit: contain;
      display: block;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .auth-brand:hover .auth-brand-logo-img {
      transform: scale(1.03);
    }

    .auth-eyebrow {
      display: inline-block;
      font-size: 0.8rem;
      font-weight: 700;
      color: #15803d;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 0.35rem;
    }

    .auth-title {
      font-size: 1.65rem;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.025em;
      line-height: 1.2;
      margin-bottom: 0.5rem;
    }

    .auth-subtitle {
      font-size: 0.88rem;
      color: #64748b;
      line-height: 1.55;
      margin-bottom: 2rem;
    }

    /* Lockout Banner Styles */
    .lockout-banner {
      background: #fef2f2;
      border: 1.5px solid #fecaca;
      border-radius: 14px;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .lockout-header {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      margin-bottom: 0.85rem;
    }

    .lockout-icon {
      color: #dc2626;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .lockout-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #991b1b;
      margin-bottom: 0.2rem;
    }

    .lockout-sub {
      font-size: 0.78rem;
      color: #b91c1c;
      line-height: 1.4;
    }

    .timer-display-box {
      background: #ffffff;
      border: 1px solid #fca5a5;
      border-radius: 8px;
      padding: 0.6rem 0.95rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.6rem;
    }

    .timer-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #7f1d1d;
    }

    .timer-countdown {
      font-size: 1.15rem;
      font-weight: 800;
      color: #dc2626;
      font-family: monospace;
      letter-spacing: 0.05em;
    }

    .lockout-footer-note {
      font-size: 0.72rem;
      color: #991b1b;
      font-style: italic;
    }

    /* Alert Banner */
    .auth-alert {
      padding: 0.85rem 1rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
      font-size: 0.85rem;
      font-weight: 500;
      display: flex;
      align-items: center;
    }

    .auth-alert.error {
      background-color: #fef2f2;
      border: 1px solid #fecaca;
      color: #b91c1c;
    }

    .auth-alert.warning {
      background-color: #fffbeb;
      border: 1px solid #fde68a;
      color: #92400e;
    }

    .alert-content {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      width: 100%;
    }

    .attempts-warning-badge {
      font-size: 0.75rem;
      font-weight: 700;
      color: #b45309;
      background: rgba(245, 158, 11, 0.15);
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
      width: fit-content;
    }

    /* Form Fields */
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-label {
      font-size: 0.86rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.45rem;
    }

    .label-with-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .forgot-link {
      font-size: 0.8rem;
      font-weight: 600;
      color: #12382e;
      text-decoration: none;
      transition: color 0.2s;
    }

    .forgot-link:hover {
      text-decoration: underline;
    }

    .input-icon-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .field-icon {
      position: absolute;
      left: 1rem;
      color: #94a3b8;
      pointer-events: none;
      transition: color 0.2s;
    }

    .form-control.with-icon {
      width: 100%;
      padding: 0.85rem 1rem 0.85rem 2.85rem;
      border: 1.5px solid #cbd5e1;
      border-radius: 12px;
      font-size: 0.95rem;
      color: #0f172a;
      background: #ffffff;
      outline: none;
      transition: all 0.2s ease;
    }

    .form-control.with-eye {
      padding-right: 3rem;
    }

    .form-control.with-icon:focus {
      border-color: #12382e;
      box-shadow: 0 0 0 3px rgba(18, 56, 46, 0.12);
    }

    .form-control.with-icon:focus + .field-icon,
    .input-icon-wrapper:focus-within .field-icon {
      color: #12382e;
    }

    .eye-toggle-btn {
      position: absolute;
      right: 0.85rem;
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 0.25rem;
      transition: color 0.2s;
    }

    .eye-toggle-btn:hover {
      color: #0f172a;
    }

    .field-error {
      font-size: 0.78rem;
      color: #dc2626;
      margin-top: 0.35rem;
      font-weight: 500;
    }

    /* Submit Button */
    .btn-auth-submit {
      width: 100%;
      background-color: #12382e;
      color: #ffffff;
      padding: 0.95rem 1.5rem;
      border-radius: 9999px;
      font-size: 1rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(18, 56, 46, 0.2);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      margin-top: 0.5rem;
    }

    .btn-auth-submit:hover:not(:disabled) {
      background-color: #0b241d;
      transform: translateY(-1.5px);
      box-shadow: 0 8px 22px rgba(18, 56, 46, 0.28);
    }

    .btn-auth-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    /* Demo Quick Fill Box */
    .demo-box {
      margin-top: 1.5rem;
      padding: 0.85rem 1rem;
      background: #f1f5f9;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .demo-label {
      font-size: 0.78rem;
      color: #64748b;
      font-weight: 600;
    }

    .btn-demo-fill {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      padding: 0.35rem 0.75rem;
      border-radius: 8px;
      font-size: 0.78rem;
      color: #0f172a;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn-demo-fill:hover:not(:disabled) {
      border-color: #12382e;
      color: #12382e;
      background: #eaf3ec;
    }

    /* Footer Links */
    .auth-card-footer {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #f1f5f9;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }

    .signup-prompt {
      font-size: 0.9rem;
      color: #64748b;
    }

    .auth-toggle-link {
      color: #12382e;
      font-weight: 700;
      text-decoration: none;
      margin-left: 0.25rem;
    }

    .auth-toggle-link:hover {
      text-decoration: underline;
    }

    .admin-portal-link-row {
      font-size: 0.8rem;
      color: #94a3b8;
    }

    .admin-link {
      color: #12382e;
      font-weight: 600;
      text-decoration: none;
      margin-left: 0.25rem;
    }

    .admin-link:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

  // Lockout & attempts management
  isAccountLocked = signal(false);
  lockoutRemainingSeconds = signal(0);
  attemptsRemaining = signal<number | null>(null);
  private countdownInterval: any = null;

  returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/products';
  }

  ngOnInit(): void {
    // Check if there's any active lockout in localStorage
    const savedLock = localStorage.getItem('arthromed_login_lockout');
    if (savedLock) {
      const lockUntil = Number(savedLock);
      const now = Date.now();
      if (lockUntil > now) {
        this.startLockoutCountdown(Math.ceil((lockUntil - now) / 1000));
      } else {
        localStorage.removeItem('arthromed_login_lockout');
      }
    }
  }

  ngOnDestroy(): void {
    this.clearCountdown();
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  fillDemoCustomer(): void {
    this.loginForm.patchValue({
      email: 'customer@arthromed.com',
      password: 'customer123'
    });
  }

  formattedRemainingTime(): string {
    const total = this.lockoutRemainingSeconds();
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  private startLockoutCountdown(seconds: number): void {
    this.clearCountdown();
    this.isAccountLocked.set(true);
    this.lockoutRemainingSeconds.set(seconds);

    // Save to localStorage so refreshing keeps countdown
    localStorage.setItem('arthromed_login_lockout', String(Date.now() + seconds * 1000));

    this.countdownInterval = setInterval(() => {
      const cur = this.lockoutRemainingSeconds() - 1;
      if (cur <= 0) {
        this.clearCountdown();
        this.isAccountLocked.set(false);
        this.lockoutRemainingSeconds.set(0);
        this.attemptsRemaining.set(null);
        this.errorMessage.set('');
        localStorage.removeItem('arthromed_login_lockout');
      } else {
        this.lockoutRemainingSeconds.set(cur);
      }
    }, 1000);
  }

  private clearCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  onSubmit(): void {
    if (this.isAccountLocked()) return;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
      requiredRole: 'customer'
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        localStorage.removeItem('arthromed_login_lockout');
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err: any) => {
        this.isLoading.set(false);

        // Account is locked (3 consecutive failed attempts)
        if (err.isLocked || err.remainingSeconds) {
          const secs = err.remainingSeconds || 600;
          this.startLockoutCountdown(secs);
          this.errorMessage.set(err.error || 'Security Lockout: 3 failed attempts. Please wait 10 minutes.');
          return;
        }

        // Remaining attempts warning
        if (err.attemptsRemaining !== undefined) {
          this.attemptsRemaining.set(err.attemptsRemaining);
          this.errorMessage.set(err.error);
          return;
        }

        this.attemptsRemaining.set(null);
        this.errorMessage.set(err.error || err.message || 'Invalid email or password.');
      }
    });
  }
}
