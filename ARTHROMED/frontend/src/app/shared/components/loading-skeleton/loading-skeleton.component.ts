import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-grid" [style.gridTemplateColumns]="'repeat(' + count + ', minmax(280px, 1fr))'">
      @for (item of items; track $index) {
        <div class="skeleton-card">
          <div class="skeleton-img pulse"></div>
          <div class="skeleton-body">
            <div class="skeleton-badge pulse"></div>
            <div class="skeleton-title pulse"></div>
            <div class="skeleton-line pulse"></div>
            <div class="skeleton-line short pulse"></div>
            <div class="skeleton-footer">
              <div class="skeleton-price pulse"></div>
              <div class="skeleton-btn pulse"></div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .skeleton-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.75rem;
      width: 100%;
    }
    .skeleton-card {
      background-color: #ffffff;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }
    .skeleton-img {
      height: 220px;
      width: 100%;
      background-color: #e2e8f0;
    }
    .skeleton-body {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .skeleton-badge {
      height: 18px;
      width: 80px;
      background-color: #e2e8f0;
      border-radius: 999px;
    }
    .skeleton-title {
      height: 22px;
      width: 85%;
      background-color: #e2e8f0;
      border-radius: 4px;
    }
    .skeleton-line {
      height: 14px;
      width: 100%;
      background-color: #f1f5f9;
      border-radius: 4px;
    }
    .skeleton-line.short {
      width: 60%;
    }
    .skeleton-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid #f1f5f9;
    }
    .skeleton-price {
      height: 24px;
      width: 70px;
      background-color: #e2e8f0;
      border-radius: 4px;
    }
    .skeleton-btn {
      height: 36px;
      width: 110px;
      background-color: #e2e8f0;
      border-radius: 8px;
    }
    .pulse {
      animation: pulse 1.6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.45;
      }
    }
  `]
})
export class LoadingSkeletonComponent {
  @Input() count: number = 3;
  get items(): number[] {
    return Array.from({ length: this.count });
  }
}
