import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../../../core/services/products.service';

@Component({
  selector: 'app-cta-banner',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="cta-banner-section">
      <div class="container">
        <div class="cta-inner card">
          <div class="cta-decor-circle"></div>
          <div class="cta-content">
            <span class="cta-badge">Immediate Clinic Dispatch & Patient Fitting</span>
            <h2 class="cta-title">Ready to Equip Your Clinic or Support a Patient Recovery?</h2>
            <p class="cta-sub">
              Connect directly with our clinical orthotist team. We provide custom clinic tier pricing, same-day fulfillment, insurance documentation, and personalized sizing recommendations.
            </p>
            <div class="cta-actions">
              <a [href]="whatsAppUrl" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/>
                </svg>
                <span>Direct WhatsApp Inquiry</span>
              </a>

              <a routerLink="/products" class="btn btn-outline-white btn-lg">
                <span>Browse All Braces & Units</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .cta-banner-section {
      padding: 5rem 0 6rem;
      background-color: var(--color-surface-bg);
    }
    .cta-inner {
      background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 70%, #1e3a5f 100%);
      color: #ffffff;
      padding: 4.5rem 3.5rem;
      border-radius: 24px;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: var(--shadow-xl);
    }
    @media (max-width: 640px) {
      .cta-inner {
        padding: 3rem 1.5rem;
      }
    }
    .cta-decor-circle {
      position: absolute;
      top: -100px;
      right: -100px;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(13, 148, 136, 0.28) 0%, rgba(255, 255, 255, 0) 70%);
      border-radius: 50%;
      pointer-events: none;
    }
    .cta-content {
      position: relative;
      z-index: 2;
      max-width: 760px;
      margin: 0 auto;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
    }
    .cta-badge {
      display: inline-block;
      background: rgba(13, 148, 136, 0.2);
      color: #5eead4;
      border: 1px solid rgba(45, 212, 191, 0.35);
      padding: 0.3rem 0.95rem;
      border-radius: var(--radius-full);
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .cta-title {
      font-size: 2.5rem;
      color: #ffffff;
      line-height: 1.2;
      letter-spacing: -0.02em;
    }
    @media (max-width: 640px) {
      .cta-title { font-size: 1.85rem; }
    }
    .cta-sub {
      font-size: 1.1rem;
      color: #cbd5e1;
      line-height: 1.65;
    }
    .cta-actions {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      margin-top: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    }
    .btn-lg {
      padding: 0.95rem 1.85rem;
      font-size: 1.05rem;
      border-radius: 12px;
    }
    .btn-outline-white {
      border: 2px solid rgba(255, 255, 255, 0.4);
      color: #ffffff;
      background: transparent;
    }
    .btn-outline-white:hover {
      border-color: #ffffff;
      background: rgba(255, 255, 255, 0.1);
    }
  `]
})
export class CtaBannerComponent {
  whatsAppUrl: string;

  constructor(private productsService: ProductsService) {
    this.whatsAppUrl = this.productsService.getWhatsAppInquiryUrl();
  }
}
