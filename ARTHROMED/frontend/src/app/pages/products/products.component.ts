import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../core/models/product.model';
import { FilterBarComponent } from './components/filter-bar/filter-bar.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { LoadingSkeletonComponent } from '../../shared/components/loading-skeleton/loading-skeleton.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FilterBarComponent,
    ProductCardComponent,
    EmptyStateComponent,
    LoadingSkeletonComponent
  ],
  template: `
    <div class="catalog-page">
      <!-- Catalog Header Banner -->
      <section class="catalog-header-banner">
        <div class="container banner-inner">
          <div class="breadcrumb">
            <span>Home</span> &gt; <span class="current">Orthopedic & Breg Catalog</span>
          </div>
          <h1 class="catalog-title">Certified Orthopedic & Cold Therapy Equipment</h1>
          <p class="catalog-subtitle">
            Explore authentic Breg® bracing, motorized post-op cold therapy systems, and clinical trauma supports. All products feature pre-mapped HCPCS billing codes.
          </p>
        </div>
      </section>

      <!-- Main Catalog Content -->
      <section class="catalog-body-section container">
        <!-- Filter and Search Toolbar -->
        <app-filter-bar
          [selectedCategory]="category()"
          [searchQuery]="search()"
          [selectedSort]="sort()"
          (categoryChange)="onCategorySelected($event)"
          (searchChange)="onSearchChanged($event)"
          (sortChange)="onSortChanged($event)"
        ></app-filter-bar>

        <!-- Results Counter & Status -->
        <div class="results-meta-bar">
          <span class="count-text">
            Showing <strong>{{ filteredProducts().length }}</strong> orthopedic products
            @if (category() !== 'All') {
              in <span class="badge badge-teal">{{ category() }}</span>
            }
          </span>

          <span class="badge badge-hcpcs">CMS Billing Compatible</span>
        </div>

        <!-- Dynamic Content: Skeleton, Grid, or Empty State -->
        @if (isLoading()) {
          <app-loading-skeleton [count]="6"></app-loading-skeleton>
        } @else {
          @if (filteredProducts().length > 0) {
            <div class="products-grid">
              @for (prod of filteredProducts(); track prod.id) {
                <app-product-card [product]="prod"></app-product-card>
              }
            </div>
          } @else {
            <app-empty-state (resetFilters)="resetAllFilters()"></app-empty-state>
          }
        }
      </section>
    </div>
  `,
  styles: [`
    .catalog-page {
      padding-bottom: 6rem;
    }
    .catalog-header-banner {
      background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%);
      color: #ffffff;
      padding: 3.5rem 0 3.75rem;
      margin-bottom: 2.5rem;
    }
    .breadcrumb {
      font-size: 0.825rem;
      color: #94a3b8;
      margin-bottom: 0.75rem;
    }
    .breadcrumb .current {
      color: #5eead4;
      font-weight: 600;
    }
    .catalog-title {
      font-size: 2.45rem;
      color: #ffffff;
      margin-bottom: 0.75rem;
      letter-spacing: -0.02em;
    }
    @media (max-width: 640px) {
      .catalog-title { font-size: 1.85rem; }
    }
    .catalog-subtitle {
      font-size: 1.05rem;
      color: #cbd5e1;
      max-width: 720px;
      line-height: 1.6;
    }
    .results-meta-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--color-border);
    }
    .count-text {
      font-size: 0.925rem;
      color: var(--color-text-muted);
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }
    @media (max-width: 1024px) {
      .products-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 640px) {
      .products-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductsComponent implements OnInit {
  category = signal<string>('All');
  search = signal<string>('');
  sort = signal<string>('newest');

  filteredProducts = signal<Product[]>([]);
  isLoading = signal<boolean>(false);

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Read optional query params (e.g. /products?category=Cold Therapy)
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.category.set(params['category']);
      }
      if (params['search']) {
        this.search.set(params['search']);
      }
      if (params['sort']) {
        this.sort.set(params['sort']);
      }
      this.fetchData();
    });
  }

  fetchData(): void {
    this.isLoading.set(true);
    this.productsService.getProducts({
      category: this.category(),
      search: this.search(),
      sort: this.sort()
    }).subscribe(data => {
      // Filter out unpublished products for catalog view
      const published = data.filter(p => p.isPublished !== false);
      this.filteredProducts.set(published);
      this.isLoading.set(false);
    });
  }

  onCategorySelected(cat: string): void {
    this.category.set(cat);
    this.updateUrlParams();
    this.fetchData();
  }

  onSearchChanged(term: string): void {
    this.search.set(term);
    this.updateUrlParams();
    this.fetchData();
  }

  onSortChanged(sortValue: string): void {
    this.sort.set(sortValue);
    this.updateUrlParams();
    this.fetchData();
  }

  resetAllFilters(): void {
    this.category.set('All');
    this.search.set('');
    this.sort.set('newest');
    this.updateUrlParams();
    this.fetchData();
  }

  private updateUrlParams(): void {
    const queryParams: any = {};
    if (this.category() !== 'All') queryParams.category = this.category();
    if (this.search()) queryParams.search = this.search();
    if (this.sort() !== 'newest') queryParams.sort = this.sort();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'replace'
    });
  }
}
