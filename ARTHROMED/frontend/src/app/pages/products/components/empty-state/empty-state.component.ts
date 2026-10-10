import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state-box card">
      <div class="empty-icon-wrapper">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
      </div>

      <h3 class="empty-title">No Orthopedic Equipment Found</h3>
      <p class="empty-text">
        We could not find any matching products matching your selected category or search filters. Try adjusting your search term or reset all filters.
      </p>

      <button type="button" class="btn btn-teal" (click)="resetFilters.emit()">
        <span>Reset Filters & Show All</span>
      </button>
    </div>
  `,
  styles: [`
    .empty-state-box {
      padding: 4rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      max-width: 550px;
      margin: 2rem auto;
      background-color: #ffffff;
    }
    .empty-icon-wrapper {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background-color: #f1f5f9;
      color: #94a3b8;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.5rem;
    }
    .empty-title {
      font-size: 1.35rem;
      color: var(--color-primary);
    }
    .empty-text {
      font-size: 0.925rem;
      color: var(--color-text-muted);
      line-height: 1.6;
      max-width: 440px;
      margin-bottom: 0.5rem;
    }
  `]
})
export class EmptyStateComponent {
  @Output() resetFilters = new EventEmitter<void>();
}
