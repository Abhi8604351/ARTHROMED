import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="admin-topbar">
      <div class="container topbar-inner">
        <!-- ArthroMed Brand Logo with Admin Badge -->
        <div class="brand-group">
          <a routerLink="/admin/products" class="admin-brand-link" title="ArthroMed Clinical Administration">
            <img
              src="/Breg/Logo.png"
              alt="ArthroMed - Healthcare for better life !"
              class="brand-logo-img"
            />
            <span class="admin-panel-badge">ADMIN CONTROL</span>
          </a>
        </div>

        <!-- Dedicated Admin Navigation Links -->
        <nav class="admin-nav-links">
          <a
            routerLink="/admin/products"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: false }"
            class="admin-nav-item"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="7" height="7" x="3" y="3" rx="1"/>
              <rect width="7" height="7" x="14" y="3" rx="1"/>
              <rect width="7" height="7" x="14" y="14" rx="1"/>
              <rect width="7" height="7" x="3" y="14" rx="1"/>
            </svg>
            <span>Products Catalog</span>
          </a>

          <a
            routerLink="/admin/users"
            routerLinkActive="active"
            class="admin-nav-item"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>User Accounts & Security</span>
          </a>
        </nav>

        <!-- Right Side: Store Return + Admin Profile + Logout -->
        <div class="admin-actions">
          <a routerLink="/" class="btn-view-store" title="Return to Public Customer Store">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            <span>View Public Site</span>
          </a>

          <div class="admin-user-badge">
            <span class="status-pulse-dot"></span>
            <span class="admin-name">{{ authService.currentUser()?.fullName || 'Administrator' }}</span>
          </div>

          <button type="button" class="btn-admin-logout" (click)="onLogout()" title="Sign Out of Admin Portal">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .admin-topbar {
      background: #ffffff;
      border-bottom: 1px solid rgba(0, 0, 0, 0.07);
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }

    .topbar-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 74px;
      gap: 1rem;
      width: 100%;
      box-sizing: border-box;
    }

    @media (max-width: 768px) {
      .topbar-inner {
        height: 60px;
        gap: 0.5rem;
      }
    }

    .brand-group {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .admin-brand-link {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      flex-shrink: 0;
    }

    .brand-logo-img {
      height: 42px;
      max-height: 46px;
      width: auto;
      object-fit: contain;
      display: block;
      flex-shrink: 0;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @media (max-width: 768px) {
      .brand-logo-img {
        height: 34px;
        max-height: 36px;
        max-width: 125px;
      }
    }

    .admin-brand-link:hover .brand-logo-img {
      transform: scale(1.02);
    }

    .admin-panel-badge {
      font-size: 0.7rem;
      font-weight: 800;
      color: #12382e;
      background: #eaf3ec;
      border: 1px solid #bbf7d0;
      padding: 0.2rem 0.65rem;
      border-radius: 9999px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      white-space: nowrap;
    }

    @media (max-width: 640px) {
      .admin-panel-badge {
        display: none;
      }
    }

    .admin-nav-links {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #f8fafc;
      padding: 0.35rem 0.5rem;
      border-radius: 9999px;
      border: 1px solid #e2e8f0;
    }

    @media (max-width: 860px) {
      .admin-nav-links {
        display: none;
      }
    }

    .admin-nav-item {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.55rem 1.15rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
      color: #64748b;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .admin-nav-item:hover {
      color: #12382e;
      background: rgba(18, 56, 46, 0.05);
    }

    .admin-nav-item.active {
      color: #ffffff;
      background: #12382e;
      box-shadow: 0 4px 12px rgba(18, 56, 46, 0.2);
    }

    .admin-actions {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    .btn-view-store {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: #12382e;
      font-size: 0.84rem;
      font-weight: 600;
      padding: 0.5rem 0.95rem;
      border-radius: 9999px;
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      transition: all 0.2s ease;
      text-decoration: none;
    }

    .btn-view-store:hover {
      border-color: #12382e;
      background: #eaf3ec;
    }

    .admin-user-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      padding: 0.45rem 0.85rem;
      border-radius: 9999px;
    }

    .status-pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #15803d;
      box-shadow: 0 0 6px rgba(21, 128, 61, 0.5);
    }

    .admin-name {
      font-size: 0.825rem;
      font-weight: 700;
      color: #0f172a;
    }

    .btn-admin-logout {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      background: #fee2e2;
      border: 1px solid #fecaca;
      color: #b91c1c;
      padding: 0.48rem 0.9rem;
      border-radius: 9999px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-admin-logout:hover {
      background: #fca5a5;
      color: #7f1d1d;
    }
  `]
})
export class AdminNavbarComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
