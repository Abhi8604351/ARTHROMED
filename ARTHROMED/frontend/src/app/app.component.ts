import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AdminNavbarComponent } from './shared/components/admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, AdminNavbarComponent],
  template: `
    <div class="app-layout" [class.admin-isolated]="isAdminRoute()">
      <!-- Public Consumer Header (Only for non-admin pages) -->
      @if (!isAdminRoute()) {
        <app-navbar></app-navbar>
      }

      <!-- Dedicated Admin Portal Topbar (Only for authenticated admin dashboard pages) -->
      @if (isAdminAuthenticatedRoute()) {
        <app-admin-navbar></app-admin-navbar>
      }

      <main class="main-content" [class.admin-main]="isAdminRoute()">
        <router-outlet></router-outlet>
      </main>

      <!-- Public Consumer Footer (Only for non-admin pages) -->
      @if (!isAdminRoute()) {
        <app-footer></app-footer>
      }
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      width: 100%;
      max-width: 100%;
      overflow-x: hidden;
    }
    app-navbar {
      display: block;
      position: sticky;
      top: 0;
      z-index: 1000;
      width: 100%;
      max-width: 100%;
    }
    .main-content {
      flex: 1 0 auto;
      width: 100%;
      max-width: 100%;
      overflow-x: hidden;
    }
    .admin-isolated .main-content {
      display: flex;
      flex-direction: column;
      background-color: #030d18;
    }
  `]
})
export class AppComponent {
  title = 'ArthroMed';
  isAdminRoute = signal(false);
  isAdminAuthenticatedRoute = signal(false);

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || event.url || '';
        const isAdmin = url.startsWith('/admin');
        const isLoginPage = url.includes('/admin/login');

        this.isAdminRoute.set(isAdmin);
        this.isAdminAuthenticatedRoute.set(isAdmin && !isLoginPage);
      });
  }
}
