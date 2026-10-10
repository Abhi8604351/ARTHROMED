import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-page">
      <!-- Admin Subheader -->
      <header class="admin-header">
        <div class="container header-flex">
          <div>
            <div class="admin-badge-tag">Clinic Inventory Control</div>
            <h1 class="admin-title">Orthopedic Products Management</h1>
            <p class="admin-subtitle">
              Manage product listings, configure HCPCS billing codes, update image assets, and publish status.
            </p>
          </div>

          <div class="header-right-group">
            <div class="admin-nav-tabs">
              <a routerLink="/admin/products" class="tab-link active">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="7" height="7" x="3" y="3" rx="1"/>
                  <rect width="7" height="7" x="14" y="3" rx="1"/>
                  <rect width="7" height="7" x="14" y="14" rx="1"/>
                  <rect width="7" height="7" x="3" y="14" rx="1"/>
                </svg>
                <span>Products Catalog</span>
              </a>
              <a routerLink="/admin/users" class="tab-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <span>Registered Users</span>
              </a>
            </div>

            <div class="header-actions">
              <a routerLink="/admin/products/new" class="btn-add-product">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                <span>Add New Product</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Admin Table Container -->
      <main class="container admin-body">
        <!-- Notification toast if present -->
        @if (feedbackMessage()) {
          <div class="toast-alert" [class.error]="isErrorFeedback()">
            <span>{{ feedbackMessage() }}</span>
            <button class="toast-close" (click)="feedbackMessage.set('')">✕</button>
          </div>
        }

        <div class="card admin-table-card">
          <div class="table-toolbar">
            <div class="table-stats">
              <span>Total Catalog Items: <strong>{{ products().length }}</strong></span>
              <span class="dot">•</span>
              <span>Published: <strong>{{ publishedCount() }}</strong></span>
            </div>

            <div class="toolbar-search">
              <input
                type="text"
                placeholder="Filter table items..."
                class="form-control admin-search-input"
                (input)="filterTable($event)"
              />
            </div>
          </div>

          @if (isLoading()) {
            <div class="admin-loading">
              <div class="spinner"></div>
              <span>Refreshing clinic catalog data...</span>
            </div>
          } @else {
            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>SKU</th>
                    <th>Pricing Model</th>
                    <th>HCPCS</th>
                    <th>Status</th>
                    <th class="actions-col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (prod of displayedProducts(); track prod.id) {
                    <tr>
                      <!-- Product Thumb & Name -->
                      <td class="product-cell">
                        <img
                          [src]="prod.imageUrl"
                          [alt]="prod.name"
                          class="admin-thumb"
                          (error)="handleImageError($event)"
                        />
                        <div class="prod-cell-text">
                          <span class="prod-name-title">{{ prod.name }}</span>
                          <span class="prod-id-sub">ID: {{ prod.id }}</span>
                        </div>
                      </td>

                      <!-- Category -->
                      <td>
                        <span class="badge badge-teal">{{ prod.category }}</span>
                      </td>

                      <!-- SKU -->
                      <td>
                        <code class="sku-tag">{{ prod.sku }}</code>
                      </td>

                      <!-- Pricing Model -->
                      <td class="price-cell">
                        <span class="badge badge-quote">Quote on Request</span>
                      </td>

                      <!-- HCPCS -->
                      <td>
                        <span class="badge badge-hcpcs">{{ prod.hcpcsCode || 'None' }}</span>
                      </td>

                      <!-- Published Toggle -->
                      <td>
                        <button
                          type="button"
                          class="status-toggle-btn"
                          [class.published]="prod.isPublished"
                          (click)="togglePublish(prod)"
                          title="Click to toggle publish visibility"
                        >
                          <span class="toggle-indicator"></span>
                          <span>{{ prod.isPublished ? 'Published' : 'Draft' }}</span>
                        </button>
                      </td>

                      <!-- Action Buttons -->
                      <td class="actions-col">
                        <div class="btn-group">
                          <a
                            [routerLink]="['/products', prod.id]"
                            class="action-btn preview-btn"
                            title="View Live Page"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          </a>

                          <a
                            [routerLink]="['/admin/products/edit', prod.id]"
                            class="action-btn edit-btn"
                            title="Edit Product"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                            </svg>
                          </a>

                          <button
                            type="button"
                            class="action-btn delete-btn"
                            (click)="confirmDelete(prod)"
                            title="Delete Product"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="7" class="empty-table-row">
                        No orthopedic products match your criteria.
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
    @media (max-width: 640px) {
      .admin-title { font-size: 1.75rem; }
    }
    .admin-subtitle {
      font-size: 1rem;
      color: #cbd5e1;
    }
    .header-right-group {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      flex-wrap: wrap;
    }
    .admin-nav-tabs {
      display: flex;
      gap: 0.65rem;
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
    .btn-add-product {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background-color: #ffffff;
      color: #12382e;
      padding: 0.65rem 1.25rem;
      border-radius: 9999px;
      font-size: 0.9rem;
      font-weight: 700;
      text-decoration: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .btn-add-product:hover {
      background-color: #f1f5f9;
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
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
      background-color: #ffffff;
    }
    .table-stats {
      font-size: 0.9rem;
      color: var(--color-text-muted);
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .dot {
      color: var(--color-border);
    }
    .admin-search-input {
      width: 260px;
      padding: 0.55rem 0.85rem;
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
    .product-cell {
      display: flex;
      align-items: center;
      gap: 1rem;
      min-width: 260px;
    }
    .admin-thumb {
      width: 52px;
      height: 52px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid var(--color-border);
      background-color: #f1f5f9;
      flex-shrink: 0;
    }
    .prod-cell-text {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .prod-name-title {
      font-weight: 700;
      color: var(--color-primary);
      line-height: 1.3;
    }
    .prod-id-sub {
      font-size: 0.725rem;
      color: #94a3b8;
    }
    .sku-tag {
      font-size: 0.8rem;
      background-color: #f1f5f9;
      padding: 0.2rem 0.45rem;
      border-radius: 4px;
      color: #334155;
    }
    .price-cell {
      font-weight: 700;
      color: var(--color-primary);
    }
    .badge-quote {
      background-color: #dcfce7;
      color: #166534;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.6rem;
      border-radius: var(--radius-full);
      display: inline-block;
    }
    .status-toggle-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.78rem;
      font-weight: 700;
      border: 1.5px solid var(--color-border);
      background-color: #f8fafc;
      color: var(--color-text-muted);
      transition: all var(--transition-fast);
    }
    .status-toggle-btn .toggle-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #94a3b8;
    }
    .status-toggle-btn.published {
      background-color: #d1fae5;
      color: #065f46;
      border-color: #a7f3d0;
    }
    .status-toggle-btn.published .toggle-indicator {
      background-color: #10b981;
    }
    .actions-col {
      text-align: right;
    }
    .btn-group {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }
    .action-btn {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--color-border);
      background-color: #ffffff;
      color: var(--color-text-muted);
      transition: all var(--transition-fast);
    }
    .action-btn:hover {
      transform: translateY(-1px);
    }
    .preview-btn:hover {
      color: var(--color-primary);
      border-color: var(--color-primary);
    }
    .edit-btn:hover {
      color: var(--color-accent);
      border-color: var(--color-accent);
      background-color: var(--color-accent-light);
    }
    .delete-btn:hover {
      color: var(--color-danger);
      border-color: var(--color-danger);
      background-color: #fee2e2;
    }
    .empty-table-row {
      text-align: center;
      padding: 3rem;
      color: #94a3b8;
    }
  `]
})
export class AdminProductsComponent implements OnInit {
  products = signal<Product[]>([]);
  displayedProducts = signal<Product[]>([]);
  isLoading = signal<boolean>(false);
  feedbackMessage = signal<string>('');
  isErrorFeedback = signal<boolean>(false);

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.productsService.getProducts().subscribe(items => {
      this.products.set(items);
      this.displayedProducts.set(items);
      this.isLoading.set(false);
    });
  }

  publishedCount(): number {
    return this.products().filter(p => p.isPublished).length;
  }

  filterTable(event: any): void {
    const term = event.target.value.toLowerCase().trim();
    if (!term) {
      this.displayedProducts.set(this.products());
      return;
    }
    const filtered = this.products().filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.sku.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
    this.displayedProducts.set(filtered);
  }

  togglePublish(prod: Product): void {
    const updatedStatus = !prod.isPublished;
    this.productsService.updateProduct(prod.id, { isPublished: updatedStatus }).subscribe({
      next: () => {
        prod.isPublished = updatedStatus;
        this.feedbackMessage.set(`Status updated: ${prod.name} is now ${updatedStatus ? 'Published' : 'Draft'}`);
        this.isErrorFeedback.set(false);
      },
      error: () => {
        this.feedbackMessage.set('Failed to update status.');
        this.isErrorFeedback.set(true);
      }
    });
  }

  confirmDelete(prod: Product): void {
    if (confirm(`Are you sure you want to delete "${prod.name}" (SKU: ${prod.sku})? This action cannot be undone.`)) {
      this.productsService.deleteProduct(prod.id).subscribe({
        next: () => {
          this.feedbackMessage.set(`Product "${prod.name}" was successfully removed.`);
          this.isErrorFeedback.set(false);
          this.products.update(list => list.filter(p => p.id !== prod.id));
          this.displayedProducts.update(list => list.filter(p => p.id !== prod.id));
        },
        error: () => {
          this.feedbackMessage.set('Failed to delete product.');
          this.isErrorFeedback.set(true);
        }
      });
    }
  }

  isNumeric(val: string | number): boolean {
    return typeof val === 'number' || !isNaN(Number(val));
  }

  handleImageError(event: any): void {
    event.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80';
  }
}
