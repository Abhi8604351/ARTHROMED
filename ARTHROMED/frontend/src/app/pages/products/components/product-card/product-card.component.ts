import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../core/models/product.model';
import { ProductsService } from '../../../../core/services/products.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="product-card card">
      <!-- Card Image Header -->
      <div class="card-image-box">
        <a [routerLink]="['/products', product.id]" class="img-link">
          <img
            [src]="product.imageUrl"
            [alt]="product.name"
            class="product-thumb"
            loading="lazy"
            (error)="handleImageError($event)"
          />
        </a>

        <!-- Top Badges -->
        <div class="image-overlay-badges">
          <span class="badge badge-teal">{{ product.category }}</span>
          @if (product.hcpcsCode) {
            <span class="badge badge-hcpcs" title="CMS HCPCS Billing Code">
              HCPCS: {{ product.hcpcsCode }}
            </span>
          }
        </div>
      </div>

      <!-- Card Content -->
      <div class="card-info">
        <div class="sku-row">
          <span class="sku-code">SKU: {{ product.sku }}</span>
          <span class="stock-status">In Clinic Stock</span>
        </div>

        <h3 class="product-name">
          <a [routerLink]="['/products', product.id]">{{ product.name }}</a>
        </h3>

        <p class="product-description">{{ product.shortDescription }}</p>

        <!-- Available Sizes Chips -->
        <div class="sizes-row">
          <span class="sizes-label">Sizes:</span>
          <div class="sizes-list">
            @for (size of product.sizes; track size) {
              <span class="size-pill">{{ size }}</span>
            }
          </div>
        </div>

        <!-- Pricing & Action Buttons -->
        <div class="card-bottom">
          <div class="price-box">
            <span class="price-label">Pricing Model</span>
            <div class="price-value quote-tag">Quote on Request</div>
          </div>

          <div class="card-actions">
            <a [routerLink]="['/products', product.id]" class="btn btn-outline btn-sm">
              <span>View Details</span>
            </a>

            <a
              [href]="getWhatsAppUrl()"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-whatsapp btn-sm wa-card-btn"
              title="Request Quote on WhatsApp"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/>
              </svg>
              <span>Quote</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      height: 100%;
      background-color: #ffffff;
    }
    .card-image-box {
      position: relative;
      height: 220px;
      background-color: #f1f5f9;
      overflow: hidden;
    }
    .img-link {
      display: block;
      width: 100%;
      height: 100%;
    }
    .product-thumb {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
    .product-card:hover .product-thumb {
      transform: scale(1.05);
    }
    .image-overlay-badges {
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
      right: 0.75rem;
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
      pointer-events: none;
    }
    .card-info {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    .sku-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.4rem;
    }
    .sku-code {
      font-size: 0.75rem;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.04em;
    }
    .stock-status {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--color-accent);
      background-color: var(--color-accent-light);
      padding: 0.15rem 0.45rem;
      border-radius: var(--radius-full);
    }
    .product-name {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--color-primary);
      margin-bottom: 0.6rem;
      line-height: 1.35;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .product-name a:hover {
      color: var(--color-accent);
    }
    .product-description {
      font-size: 0.865rem;
      color: var(--color-text-muted);
      line-height: 1.5;
      margin-bottom: 1.25rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .sizes-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      margin-top: auto;
    }
    .sizes-label {
      font-size: 0.75rem;
      font-weight: 700;
      color: #64748b;
    }
    .sizes-list {
      display: flex;
      gap: 0.35rem;
      flex-wrap: wrap;
    }
    .size-pill {
      font-size: 0.7rem;
      font-weight: 700;
      background-color: #f1f5f9;
      color: var(--color-primary);
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      border: 1px solid var(--color-border);
    }
    .card-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding-top: 1rem;
      border-top: 1px solid var(--color-border);
    }
    .price-box {
      display: flex;
      flex-direction: column;
    }
    .price-label {
      font-size: 0.68rem;
      color: #94a3b8;
      font-weight: 600;
      text-transform: uppercase;
    }
    .price-value {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--color-primary);
    }
    .price-value.quote-tag {
      font-size: 0.95rem;
      font-weight: 700;
      color: #0d9488;
      background-color: #f0fdfa;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      border: 1px solid #ccfbf1;
      display: inline-block;
    }
    .card-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .wa-card-btn {
      padding: 0.45rem 0.75rem;
    }
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  constructor(private productsService: ProductsService) {}

  isNumericPrice(price: string | number): boolean {
    return typeof price === 'number' || !isNaN(Number(price));
  }

  getWhatsAppUrl(): string {
    return this.productsService.getWhatsAppInquiryUrl(this.product.name, this.product.sku);
  }

  handleImageError(event: any): void {
    // Fallback if image fails to load
    event.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80';
  }
}
