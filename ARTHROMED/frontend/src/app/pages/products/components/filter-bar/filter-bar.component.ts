import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-bar-wrapper card">
      <!-- Search input row -->
      <div class="filter-top-row">
        <div class="search-input-box">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            type="text"
            class="search-input"
            placeholder="Search by product name, SKU (e.g. BREG-PCW), or indication..."
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange($event)"
          />
          @if (searchQuery) {
            <button class="clear-search-btn" (click)="clearSearch()" title="Clear search">✕</button>
          }
        </div>

        <!-- Sort dropdown -->
        <div class="sort-select-box">
          <label for="sort-select" class="sort-label">Sort:</label>
          <select
            id="sort-select"
            class="sort-select"
            [ngModel]="selectedSort"
            (ngModelChange)="onSortChange($event)"
          >
            <option value="newest">Newest First</option>
            <option value="az">Product Name (A-Z)</option>
            <option value="za">Product Name (Z-A)</option>
          </select>
        </div>
      </div>

      <!-- Category Filter Chips -->
      <div class="category-chips-row">
        <span class="chips-title">Filter by Category:</span>
        <div class="chips-container">
          @for (cat of categories; track cat) {
            <button
              type="button"
              class="chip-btn"
              [class.active]="selectedCategory === cat"
              (click)="selectCategory(cat)"
            >
              {{ cat }}
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-bar-wrapper {
      padding: 1.5rem;
      margin-bottom: 2.25rem;
      background-color: #ffffff;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .filter-top-row {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .search-input-box {
      flex: 1;
      min-width: 280px;
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-icon {
      position: absolute;
      left: 1rem;
      color: #94a3b8;
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      padding: 0.8rem 2.5rem 0.8rem 2.8rem;
      border: 1.5px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: 0.95rem;
      outline: none;
      transition: all var(--transition-fast);
      background-color: var(--color-surface-bg);
    }
    .search-input:focus {
      border-color: var(--color-accent);
      background-color: #ffffff;
      box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.12);
    }
    .clear-search-btn {
      position: absolute;
      right: 0.85rem;
      color: #94a3b8;
      font-size: 0.9rem;
      padding: 4px;
      border-radius: 50%;
    }
    .clear-search-btn:hover {
      color: var(--color-primary);
    }
    .sort-select-box {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .sort-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text-muted);
    }
    .sort-select {
      padding: 0.75rem 1rem;
      border: 1.5px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--color-primary);
      background-color: var(--color-surface-bg);
      outline: none;
      cursor: pointer;
    }
    .sort-select:focus {
      border-color: var(--color-accent);
    }
    .category-chips-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
      padding-top: 0.75rem;
      border-top: 1px solid var(--color-border);
    }
    .chips-title {
      font-size: 0.825rem;
      font-weight: 700;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .chips-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .chip-btn {
      padding: 0.45rem 0.95rem;
      font-size: 0.85rem;
      font-weight: 600;
      border-radius: var(--radius-full);
      border: 1.5px solid var(--color-border);
      background-color: var(--color-surface-bg);
      color: var(--color-text-muted);
      transition: all var(--transition-fast);
    }
    .chip-btn:hover {
      border-color: var(--color-accent);
      color: var(--color-accent);
    }
    .chip-btn.active {
      background-color: var(--color-primary);
      color: #ffffff;
      border-color: var(--color-primary);
      box-shadow: 0 2px 8px rgba(15, 43, 72, 0.2);
    }
  `]
})
export class FilterBarComponent implements OnInit, OnDestroy {
  @Input() selectedCategory: string = 'All';
  @Input() selectedSort: string = 'newest';
  @Input() searchQuery: string = '';

  @Output() categoryChange = new EventEmitter<string>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<string>();

  categories: string[] = [
    'All',
    'Knee',
    'Shoulder',
    'Cold Therapy',
    'Spine',
    'Foot & Ankle',
    'General Orthopedics'
  ];

  private searchSubject = new Subject<string>();
  private searchSub?: Subscription;

  ngOnInit(): void {
    // Debounce search by 300ms
    this.searchSub = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchChange.emit(term);
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchSubject.next('');
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.categoryChange.emit(category);
  }

  onSortChange(sort: string): void {
    this.selectedSort = sort;
    this.sortChange.emit(sort);
  }
}
