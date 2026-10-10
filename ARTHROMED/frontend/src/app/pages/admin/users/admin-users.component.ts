import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UserPublicDto } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="admin-page">
      <!-- Admin Header with Navigation Tabs -->
      <header class="admin-header">
        <div class="container header-flex">
          <div>
            <div class="admin-badge-tag">Clinical Governance & Security</div>
            <h1 class="admin-title">Registered Users & Account Security</h1>
            <p class="admin-subtitle">
              Monitor registered clinicians and patients, review failed password attempts, and manage account lockouts.
            </p>
          </div>

          <!-- Quick Navigation Tabs -->
          <div class="admin-nav-tabs">
            <a routerLink="/admin/products" class="tab-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="7" height="7" x="3" y="3" rx="1"/>
                <rect width="7" height="7" x="14" y="3" rx="1"/>
                <rect width="7" height="7" x="14" y="14" rx="1"/>
                <rect width="7" height="7" x="3" y="14" rx="1"/>
              </svg>
              <span>Products Catalog</span>
            </a>
            <a routerLink="/admin/users" class="tab-link active">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span>Registered Users</span>
            </a>
          </div>
        </div>
      </header>

      <main class="container admin-body">
        <!-- Toast feedback alert -->
        @if (feedbackMessage()) {
          <div class="toast-alert" [class.error]="isErrorFeedback()">
            <span>{{ feedbackMessage() }}</span>
            <button class="toast-close" (click)="feedbackMessage.set('')">✕</button>
          </div>
        }

        <!-- Metrics Overview Grid -->
        <div class="metrics-grid">
          <div class="metric-card card">
            <span class="metric-label">Total Users</span>
            <span class="metric-val">{{ users().length }}</span>
            <span class="metric-sub">Registered accounts</span>
          </div>

          <div class="metric-card card">
            <span class="metric-label">Customers / Patients</span>
            <span class="metric-val text-blue">{{ customerCount() }}</span>
            <span class="metric-sub">Ordering patients & clinics</span>
          </div>

          <div class="metric-card card">
            <span class="metric-label">Administrators</span>
            <span class="metric-val text-teal">{{ adminCount() }}</span>
            <span class="metric-sub">Clinical staff & inventory</span>
          </div>

          <div class="metric-card card" [class.has-locked]="lockedCount() > 0">
            <span class="metric-label">Currently Locked</span>
            <span class="metric-val text-red">{{ lockedCount() }}</span>
            <span class="metric-sub">Exceeded 3 failed attempts</span>
          </div>
        </div>

        <!-- Users Table Card -->
        <div class="card admin-table-card">
          <div class="table-toolbar">
            <div class="table-stats">
              <span>Showing <strong>{{ displayedUsers().length }}</strong> of <strong>{{ users().length }}</strong> users</span>
            </div>

            <div class="toolbar-search">
              <input
                type="text"
                placeholder="Search user by name or email..."
                class="form-control admin-search-input"
                [(ngModel)]="searchQuery"
                (ngModelChange)="filterUsers()"
              />
            </div>
          </div>

          @if (isLoading()) {
            <div class="admin-loading">
              <div class="spinner"></div>
              <span>Fetching registered accounts...</span>
            </div>
          } @else {
            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>User / Name</th>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th>Registered On</th>
                    <th>Failed Attempts</th>
                    <th>Security Status</th>
                    <th class="actions-col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (u of displayedUsers(); track u.id) {
                    <tr>
                      <!-- Avatar & Name -->
                      <td class="user-cell">
                        <div class="user-avatar" [class.admin-avatar]="u.role === 'admin'">
                          {{ getInitials(u.fullName) }}
                        </div>
                        <div class="user-cell-meta">
                          <span class="user-name-title">{{ u.fullName }}</span>
                          <span class="user-id-sub">ID: {{ u.id }}</span>
                        </div>
                      </td>

                      <!-- Email -->
                      <td>
                        <span class="email-text">{{ u.email }}</span>
                      </td>

                      <!-- Role -->
                      <td>
                        @if (u.role === 'admin') {
                          <span class="badge badge-teal">Administrator</span>
                        } @else {
                          <span class="badge badge-blue">Customer</span>
                        }
                      </td>

                      <!-- Date -->
                      <td class="date-cell">
                        {{ u.createdAt | date:'mediumDate' }}
                      </td>

                      <!-- Failed Attempts Counter -->
                      <td>
                        <span class="attempts-pill" [class.warning]="u.failedLoginAttempts > 0" [class.danger]="u.failedLoginAttempts >= 3">
                          {{ u.failedLoginAttempts }} / 3
                        </span>
                      </td>

                      <!-- Security Status -->
                      <td>
                        @if (u.isLocked) {
                          <div class="locked-status-tag">
                            <span class="pulse-red-dot"></span>
                            <span>Locked (10m wait)</span>
                          </div>
                        } @else {
                          <span class="badge badge-success">Active & Healthy</span>
                        }
                      </td>

                      <!-- Action Buttons -->
                      <td class="actions-col">
                        <div class="btn-group">
                          @if (u.isLocked || u.failedLoginAttempts > 0) {
                            <button
                              type="button"
                              class="btn-action unlock-btn"
                              (click)="unlockAccount(u)"
                              title="Unlock account & reset attempts"
                            >
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                                <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
                              </svg>
                              <span>Unlock</span>
                            </button>
                          }

                          @if (u.role !== 'admin') {
                            <button
                              type="button"
                              class="btn-action delete-btn"
                              (click)="deleteAccount(u)"
                              title="Delete user account"
                            >
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                              </svg>
                            </button>
                          }
                        </div>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="7" class="empty-table-row">
                        No registered users match your search criteria.
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-page {
      padding-bottom: 6rem;
      background-color: var(--color-surface-bg);
      min-height: 85vh;
    }
    .admin-header {
      background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%);
      color: #ffffff;
      padding: 3rem 0;
      margin-bottom: 2.5rem;
    }
    .header-flex {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      flex-wrap: wrap;
    }
    .admin-badge-tag {
      display: inline-block;
      color: #86efac;
      font-size: 0.775rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 0.5rem;
      background: rgba(220, 252, 231, 0.15);
      padding: 0.2rem 0.75rem;
      border-radius: 9999px;
      border: 1px solid rgba(134, 239, 172, 0.35);
    }
    .admin-title {
      font-size: 2.25rem;
      color: #ffffff;
      margin-bottom: 0.4rem;
    }
    .admin-subtitle {
      font-size: 0.95rem;
      color: #cbd5e1;
    }
    .admin-nav-tabs {
      display: flex;
      gap: 0.75rem;
    }
    .tab-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem 1.15rem;
      border-radius: 9999px;
      font-size: 0.9rem;
      font-weight: 700;
      color: #e2e8f0;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.2s ease;
    }
    .tab-link:hover {
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
    }
    .tab-link.active {
      background: #ffffff;
      color: #12382e;
      border-color: #ffffff;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    @media (max-width: 992px) {
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 640px) {
      .metrics-grid {
        grid-template-columns: 1fr;
      }
    }
    .metric-card {
      padding: 1.5rem;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      border: 1px solid var(--color-border);
    }
    .metric-card.has-locked {
      border-color: #fca5a5;
      background: #fff5f5;
    }
    .metric-label {
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .metric-val {
      font-size: 2.15rem;
      font-weight: 800;
      color: var(--color-primary);
      line-height: 1.1;
    }
    .text-blue { color: #0284c7; }
    .text-teal { color: #0d9488; }
    .text-red { color: #ef4444; }
    .metric-sub {
      font-size: 0.78rem;
      color: #94a3b8;
    }
    .toast-alert {
      background-color: #d1fae5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      padding: 0.85rem 1.25rem;
      border-radius: var(--radius-md);
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
      font-size: 0.9rem;
    }
    .toast-alert.error {
      background-color: #fee2e2;
      color: #991b1b;
      border-color: #fecaca;
    }
    .toast-close {
      color: inherit;
      font-weight: 800;
      cursor: pointer;
    }
    .admin-table-card {
      background-color: #ffffff;
      overflow: hidden;
    }
    .table-toolbar {
      padding: 1.25rem 1.75rem;
      border-bottom: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .table-stats {
      font-size: 0.9rem;
      color: var(--color-text-muted);
    }
    .admin-search-input {
      width: 280px;
      padding: 0.6rem 0.9rem;
      font-size: 0.875rem;
    }
    .admin-loading {
      padding: 4rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      color: var(--color-text-muted);
    }
    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid #e2e8f0;
      border-top-color: var(--color-accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .table-responsive {
      overflow-x: auto;
    }
    .admin-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .admin-table th {
      background-color: #f8fafc;
      padding: 1rem 1.25rem;
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-text-muted);
      border-bottom: 1px solid var(--color-border);
    }
    .admin-table td {
      padding: 1.1rem 1.25rem;
      font-size: 0.9rem;
      border-bottom: 1px solid var(--color-border);
      vertical-align: middle;
    }
    .user-cell {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      min-width: 220px;
    }
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0284c7, #0d9488);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
      flex-shrink: 0;
    }
    .user-avatar.admin-avatar {
      background: linear-gradient(135deg, #0f2b48, #0284c7);
      box-shadow: 0 0 0 2px rgba(45, 212, 191, 0.4);
    }
    .user-cell-meta {
      display: flex;
      flex-direction: column;
    }
    .user-name-title {
      font-weight: 700;
      color: var(--color-primary);
    }
    .user-id-sub {
      font-size: 0.72rem;
      color: #94a3b8;
    }
    .email-text {
      color: var(--color-text-main);
      font-weight: 500;
    }
    .date-cell {
      color: var(--color-text-muted);
      font-size: 0.85rem;
    }
    .attempts-pill {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: var(--radius-full);
      font-size: 0.78rem;
      font-weight: 700;
      background: #f1f5f9;
      color: #64748b;
    }
    .attempts-pill.warning {
      background: #fef3c7;
      color: #b45309;
    }
    .attempts-pill.danger {
      background: #fee2e2;
      color: #dc2626;
    }
    .locked-status-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-full);
      background: #fee2e2;
      color: #b91c1c;
      font-size: 0.75rem;
      font-weight: 700;
      border: 1px solid #fca5a5;
    }
    .pulse-red-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.35);
      animation: pulse 1.5s infinite;
    }
    .actions-col {
      text-align: right;
    }
    .btn-group {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-action {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .unlock-btn {
      background: #d1fae5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }
    .unlock-btn:hover {
      background: #10b981;
      color: #ffffff;
    }
    .delete-btn {
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }
    .delete-btn:hover {
      background: #ef4444;
      color: #ffffff;
    }
    .empty-table-row {
      text-align: center;
      padding: 3rem;
      color: #94a3b8;
    }
  `]
})
export class AdminUsersComponent implements OnInit {
  users = signal<UserPublicDto[]>([]);
  displayedUsers = signal<UserPublicDto[]>([]);
  searchQuery = '';
  isLoading = signal(false);
  feedbackMessage = signal('');
  isErrorFeedback = signal(false);

  customerCount = computed(() => this.users().filter(u => u.role === 'customer').length);
  adminCount = computed(() => this.users().filter(u => u.role === 'admin').length);
  lockedCount = computed(() => this.users().filter(u => u.isLocked).length);

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.authService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.displayedUsers.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  filterUsers(): void {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) {
      this.displayedUsers.set(this.users());
      return;
    }
    const filtered = this.users().filter(u =>
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
    this.displayedUsers.set(filtered);
  }

  unlockAccount(user: UserPublicDto): void {
    this.authService.unlockUser(user.id).subscribe({
      next: (res) => {
        this.feedbackMessage.set(res.message || `Account for ${user.fullName} unlocked.`);
        this.isErrorFeedback.set(false);
        user.isLocked = false;
        user.failedLoginAttempts = 0;
        user.lockUntil = null;
        this.users.update(list => [...list]);
        this.displayedUsers.update(list => [...list]);
      },
      error: () => {
        this.feedbackMessage.set('Failed to unlock user account.');
        this.isErrorFeedback.set(true);
      }
    });
  }

  deleteAccount(user: UserPublicDto): void {
    if (confirm(`Are you sure you want to delete user ${user.fullName} (${user.email})?`)) {
      this.authService.deleteUser(user.id).subscribe({
        next: (res) => {
          this.feedbackMessage.set(res.message);
          this.isErrorFeedback.set(false);
          this.users.update(list => list.filter(u => u.id !== user.id));
          this.displayedUsers.update(list => list.filter(u => u.id !== user.id));
        },
        error: () => {
          this.feedbackMessage.set('Failed to delete user.');
          this.isErrorFeedback.set(true);
        }
      });
    }
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }
}
