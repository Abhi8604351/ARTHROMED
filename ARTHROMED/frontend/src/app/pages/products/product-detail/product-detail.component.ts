import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../../core/services/products.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="product-page-root">
      @if (isLoading()) {
        <div class="detail-loading-state">
          <div class="loading-spinner"></div>
          <p>Loading clinical product documentation...</p>
        </div>
      } @else if (product()) {
        <!-- Top Breadcrumbs Bar -->
        <nav class="breadcrumb-bar container">
          <a routerLink="/">Home</a>
          <span class="bc-sep">&gt;</span>
          <a routerLink="/products">Shop</a>
          <span class="bc-sep">&gt;</span>
          <a [routerLink]="['/products']" [queryParams]="{ category: product()!.category }">{{ product()!.category }}</a>
          <span class="bc-sep">&gt;</span>
          <span class="bc-current">{{ product()!.name }}</span>
        </nav>

        <!-- Main Product Presentation (Two Column Layout) -->
        <main class="container product-main-grid">
          <!-- Left Column: Gallery & Thumbnails -->
          <div class="gallery-column">
            <!-- Main Display Image Container -->
            <div class="main-image-display">
              <img
                [src]="currentMainImage()"
                [alt]="product()!.name"
                class="main-product-img"
                (error)="handleImageError($event)"
              />
            </div>

            <!-- 5 Clickable Thumbnails Gallery -->
            <div class="thumbnails-row">
              @for (thumb of galleryImages(); track $index) {
                <button
                  type="button"
                  class="thumb-item"
                  [class.active]="activeImageIndex() === $index"
                  (click)="setActiveImage($index)"
                  [title]="'View angle ' + ($index + 1)"
                >
                  <img [src]="thumb" [alt]="product()!.name + ' thumbnail ' + ($index + 1)" class="thumb-img" (error)="handleImageError($event)" />
                </button>
              }
            </div>
          </div>

          <!-- Right Column: Product Information & Purchase Suite -->
          <div class="product-info-column">
            <!-- Header Row: Title & Badge -->
            <div class="title-header-row">
              <div class="title-group">
                <h1 class="product-title">{{ product()!.name }}</h1>
                <div class="product-sub-meta">
                  <span class="category-meta">{{ product()!.category }}</span>
                  <span class="meta-dot">|</span>
                  <span class="size-meta">Size: {{ selectedSize() }}</span>
                  <span class="meta-dot">|</span>
                  <div class="rating-stars">
                    <span class="stars-gold">★★★★★</span>
                    <span class="rating-num">4.8</span>
                  </div>
                </div>
              </div>

              <!-- Top Right Badge -->
              <div class="badge-container">
                <span class="pill-badge best-seller-pill">FDA Cleared</span>
              </div>
            </div>

            <!-- PRICE / CLINICAL QUOTE SECTION WITH PROMINENT WHATSAPP QUERY BUTTON -->
            <div class="price-section-container">
              <div class="price-action-row">
                <div class="quote-info-stack">
                  <div class="quote-primary-title">
                    <span class="quote-badge">Doctor & Hospital Pricing</span>
                    <span class="quote-status">Custom Quote on Request</span>
                  </div>
                  <span class="quote-subtext">Pricing varies per doctor tier, clinic volume & surgical protocol</span>
                </div>

                <!-- Prominent WhatsApp Query Button in Price Section -->
                <a
                  [href]="getWhatsAppUrl()"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-price-whatsapp"
                  title="Inquire directly on WhatsApp"
                >
                  <svg class="wa-svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/>
                  </svg>
                  <span>Request WhatsApp Quote</span>
                </a>
              </div>

              <!-- Social Proof Counter Pill -->
              <div class="social-proof-bar">
                <span class="proof-leaf">🌿</span>
                <span class="proof-text">89 clinics & orthopedic specialists partnered recently</span>
              </div>
            </div>

            <!-- Size Selection (if multiple sizes available) -->
            @if (product()!.sizes && product()!.sizes.length > 0) {
              <div class="sizes-row-container">
                <span class="micro-section-label">Select Anatomical Size:</span>
                <div class="size-pills-list">
                  @for (s of product()!.sizes; track s) {
                    <button
                      type="button"
                      class="size-pill-btn"
                      [class.selected]="selectedSize() === s"
                      (click)="selectedSize.set(s)"
                    >
                      {{ s }}
                    </button>
                  }
                </div>
              </div>
            }

            <!-- Amount & Practice Tier Selection -->
            <div class="amount-method-container">
              <span class="micro-section-label">Order Scope & Practice Tier</span>

              <!-- Stepper & Stock indicator -->
              <div class="stepper-stock-row">
                <div class="stepper-widget">
                  <button type="button" class="step-btn" (click)="decreaseQty()" [disabled]="quantity() <= 1">−</button>
                  <span class="step-value">{{ quantity() }}</span>
                  <button type="button" class="step-btn" (click)="increaseQty()">+</button>
                </div>
                <span class="stock-status-text">Clinical warehouse stock: Ready for dispatch</span>
              </div>

              <!-- Order Scope Radios -->
              <div class="purchase-radios">
                <label class="radio-option-card" [class.active]="purchaseOption() === 'prescription'">
                  <input
                    type="radio"
                    name="orderType"
                    value="prescription"
                    [checked]="purchaseOption() === 'prescription'"
                    (change)="purchaseOption.set('prescription')"
                  />
                  <span class="radio-circle"></span>
                  <span class="radio-title">Individual Doctor / Patient Prescription</span>
                  <span class="radio-tier-tag">Custom Quote</span>
                </label>

                <label class="radio-option-card" [class.active]="purchaseOption() === 'bulk'">
                  <input
                    type="radio"
                    name="orderType"
                    value="bulk"
                    [checked]="purchaseOption() === 'bulk'"
                    (change)="purchaseOption.set('bulk')"
                  />
                  <span class="radio-circle"></span>
                  <span class="radio-title">Surgery Center & Clinic Bulk Supply</span>
                  <span class="radio-tier-tag">Contract Pricing</span>
                </label>
              </div>
            </div>

            <!-- Primary Action Buttons -->
            <div class="actions-buttons-stack">
              <!-- WhatsApp Quote Direct CTA -->
              <a
                [href]="getWhatsAppUrl()"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-add-to-cart btn-wa-quote"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/>
                </svg>
                <span>Request Doctor Quote via WhatsApp</span>
              </a>

              <!-- Favorite Button -->
              <button
                type="button"
                class="btn btn-favorite-toggle"
                [class.favorited]="isFavorited()"
                (click)="toggleFavorite()"
              >
                <span>Bookmark Device</span>
                <span class="fav-heart">{{ isFavorited() ? '♥' : '♡' }}</span>
              </button>
            </div>

            <!-- Tabbed Information Area -->
            <div class="tabbed-info-widget">
              <!-- Horizontal Tabs Bar -->
              <div class="tabs-header-bar">
                <button
                  type="button"
                  class="tab-btn"
                  [class.active]="activeTab() === 'howToUse'"
                  (click)="activeTab.set('howToUse')"
                >
                  How to use
                </button>
                <button
                  type="button"
                  class="tab-btn"
                  [class.active]="activeTab() === 'benefit'"
                  (click)="activeTab.set('benefit')"
                >
                  Benefit
                </button>
                <button
                  type="button"
                  class="tab-btn"
                  [class.active]="activeTab() === 'ingredients'"
                  (click)="activeTab.set('ingredients')"
                >
                  Ingredients & Specs
                </button>
                <button
                  type="button"
                  class="tab-btn"
                  [class.active]="activeTab() === 'returnPolicy'"
                  (click)="activeTab.set('returnPolicy')"
                >
                  Return Policy
                </button>
              </div>

              <!-- Tab Content Bodies -->
              <div class="tab-body-area">
                <!-- Tab 1: How to use -->
                @if (activeTab() === 'howToUse') {
                  <div class="tab-pane animate-fade">
                    <p class="tab-paragraph">
                      We always recommend consulting your orthopedic specialist or surgeon before fitting any post-operative bracing or motorized cold therapy system. Ensure correct anatomical alignment around the joint prior to securing strap tensioners.
                    </p>
                    <p class="tab-paragraph">
                      For optimal therapeutic benefit, utilize the system in prescribed 20-to-30 minute compression and cooling cycles. Ensure all pneumatic couplings are firmly locked into place before initiating motor circulation.
                    </p>
                    @if (product()!.fittingGuideUrl) {
                      <div class="fitting-guide-action">
                        <a [href]="product()!.fittingGuideUrl" target="_blank" rel="noopener noreferrer" class="link-download-guide">
                          <span>📄 Download Official Breg® Fitting Guide (PDF)</span>
                        </a>
                      </div>
                    }
                  </div>
                }

                <!-- Tab 2: Benefit -->
                @if (activeTab() === 'benefit') {
                  <div class="tab-pane animate-fade">
                    <p class="tab-paragraph">
                      {{ product()!.fullDescription }}
                    </p>
                    <ul class="tab-benefits-list">
                      @for (feat of product()!.keyFeatures; track feat) {
                        <li>
                          <span class="bullet-check">✓</span>
                          <span>{{ feat }}</span>
                        </li>
                      }
                    </ul>
                  </div>
                }

                <!-- Tab 3: Ingredients / Specifications -->
                @if (activeTab() === 'ingredients') {
                  <div class="tab-pane animate-fade">
                    <div class="specs-mini-table">
                      <div class="spec-row">
                        <span class="s-label">HCPCS Code</span>
                        <span class="s-val">{{ product()!.hcpcsCode || 'Billing eligible' }}</span>
                      </div>
                      <div class="spec-row">
                        <span class="s-label">Manufacturer</span>
                        <span class="s-val">Breg® Medical Orthopedics</span>
                      </div>
                      <div class="spec-row">
                        <span class="s-label">SKU Tracking</span>
                        <span class="s-val">{{ product()!.sku }}</span>
                      </div>
                      @for (item of product()!.specs; track item.label) {
                        <div class="spec-row">
                          <span class="s-label">{{ item.label }}</span>
                          <span class="s-val">{{ item.value }}</span>
                        </div>
                      }
                    </div>
                  </div>
                }

                <!-- Tab 4: Return Policy -->
                @if (activeTab() === 'returnPolicy') {
                  <div class="tab-pane animate-fade">
                    <p class="tab-paragraph">
                      All Breg® orthopedic and cold therapy devices are backed by a 1-year manufacturer warranty against mechanical or manufacturing defects.
                    </p>
                    <p class="tab-paragraph">
                      For hygiene and clinical infection control compliance, products must be returned in their original, unopened sterile packaging within 30 days of delivery.
                    </p>
                    <p class="tab-paragraph">
                      Priority clinic orders ship within 24 to 48 hours directly to surgical centers and residential patient addresses across the United States.
                    </p>
                  </div>
                }
              </div>
            </div>
          </div>
        </main>

        <!-- "You might also like" Section -->
        <section class="related-products-section">
          <div class="container">
            <div class="related-header-row">
              <h2 class="related-section-title">You might also like</h2>
              <div class="carousel-nav-arrows">
                <button type="button" class="arrow-btn" (click)="scrollRelated(-1)" aria-label="Previous">←</button>
                <button type="button" class="arrow-btn" (click)="scrollRelated(1)" aria-label="Next">→</button>
              </div>
            </div>

            <!-- Related Products Grid -->
            <div class="related-grid">
              @for (rel of relatedProducts(); track rel.id) {
                <div class="related-card" [routerLink]="['/products', rel.id]" (click)="scrollToTop()">
                  <div class="rel-image-box">
                    <img [src]="rel.imageUrl" [alt]="rel.name" class="rel-img" (error)="handleImageError($event)" />
                  </div>
                  <div class="rel-info-box">
                    <h3 class="rel-product-title">{{ rel.name }}</h3>
                    <div class="rel-price-row">
                      <span class="rel-quote-badge">Doctor Quote Available</span>
                    </div>
                    <div class="rel-rating-stars">
                      <span class="stars-gold">★★★★★</span>
                      <span class="rating-val">4.8</span>
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- More products CTA button -->
            <div class="more-products-cta-wrap">
              <a routerLink="/products" class="btn btn-more-products">
                <span>More products →</span>
              </a>
            </div>
          </div>
        </section>

        <!-- Bottom Newsletter / Consultation Banner -->
        <section class="newsletter-strip">
          <div class="container newsletter-inner">
            <h2 class="newsletter-heading">Subscribe for Clinical Updates & Orthopedic Guidelines</h2>
            <form (ngSubmit)="handleNewsletterSubmit()" class="newsletter-form">
              <div class="input-arrow-box">
                <input
                  type="email"
                  name="email"
                  [(ngModel)]="newsletterEmail"
                  placeholder="Enter clinic email address"
                  class="newsletter-input"
                  required
                />
                <button type="submit" class="newsletter-arrow-btn" aria-label="Subscribe">
                  <span>→</span>
                </button>
              </div>
              @if (newsletterSubmitted()) {
                <span class="newsletter-thankyou">Thank you for subscribing! Clinical protocol updates will be sent.</span>
              }
            </form>
          </div>
        </section>
      } @else {
        <!-- Not Found -->
        <div class="container not-found-state">
          <h2>Product Not Found</h2>
          <p>The requested orthopedic device is unavailable or has been archived.</p>
          <a routerLink="/products" class="btn btn-return">Return to Products</a>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #f7f9f7;
      color: #1f2937;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }

    .container {
      max-width: 1240px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    /* Loading & Not Found */
    .detail-loading-state, .not-found-state {
      padding: 6rem 1.5rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
      min-height: 50vh;
      justify-content: center;
    }
    .loading-spinner {
      width: 44px;
      height: 44px;
      border: 3.5px solid #d1ded4;
      border-top-color: #2b513f;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Top Breadcrumbs */
    .breadcrumb-bar {
      padding: 1.5rem 1.5rem 1.25rem;
      font-size: 0.825rem;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .breadcrumb-bar a {
      color: #64748b;
      text-decoration: none;
      transition: color 0.2s;
    }
    .breadcrumb-bar a:hover {
      color: #2b513f;
      text-decoration: underline;
    }
    .bc-sep {
      color: #94a3b8;
    }
    .bc-current {
      color: #1e293b;
      font-weight: 700;
    }

    /* Product Main Grid (Two Columns) */
    .product-main-grid {
      display: grid;
      grid-template-columns: 1fr 1.08fr;
      gap: 3.5rem;
      margin-bottom: 5rem;
      align-items: start;
    }
    @media (max-width: 992px) {
      .product-main-grid {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }
    }

    /* Left Gallery Column */
    .gallery-column {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .main-image-display {
      background-color: #e8eee8;
      border-radius: 12px;
      height: 540px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 2rem;
      border: 1px solid #dce4dc;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    }
    @media (max-width: 640px) {
      .main-image-display {
        height: 380px;
        padding: 1rem;
      }
    }
    .main-product-img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 14px 20px rgba(0, 0, 0, 0.12));
      transition: transform 0.3s ease;
    }
    .main-product-img:hover {
      transform: scale(1.03);
    }

    /* Thumbnails Row */
    .thumbnails-row {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 0.85rem;
    }
    .thumb-item {
      background-color: #e8eee8;
      border: 1.5px solid transparent;
      border-radius: 8px;
      height: 90px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.4rem;
      cursor: pointer;
      transition: all 0.2s ease;
      overflow: hidden;
    }
    .thumb-item:hover {
      border-color: #2b513f;
      transform: translateY(-2px);
    }
    .thumb-item.active {
      border-color: #2b513f;
      background-color: #dfe7df;
      box-shadow: 0 2px 8px rgba(43, 81, 63, 0.2);
    }
    .thumb-img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    /* Right Info Column */
    .product-info-column {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    /* Title & Badge Row */
    .title-header-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
    }
    .product-title {
      font-size: 2.25rem;
      font-weight: 800;
      color: #1e3329;
      line-height: 1.15;
      letter-spacing: -0.015em;
      margin-bottom: 0.5rem;
    }
    @media (max-width: 640px) {
      .product-title {
        font-size: 1.75rem;
      }
    }
    .product-sub-meta {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      font-size: 0.875rem;
      color: #526057;
      flex-wrap: wrap;
    }
    .meta-dot {
      color: #cbd5e1;
    }
    .rating-stars {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }
    .stars-gold {
      color: #1e3329;
      letter-spacing: 1px;
      font-size: 0.85rem;
    }
    .rating-num {
      font-weight: 700;
      color: #1e3329;
    }
    .pill-badge {
      display: inline-block;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 0.3rem 0.75rem;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
    }
    .best-seller-pill {
      background-color: #8c9e90;
      color: #ffffff;
    }

    /* PRICE SECTION CONTAINER */
    .price-section-container {
      background-color: #edf3ed;
      border: 1px solid #dce4dc;
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }
    .price-action-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .quote-info-stack {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .quote-primary-title {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .quote-badge {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #166534;
      background-color: #dcfce7;
      padding: 0.2rem 0.55rem;
      border-radius: 4px;
      display: inline-block;
      width: fit-content;
    }
    .quote-status {
      font-size: 1.65rem;
      font-weight: 800;
      color: #1b3026;
      line-height: 1.15;
    }
    .quote-subtext {
      font-size: 0.82rem;
      color: #55695e;
      line-height: 1.4;
    }

    /* WhatsApp Button inside Price Section */
    .btn-price-whatsapp {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
      color: #ffffff;
      padding: 0.7rem 1.35rem;
      border-radius: 30px;
      font-size: 0.9rem;
      font-weight: 700;
      text-decoration: none;
      box-shadow: 0 4px 14px rgba(37, 211, 102, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4);
      transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      cursor: pointer;
    }
    .btn-price-whatsapp:hover {
      transform: translateY(-2px) scale(1.03);
      box-shadow: 0 8px 20px rgba(37, 211, 102, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.6);
      background: linear-gradient(135deg, #2ee06e 0%, #0e7b6e 100%);
    }
    .btn-price-whatsapp:active {
      transform: translateY(1px) scale(0.97);
    }
    .wa-svg {
      flex-shrink: 0;
    }

    /* Social proof bar */
    .social-proof-bar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background-color: #dfe7df;
      padding: 0.45rem 0.85rem;
      border-radius: 6px;
      font-size: 0.785rem;
      color: #274737;
      font-weight: 600;
    }
    .proof-leaf {
      font-size: 0.9rem;
    }

    /* Size selector pills */
    .sizes-row-container {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .micro-section-label {
      font-size: 0.785rem;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .size-pills-list {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .size-pill-btn {
      padding: 0.45rem 0.95rem;
      border-radius: 6px;
      border: 1.5px solid #cbd5e1;
      background-color: #ffffff;
      color: #1e293b;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .size-pill-btn:hover {
      border-color: #2b513f;
    }
    .size-pill-btn.selected {
      background-color: #2b513f;
      color: #ffffff;
      border-color: #2b513f;
    }

    /* Amount & Method */
    .amount-method-container {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }
    .stepper-stock-row {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .stepper-widget {
      display: inline-flex;
      align-items: center;
      background-color: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      overflow: hidden;
    }
    .step-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      font-size: 1.15rem;
      color: #1e293b;
      cursor: pointer;
      transition: background 0.2s;
    }
    .step-btn:hover:not(:disabled) {
      background-color: #f1f5f9;
    }
    .step-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .step-value {
      width: 36px;
      text-align: center;
      font-weight: 700;
      font-size: 0.95rem;
      color: #1e293b;
    }
    .stock-status-text {
      font-size: 0.785rem;
      color: #64748b;
    }

    /* Purchase Option Cards */
    .purchase-radios {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .radio-option-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.85rem 1rem;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .radio-option-card input {
      display: none;
    }
    .radio-circle {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid #94a3b8;
      margin-right: 0.75rem;
      display: inline-block;
      position: relative;
      flex-shrink: 0;
      transition: all 0.2s;
    }
    .radio-option-card.active {
      border-color: #2b513f;
      background-color: #f5f9f6;
    }
    .radio-option-card.active .radio-circle {
      border-color: #2b513f;
      background-color: #2b513f;
      box-shadow: inset 0 0 0 3px #ffffff;
    }
    .radio-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1e293b;
      flex: 1;
    }
    .radio-tier-tag {
      font-size: 0.825rem;
      font-weight: 700;
      color: #166534;
      background-color: #dcfce7;
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
    }

    /* Action Buttons Stack */
    .actions-buttons-stack {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .btn-add-to-cart {
      width: 100%;
      padding: 1rem;
      background-color: #1d3328;
      color: #ffffff;
      border: none;
      border-radius: 6px;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.25s ease;
      box-shadow: 0 4px 12px rgba(29, 51, 40, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      text-decoration: none;
    }
    .btn-wa-quote {
      background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
      box-shadow: 0 4px 14px rgba(37, 211, 102, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4);
    }
    .btn-wa-quote:hover {
      background: linear-gradient(135deg, #2ee06e 0%, #0e7b6e 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(37, 211, 102, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.5);
    }
    .btn-wa-quote:active {
      transform: translateY(1px);
    }
    .btn-favorite-toggle {
      width: 100%;
      padding: 0.85rem;
      background-color: transparent;
      color: #1e293b;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }
    .btn-favorite-toggle:hover {
      background-color: #f1f5f9;
      border-color: #94a3b8;
    }
    .btn-favorite-toggle.favorited {
      color: #e11d48;
      border-color: #fda4af;
      background-color: #fff1f2;
    }
    .fav-heart {
      font-size: 1.1rem;
    }

    /* Tabbed Information Widget */
    .tabbed-info-widget {
      margin-top: 1rem;
      border-top: 1px solid #e2e8f0;
      padding-top: 1.25rem;
    }
    .tabs-header-bar {
      display: flex;
      gap: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 0.5rem;
      overflow-x: auto;
    }
    .tab-btn {
      background: none;
      border: none;
      font-size: 0.875rem;
      font-weight: 600;
      color: #64748b;
      cursor: pointer;
      padding: 0.4rem 0.2rem;
      position: relative;
      white-space: nowrap;
      transition: color 0.2s;
    }
    .tab-btn:hover {
      color: #1e3329;
    }
    .tab-btn.active {
      color: #1e3329;
      font-weight: 700;
    }
    .tab-btn.active::after {
      content: '';
      position: absolute;
      bottom: -0.55rem;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #1e3329;
    }
    .tab-body-area {
      padding-top: 1.25rem;
    }
    .tab-paragraph {
      font-size: 0.85rem;
      color: #475569;
      line-height: 1.7;
      margin-bottom: 0.85rem;
    }
    .fitting-guide-action {
      margin-top: 1rem;
    }
    .link-download-guide {
      display: inline-block;
      color: #128C7E;
      font-size: 0.85rem;
      font-weight: 700;
      text-decoration: none;
    }
    .link-download-guide:hover {
      text-decoration: underline;
    }
    .tab-benefits-list {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .tab-benefits-list li {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: #475569;
      line-height: 1.5;
    }
    .bullet-check {
      color: #2b513f;
      font-weight: 800;
    }
    .specs-mini-table {
      display: flex;
      flex-direction: column;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
    }
    .spec-row {
      display: flex;
      padding: 0.65rem 1rem;
      font-size: 0.825rem;
      border-bottom: 1px solid #f1f5f9;
    }
    .spec-row:last-child { border-bottom: none; }
    .spec-row:nth-child(even) { background-color: #f8fafc; }
    .s-label {
      width: 40%;
      font-weight: 600;
      color: #64748b;
    }
    .s-val {
      width: 60%;
      font-weight: 700;
      color: #1e293b;
    }

    /* "You might also like" Section */
    .related-products-section {
      padding: 4.5rem 0 3.5rem;
      background-color: #f2f6f2;
      border-top: 1px solid #e2e8f0;
    }
    .related-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2.5rem;
    }
    .related-section-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1e3329;
      letter-spacing: -0.015em;
    }
    .carousel-nav-arrows {
      display: flex;
      gap: 0.75rem;
    }
    .arrow-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #1e293b;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .arrow-btn:hover {
      background-color: #1e3329;
      color: #ffffff;
      border-color: #1e3329;
    }

    /* Related Grid */
    .related-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.75rem;
      margin-bottom: 3rem;
    }
    @media (max-width: 992px) {
      .related-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 580px) {
      .related-grid {
        grid-template-columns: 1fr;
      }
    }
    .related-card {
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.25s ease;
      display: flex;
      flex-direction: column;
      border: 1px solid #e2e8f0;
    }
    .related-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
      border-color: #cbd5e1;
    }
    .rel-image-box {
      background-color: #e5ede5;
      height: 240px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .rel-img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.08));
    }
    .rel-info-box {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .rel-product-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .rel-price-row {
      display: flex;
      align-items: center;
      margin-top: 0.15rem;
    }
    .rel-quote-badge {
      font-size: 0.775rem;
      font-weight: 700;
      color: #166534;
      background-color: #dcfce7;
      padding: 0.2rem 0.55rem;
      border-radius: 4px;
      display: inline-block;
    }
    .rel-rating-stars {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.75rem;
      margin-top: 0.2rem;
    }
    .rating-val {
      font-weight: 700;
      color: #475569;
    }

    .more-products-cta-wrap {
      text-align: center;
    }
    .btn-more-products {
      display: inline-flex;
      align-items: center;
      padding: 0.65rem 1.5rem;
      border: 1px solid #1e3329;
      border-radius: 4px;
      color: #1e3329;
      font-size: 0.875rem;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-more-products:hover {
      background-color: #1e3329;
      color: #ffffff;
    }

    /* Newsletter / Consultation Strip */
    .newsletter-strip {
      background-color: #8c9e90;
      color: #ffffff;
      padding: 4rem 0;
    }
    .newsletter-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 3rem;
      flex-wrap: wrap;
    }
    .newsletter-heading {
      font-size: 2.15rem;
      font-weight: 600;
      max-width: 500px;
      line-height: 1.25;
      letter-spacing: -0.015em;
    }
    .newsletter-form {
      flex: 1;
      max-width: 480px;
      min-width: 280px;
    }
    .input-arrow-box {
      display: flex;
      background-color: #ffffff;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    .newsletter-input {
      flex: 1;
      padding: 1rem 1.25rem;
      border: none;
      outline: none;
      font-size: 0.95rem;
      color: #1e293b;
    }
    .newsletter-arrow-btn {
      background-color: transparent;
      border: none;
      padding: 0 1.25rem;
      font-size: 1.4rem;
      color: #1e3329;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .newsletter-arrow-btn:hover {
      transform: translateX(4px);
    }
    .newsletter-thankyou {
      display: block;
      margin-top: 0.5rem;
      font-size: 0.85rem;
      color: #e2f0e6;
      font-weight: 600;
    }

    /* Animations */
    .animate-fade {
      animation: fadeIn 0.3s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | undefined>(undefined);
  isLoading = signal<boolean>(true);
  selectedSize = signal<string>('Universal');

  // Quantity and Purchase options
  quantity = signal<number>(1);
  purchaseOption = signal<'prescription' | 'bulk'>('prescription');
  addedToCart = signal<boolean>(false);
  isFavorited = signal<boolean>(false);

  // Gallery
  activeImageIndex = signal<number>(0);
  galleryImages = signal<string[]>([]);

  // Active Tab
  activeTab = signal<'howToUse' | 'benefit' | 'ingredients' | 'returnPolicy'>('howToUse');

  // Related Products
  relatedProducts = signal<Product[]>([]);

  // Newsletter
  newsletterEmail = '';
  newsletterSubmitted = signal<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchProduct(id);
      }
    });
  }

  fetchProduct(id: string): void {
    this.isLoading.set(true);
    this.activeImageIndex.set(0);

    this.productsService.getProductById(id).subscribe(item => {
      this.product.set(item);

      if (item) {
        if (item.sizes && item.sizes.length > 0) {
          this.selectedSize.set(item.sizes[0]);
        }

        // Generate 5 gallery images matching the reference design layout
        this.galleryImages.set([
          item.imageUrl,
          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80'
        ]);

        // Load 4 related products for "You might also like"
        this.productsService.getProducts().subscribe(all => {
          const filtered = all.filter(p => p.id !== item.id).slice(0, 4);
          this.relatedProducts.set(filtered);
        });
      }

      this.isLoading.set(false);
    });
  }

  currentMainImage = computed(() => {
    const images = this.galleryImages();
    const idx = this.activeImageIndex();
    if (images.length > 0 && images[idx]) {
      return images[idx];
    }
    return this.product()?.imageUrl || '';
  });

  setActiveImage(index: number): void {
    this.activeImageIndex.set(index);
  }

  increaseQty(): void {
    this.quantity.update(q => q + 1);
  }

  decreaseQty(): void {
    this.quantity.update(q => (q > 1 ? q - 1 : 1));
  }

  handleAddToCart(): void {
    this.addedToCart.set(true);
    setTimeout(() => {
      this.addedToCart.set(false);
    }, 3000);
  }

  toggleFavorite(): void {
    this.isFavorited.update(f => !f);
  }

  getWhatsAppUrl(): string {
    if (!this.product()) return this.productsService.getWhatsAppInquiryUrl();
    const p = this.product()!;
    const scopeName = this.purchaseOption() === 'prescription'
      ? 'Doctor/Patient Prescription'
      : 'Surgery Center / Clinic Bulk Supply';
    const nameWithSize = `${p.name} (Qty: ${this.quantity()}, Size: ${this.selectedSize()}, Practice Tier: ${scopeName})`;
    return this.productsService.getWhatsAppInquiryUrl(nameWithSize, p.sku);
  }

  handleNewsletterSubmit(): void {
    if (this.newsletterEmail) {
      this.newsletterSubmitted.set(true);
      setTimeout(() => {
        this.newsletterEmail = '';
        this.newsletterSubmitted.set(false);
      }, 4000);
    }
  }

  handleImageError(event: any): void {
    event.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80';
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollRelated(direction: number): void {
    const grid = document.querySelector('.related-grid');
    if (grid) {
      grid.scrollBy({ left: direction * 280, behavior: 'smooth' });
    }
  }
}
