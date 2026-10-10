import { Component, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

// Custom password validator strictly enforcing:
// 1. Minimum 8 characters
// 2. Contains letter (a-z or A-Z)
// 3. Contains number (0-9)
// 4. Contains symbol (!@#$%^&*...)
function strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const val = control.value || '';
  if (!val) return null;

  const hasLength = val.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(val);
  const hasNumber = /[0-9]/.test(val);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val);

  const isValid = hasLength && hasLetter && hasNumber && hasSpecial;
  if (!isValid) {
    return {
      strongPassword: {
        hasLength,
        hasLetter,
        hasNumber,
        hasSpecial
      }
    };
  }
  return null;
}

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-ambient-circle"></div>

      <div class="auth-card-container">
        <div class="auth-card">
          <!-- Header with Breg / ArthroMed Brand Logo -->
          <div class="auth-header text-center">
            <a routerLink="/" class="auth-brand" title="ArthroMed - Healthcare for better life !">
              <img
                src="/Breg/Logo.png"
                alt="ArthroMed - Healthcare for better life !"
                class="auth-brand-logo-img"
              />
            </a>
            <span class="auth-eyebrow">Connect with Us</span>
            <h1 class="auth-title">Create Account</h1>
            <p class="auth-subtitle">Connect with us to access certified Breg® orthotics, clinical fitting guides, and track shipments.</p>
          </div>

          <!-- Device Rate Limiting Cooldown Banner: Max 2 accounts per device in 24 hours -->
          @if (isDeviceLimitReached()) {
            <div class="device-limit-card">
              <div class="limit-badge-row">
                <div class="limit-icon-wrap">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <div>
                  <h4 class="limit-title">Device Registration Limit Reached</h4>
                  <p class="limit-desc">
                    For system security, each device is restricted to creating a maximum of <strong>2 accounts per 24 hours</strong>. This device has reached the limit.
                  </p>
                </div>
              </div>
              <div class="limit-timer-box">
                <span class="timer-tag">Cooldown Remaining:</span>
                <span class="timer-clock">{{ cooldownRemainingText() }}</span>
              </div>
              <p class="limit-footer">
                Already have an account?
                <a routerLink="/login" class="limit-signin-link">Welcome Back &rarr; Sign In</a>
              </p>
            </div>
          }

          <!-- Alert message if general error occurred -->
          @if (errorMessage() && !isDeviceLimitReached()) {
            <div class="auth-alert error">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <!-- Registration Form -->
          <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="auth-form">
            <!-- Full Name -->
            <div class="form-group">
              <label class="form-label" for="fullName">Full Name / Clinic Name</label>
              <div class="input-icon-wrapper">
                <svg class="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  id="fullName"
                  type="text"
                  formControlName="fullName"
                  class="form-control with-icon"
                  placeholder="Dr. Sarah Khan or Metro Orthopedic Care"
                  autocomplete="name"
                  [disabled]="isDeviceLimitReached()"
                />
              </div>
              @if (signupForm.get('fullName')?.invalid && signupForm.get('fullName')?.touched) {
                <span class="field-error">Full name or clinic title is required (min 2 characters).</span>
              }
            </div>

            <!-- Email Address -->
            <div class="form-group">
              <label class="form-label" for="email">Clinical / Professional Email</label>
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
                  placeholder="doctor@orthoclinic.com"
                  autocomplete="email"
                  [disabled]="isDeviceLimitReached()"
                />
              </div>
              @if (signupForm.get('email')?.invalid && signupForm.get('email')?.touched) {
                <span class="field-error">Please provide a valid email format (e.g., user&#64;domain.com).</span>
              }
            </div>

            <!-- Password with Strict Strength Enforcement -->
            <div class="form-group">
              <label class="form-label" for="password">Create Password</label>
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
                  placeholder="Minimum 8 characters with letters, numbers & symbols"
                  (input)="updatePasswordStrength()"
                  autocomplete="new-password"
                  [disabled]="isDeviceLimitReached()"
                />
                <button
                  type="button"
                  class="eye-toggle-btn"
                  (click)="togglePasswordVisibility()"
                  tabindex="-1"
                  title="Toggle password visibility"
                  [disabled]="isDeviceLimitReached()"
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

              <!-- Password Strength Meter & Required Criteria Checklist -->
              @if (currentPasswordValue().length > 0) {
                <div class="strength-meter-container">
                  <div class="meter-bar-track">
                    <div class="meter-bar-fill" [style.width.%]="strengthPercent()" [ngClass]="strengthClass()"></div>
                  </div>
                  <div class="meter-meta">
                    <span class="meter-text">Strength: <strong>{{ strengthLabel() }}</strong></span>
                  </div>

                  <!-- Real-time Checklist Criteria: 8+ Chars, Letters, Numbers, Symbols -->
                  <div class="strength-checklist">
                    <span class="check-item" [class.valid]="hasLength()">
                      {{ hasLength() ? '✓' : '○' }} 8+ Characters
                    </span>
                    <span class="check-item" [class.valid]="hasLetter()">
                      {{ hasLetter() ? '✓' : '○' }} Letters (A-Z, a-z)
                    </span>
                    <span class="check-item" [class.valid]="hasNumber()">
                      {{ hasNumber() ? '✓' : '○' }} Numbers (0-9)
                    </span>
                    <span class="check-item" [class.valid]="hasSpecial()">
                      {{ hasSpecial() ? '✓' : '○' }} Symbols (!&#64;#$%^&*)
                    </span>
                  </div>
                </div>
              }

              @if (signupForm.get('password')?.invalid && signupForm.get('password')?.touched) {
                <span class="field-error">
                  Password must be at least 8 characters and include letters, numbers, and symbols.
                </span>
              }
            </div>

            <!-- Confirm Password -->
            <div class="form-group">
              <label class="form-label" for="confirmPassword">Confirm Password</label>
              <div class="input-icon-wrapper">
                <svg class="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  id="confirmPassword"
                  [type]="showConfirmPassword() ? 'text' : 'password'"
                  formControlName="confirmPassword"
                  class="form-control with-icon with-eye"
                  placeholder="Re-enter password"
                  autocomplete="new-password"
                  [disabled]="isDeviceLimitReached()"
                />
                <button
                  type="button"
                  class="eye-toggle-btn"
                  (click)="toggleConfirmPasswordVisibility()"
                  tabindex="-1"
                  title="Toggle confirm password visibility"
                  [disabled]="isDeviceLimitReached()"
                >
                  @if (showConfirmPassword()) {
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
              @if (signupForm.errors?.['passwordMismatch'] && signupForm.get('confirmPassword')?.touched) {
                <span class="field-error">Passwords do not match.</span>
              }
            </div>

            <!-- Submit Button (Disabled until requirements met & under 2-account device limit) -->
            <button
              type="submit"
              class="btn-auth-submit"
              [disabled]="signupForm.invalid || isLoading() || isDeviceLimitReached()"
            >
              @if (isDeviceLimitReached()) {
                <span>Device Limit Reached (2 accounts / 24h)</span>
              } @else if (isLoading()) {
                <span>Registering Account...</span>
              } @else {
                <span>Create Account &rarr;</span>
              }
            </button>
          </form>

          <!-- Footer Switch to Sign In / Welcome Back -->
          <div class="auth-card-footer text-center">
            <p class="signin-prompt">
              Already have a clinic or patient account?
              <a routerLink="/login" class="auth-toggle-link">Welcome Back</a>
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
      left: 15%;
      width: 550px;
      height: 550px;
      background: radial-gradient(circle, rgba(18, 56, 46, 0.05) 0%, rgba(220, 252, 231, 0.08) 50%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }

    .auth-card-container {
      width: 100%;
      max-width: 500px;
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

    /* Device Limit Card (2 accounts per 24 hours per device) */
    .device-limit-card {
      background: #fef2f2;
      border: 1.5px solid #fecaca;
      border-radius: 14px;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .limit-badge-row {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      margin-bottom: 0.85rem;
    }

    .limit-icon-wrap {
      color: #dc2626;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .limit-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #991b1b;
      margin-bottom: 0.25rem;
    }

    .limit-desc {
      font-size: 0.8rem;
      color: #b91c1c;
      line-height: 1.45;
      margin: 0;
    }

    .limit-timer-box {
      background: #ffffff;
      border: 1px solid #fca5a5;
      border-radius: 8px;
      padding: 0.6rem 0.95rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }

    .timer-tag {
      font-size: 0.8rem;
      font-weight: 600;
      color: #7f1d1d;
    }

    .timer-clock {
      font-size: 1.15rem;
      font-weight: 800;
      color: #dc2626;
      font-family: monospace;
      letter-spacing: 0.05em;
    }

    .limit-footer {
      font-size: 0.8rem;
      color: #991b1b;
      margin: 0;
    }

    .limit-signin-link {
      color: #12382e;
      font-weight: 700;
      text-decoration: underline;
      margin-left: 0.25rem;
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
      gap: 0.65rem;
    }

    .auth-alert.error {
      background-color: #fef2f2;
      border: 1px solid #fecaca;
      color: #b91c1c;
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

    /* Password Strength Meter */
    .strength-meter-container {
      margin-top: 0.65rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 0.65rem 0.85rem;
    }

    .meter-bar-track {
      height: 4px;
      background: #e2e8f0;
      border-radius: 9999px;
      overflow: hidden;
      margin-bottom: 0.45rem;
    }

    .meter-bar-fill {
      height: 100%;
      transition: width 0.3s ease, background-color 0.3s ease;
    }

    .meter-bar-fill.weak {
      background-color: #ef4444;
    }

    .meter-bar-fill.fair {
      background-color: #f59e0b;
    }

    .meter-bar-fill.good {
      background-color: #3b82f6;
    }

    .meter-bar-fill.strong {
      background-color: #15803d;
    }

    .meter-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.74rem;
      color: #64748b;
      margin-bottom: 0.45rem;
    }

    .strength-checklist {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem 0.75rem;
    }

    .check-item {
      font-size: 0.72rem;
      color: #94a3b8;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }

    .check-item.valid {
      color: #15803d;
      font-weight: 700;
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

    /* Footer Links */
    .auth-card-footer {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #f1f5f9;
    }

    .signin-prompt {
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
  `]
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

  // Device rate limiting: Maximum 2 accounts per 24 hours
  isDeviceLimitReached = signal(false);
  cooldownRemainingText = signal('');
  private cooldownInterval: any = null;

  // Password Strength Signals
  currentPasswordValue = signal('');
  hasLength = signal(false);
  hasLetter = signal(false);
  hasNumber = signal(false);
  hasSpecial = signal(false);

  strengthScore = computed(() => {
    let score = 0;
    if (this.hasLength()) score++;
    if (this.hasLetter()) score++;
    if (this.hasNumber()) score++;
    if (this.hasSpecial()) score++;
    return score;
  });

  strengthPercent = computed(() => {
    return (this.strengthScore() / 4) * 100;
  });

  strengthLabel = computed(() => {
    const s = this.strengthScore();
    if (s <= 1) return 'Very Weak (Needs 8+ chars, letter, number, symbol)';
    if (s === 2) return 'Weak';
    if (s === 3) return 'Good';
    return 'Strong & Compliant';
  });

  strengthClass = computed(() => {
    const s = this.strengthScore();
    if (s <= 1) return 'weak';
    if (s === 2) return 'fair';
    if (s === 3) return 'good';
    return 'strong';
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, strongPasswordValidator]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  ngOnInit(): void {
    this.checkDeviceLimit();
  }

  ngOnDestroy(): void {
    this.clearCooldownTimer();
  }

  /**
   * Evaluates if this device has created 2 accounts in the last 24 hours
   */
  checkDeviceLimit(): void {
    try {
      const rawHistory = localStorage.getItem('arthromed_device_signup_history');
      if (rawHistory) {
        const timestamps: number[] = JSON.parse(rawHistory);
        const now = Date.now();
        const windowMs = 24 * 60 * 60 * 1000; // 24 hours
        const active = timestamps.filter(ts => (now - ts) < windowMs);

        // Clean up expired registrations in localStorage
        localStorage.setItem('arthromed_device_signup_history', JSON.stringify(active));

        if (active.length >= 2) {
          this.isDeviceLimitReached.set(true);
          const oldest = Math.min(...active);
          const remainingMs = windowMs - (now - oldest);
          this.startCooldownTimer(remainingMs);
        } else {
          this.isDeviceLimitReached.set(false);
        }
      }
    } catch (e) {
      console.error('Device limit check failed', e);
    }
  }

  startCooldownTimer(initialRemainingMs: number): void {
    this.clearCooldownTimer();
    let remaining = Math.max(0, initialRemainingMs);
    this.updateCooldownDisplay(remaining);

    this.cooldownInterval = setInterval(() => {
      remaining -= 1000;
      if (remaining <= 0) {
        this.clearCooldownTimer();
        this.isDeviceLimitReached.set(false);
        this.checkDeviceLimit();
      } else {
        this.updateCooldownDisplay(remaining);
      }
    }, 1000);
  }

  clearCooldownTimer(): void {
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
      this.cooldownInterval = null;
    }
  }

  updateCooldownDisplay(ms: number): void {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hStr = hours > 0 ? `${hours}h ` : '';
    const mStr = `${minutes}m `;
    const sStr = `${seconds.toString().padStart(2, '0')}s`;
    this.cooldownRemainingText.set(`${hStr}${mStr}${sStr}`);
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update(v => !v);
  }

  updatePasswordStrength(): void {
    const pwd = this.signupForm.get('password')?.value || '';
    this.currentPasswordValue.set(pwd);
    this.hasLength.set(pwd.length >= 8);
    this.hasLetter.set(/[a-zA-Z]/.test(pwd));
    this.hasNumber.set(/[0-9]/.test(pwd));
    this.hasSpecial.set(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd));
  }

  onSubmit(): void {
    if (this.isDeviceLimitReached()) {
      this.errorMessage.set('Device limit active: A maximum of 2 accounts can be created from this device in 24 hours. Please sign in with your existing account.');
      return;
    }

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.register({
      fullName: this.signupForm.value.fullName,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.checkDeviceLimit();
        this.router.navigate(['/products']);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        if (err.isDeviceLimit || (typeof err.error === 'string' && err.error.toLowerCase().includes('device registration limit'))) {
          this.isDeviceLimitReached.set(true);
          const rem = err.remainingMs || (24 * 60 * 60 * 1000);
          this.startCooldownTimer(rem);
        }
        this.errorMessage.set(err.error || err.message || 'Registration failed. Please check inputs.');
      }
    });
  }
}
