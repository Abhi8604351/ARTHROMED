import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../../core/services/products.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <header class="header">
      <nav class="navbar container">
        <!-- Official ArthroMed Brand Logo -->
        <a routerLink="/" (click)="scrollToTop($event)" class="brand-logo" title="ArthroMed - Healthcare for better life !">
          <img
            src="/Breg/Logo.png"
            alt="ArthroMed - Healthcare for better life !"
            class="brand-logo-img"
          />
        </a>

        <!-- Desktop Navigation Links -->
        <ul class="nav-links">
          <li>
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="nav-link">
              <span>Home</span>
            </a>
          </li>
          <li>
            <a routerLink="/about" routerLinkActive="active" class="nav-link">
              <span>About Us</span>
            </a>
          </li>
          <li>
            <a routerLink="/products" routerLinkActive="active" class="nav-link">
              <span>Products</span>
            </a>
          </li>
          <li>
            <a href="/#care-section" (click)="scrollToSection('care-section', $event)" class="nav-link">
              <span>Services</span>
            </a>
          </li>
          <li>
            <a href="/#about-section" (click)="scrollToSection('about-section', $event)" class="nav-link">
              <span>Mission</span>
            </a>
          </li>
        </ul>

        <!-- Right Header Actions -->
        <div class="header-actions">
          <!-- Search Button -->
          <button type="button" class="btn-icon-search" (click)="toggleSearch()" aria-label="Search Catalog" title="Search Braces & Equipment">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          <!-- Auth Control: Log In / User Profile -->
          @if (authService.isAuthenticated()) {
            <div class="user-profile-menu">
              <div class="user-pill" [class.admin-pill]="authService.isAdmin()">
                <span class="user-role-tag">{{ authService.isAdmin() ? 'ADMIN' : 'PATIENT' }}</span>
                <span class="user-name">{{ authService.currentUser()?.fullName?.split(' ')?.at(0) || 'User' }}</span>
                @if (authService.isAdmin()) {
                  <a routerLink="/admin/products" class="admin-chip-link" title="Open Admin Control Panel">
                    <span>Panel &rarr;</span>
                  </a>
                }
              </div>
              <button type="button" class="btn-logout" (click)="onLogout()" title="Sign Out">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                <span>Exit</span>
              </button>
            </div>
          } @else {
            <a routerLink="/login" class="nav-login-link">
              <span>Connect with Us</span>
            </a>
          }

          <!-- Medora Style Primary Pill Button: "Get Started ->" -->
          <a routerLink="/products" class="btn-get-started">
            <span>Get Started</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>

          <!-- Mobile Toggle Button -->
          <button class="mobile-toggle" (click)="toggleMobileMenu()" aria-label="Toggle Navigation">
            <span class="bar" [class.open]="isMobileMenuOpen()"></span>
            <span class="bar" [class.open]="isMobileMenuOpen()"></span>
            <span class="bar" [class.open]="isMobileMenuOpen()"></span>
          </button>
        </div>
      </nav>

      <!-- Quick Search Overlay Modal -->
      @if (isSearchOpen()) {
        <div class="search-overlay" (click)="toggleSearch()">
          <div class="search-box" (click)="$event.stopPropagation()">
            <div class="search-header">
              <div class="search-input-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  [(ngModel)]="searchQuery"
                  (keyup.enter)="executeSearch()"
                  placeholder="Search Breg T Scope, cold therapy, braces, SKU..."
                  class="search-input"
                  autofocus
                />
              </div>
              <button class="search-close" (click)="toggleSearch()">✕</button>
            </div>
            <div class="search-suggestions">
              <span class="sugg-label">Popular:</span>
              <button class="sugg-pill" (click)="quickSearch('T Scope')">Breg T Scope Premier</button>
              <button class="sugg-pill" (click)="quickSearch('Polar Care')">Polar Care Wave</button>
              <button class="sugg-pill" (click)="quickSearch('Fusion XT')">Fusion XT Knee</button>
              <button class="sugg-pill" (click)="quickSearch('LSO')">Pinnacle LSO</button>
            </div>
          </div>
        </div>
      }

      <!-- Mobile Navigation Drawer -->
      @if (isMobileMenuOpen()) {
        <div class="mobile-drawer">
          <ul class="mobile-nav-links">
            <li><a routerLink="/" (click)="closeMobileMenu()">Home</a></li>
            <li><a routerLink="/about" (click)="closeMobileMenu()">About Us</a></li>
            <li><a routerLink="/products" (click)="closeMobileMenu()">Products</a></li>
            <li><a href="/#care-section" (click)="scrollToSection('care-section', $event)">Services</a></li>
            <li><a href="/#about-section" (click)="scrollToSection('about-section', $event)">Mission</a></li>
            @if (authService.isAuthenticated()) {
              @if (authService.isAdmin()) {
                <li><a routerLink="/admin/products" (click)="closeMobileMenu()" style="color: #0d9488;">Control Panel &rarr;</a></li>
              }
              <li><a href="javascript:void(0)" (click)="onLogout(); closeMobileMenu()" style="color: #ef4444;">Sign Out ({{ authService.currentUser()?.fullName }})</a></li>
            } @else {
              <li><a routerLink="/login" (click)="closeMobileMenu()">Connect with Us</a></li>
            }
          </ul>
          <div class="mobile-actions">
            <a routerLink="/products" (click)="closeMobileMenu()" class="btn-get-started" style="width: 100%; justify-content: center;">
              <span>Get Started &rarr;</span>
            </a>
          </div>
        </div>
      }
    </header>
  `,
  styles: [`
    :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: 1000;
      width: 100%;
    }

    .header {
      background: #ffffff;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
      transition: all 0.25s ease;
    }

    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 76px;
    }

    /* Brand Logo */
    .brand-logo {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
      height: 100%;
      padding: 0.35rem 0;
    }

    .brand-logo-img {
      height: 50px;
      max-height: 54px;
      width: auto;
      object-fit: contain;
      display: block;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .brand-logo:hover .brand-logo-img {
      transform: scale(1.03);
    }

    /* Desktop Navigation Links */
    .nav-links {
      display: none;
      list-style: none;
      align-items: center;
      gap: 2.2rem;
      margin: 0;
      padding: 0;
    }

    @media (min-width: 992px) {
      .nav-links {
        display: flex;
      }
    }

    .nav-link {
      font-size: 0.94rem;
      font-weight: 500;
      color: #334155;
      text-decoration: none;
      position: relative;
      padding: 0.35rem 0;
      transition: color 0.2s ease;
    }

    .nav-link:hover {
      color: #12382e;
    }

    .nav-link.active {
      color: #0f172a;
      font-weight: 600;
    }

    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #12382e;
      border-radius: 2px;
    }

    /* Right Header Actions */
    .header-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    /* Search Button */
    .btn-icon-search {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      color: #1e293b;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    .btn-icon-search:hover {
      background-color: #f1f5f9;
      color: #0f172a;
    }

    /* Log in Text Link */
    .nav-login-link {
      font-size: 0.94rem;
      font-weight: 600;
      color: #1e293b;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .nav-login-link:hover {
      color: #12382e;
    }

    /* Primary Pill Button: "Get Started ->" */
    .btn-get-started {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      background-color: #12382e;
      color: #ffffff;
      padding: 0.68rem 1.4rem;
      border-radius: 9999px;
      font-size: 0.92rem;
      font-weight: 600;
      text-decoration: none;
      box-shadow: 0 4px 14px rgba(18, 56, 46, 0.22);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .btn-get-started:hover {
      background-color: #0b241d;
      transform: translateY(-1.5px);
      box-shadow: 0 6px 20px rgba(18, 56, 46, 0.32);
      color: #ffffff;
    }

    .btn-get-started:active {
      transform: translateY(0.5px);
    }

    /* User Profile Controls */
    .user-profile-menu {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .user-pill {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
    }

    .user-pill.admin-pill {
      background: #ecfdf5;
      border-color: #a7f3d0;
    }

    .user-role-tag {
      font-size: 0.65rem;
      font-weight: 800;
      color: #12382e;
      letter-spacing: 0.05em;
    }

    .user-name {
      font-size: 0.82rem;
      font-weight: 700;
      color: #0f172a;
    }

    .admin-chip-link {
      font-size: 0.72rem;
      font-weight: 700;
      color: #166534;
      background: rgba(22, 101, 52, 0.12);
      padding: 0.15rem 0.45rem;
      border-radius: 9999px;
      text-decoration: none;
    }

    .btn-logout {
      background: #fee2e2;
      border: 1px solid #fecaca;
      color: #b91c1c;
      padding: 0.4rem 0.7rem;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.3rem;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-logout:hover {
      background: #fca5a5;
    }

    /* Search Overlay */
    .search-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(4px);
      z-index: 2000;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 100px;
    }

    .search-box {
      background: #ffffff;
      border-radius: 16px;
      width: 90%;
      max-width: 580px;
      padding: 1.5rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      border: 1px solid #e2e8f0;
      animation: fadeInDown 0.2s ease-out;
    }

    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .search-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .search-input-wrap {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      padding: 0.75rem 1rem;
      color: #64748b;
    }

    .search-input {
      flex: 1;
      border: none;
      background: transparent;
      font-size: 1rem;
      color: #0f172a;
      outline: none;
    }

    .search-close {
      background: #f1f5f9;
      border: none;
      font-size: 1rem;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      color: #64748b;
      cursor: pointer;
    }

    .search-suggestions {
      margin-top: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .sugg-label {
      font-size: 0.8rem;
      color: #64748b;
      font-weight: 600;
    }

    .sugg-pill {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      color: #334155;
      cursor: pointer;
      transition: all 0.2s;
    }

    .sugg-pill:hover {
      background: #12382e;
      color: #ffffff;
      border-color: #12382e;
    }

    /* Mobile Toggle */
    .mobile-toggle {
      display: flex;
      flex-direction: column;
      gap: 5px;
      padding: 6px;
      background: transparent;
      border: none;
      cursor: pointer;
    }

    @media (min-width: 992px) {
      .mobile-toggle {
        display: none;
      }
    }

    .bar {
      width: 22px;
      height: 2.2px;
      background-color: #1e293b;
      border-radius: 2px;
      transition: all 0.2s ease;
    }

    .mobile-drawer {
      background: #ffffff;
      border-top: 1px solid #f1f5f9;
      padding: 1.5rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    }

    .mobile-nav-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin: 0 0 1.5rem;
      padding: 0;
    }

    .mobile-nav-links a {
      font-size: 1.05rem;
      font-weight: 600;
      color: #1e293b;
      text-decoration: none;
    }
  `]
})
export class NavbarComponent {
  isMobileMenuOpen = signal(false);
  isSearchOpen = signal(false);
  searchQuery = '';
  whatsAppUrl: string;

  constructor(
    private productsService: ProductsService,
    public authService: AuthService,
    private router: Router
  ) {
    this.whatsAppUrl = this.productsService.getWhatsAppInquiryUrl();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(val => !val);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  toggleSearch(): void {
    this.isSearchOpen.update(val => !val);
    this.searchQuery = '';
  }

  executeSearch(): void {
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.trim();
      this.isSearchOpen.set(false);
      this.router.navigate(['/products'], { queryParams: { search: q } });
    }
  }

  quickSearch(query: string): void {
    this.isSearchOpen.set(false);
    this.router.navigate(['/products'], { queryParams: { search: query } });
  }

  scrollToSection(sectionId: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.closeMobileMenu();

    const currentUrl = this.router.url.split('#')[0].split('?')[0];
    if (currentUrl === '/' || currentUrl === '') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.replaceState(null, '', `/#${sectionId}`);
      }
    } else {
      this.router.navigate(['/'], { fragment: sectionId }).then(() => {
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 120);
      });
    }
  }

  scrollToTop(event?: Event): void {
    const currentUrl = this.router.url.split('#')[0].split('?')[0];
    if (currentUrl === '/' || currentUrl === '') {
      if (event) event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.replaceState(null, '', '/');
    }
  }

  onLogout(): void {
    this.authService.logout();
  }
}
