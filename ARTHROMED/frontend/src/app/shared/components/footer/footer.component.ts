import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ProductsService } from '../../../core/services/products.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container footer-content">
        <!-- Brand & Description Column -->
        <div class="footer-col brand-col">
          <a routerLink="/" (click)="scrollToTop($event)" class="footer-brand" title="ArthroMed - Healthcare for better life !">
            <div class="footer-logo-card">
              <img
                src="/Breg/Logo.png"
                alt="ArthroMed - Healthcare for better life !"
                class="footer-logo-img"
              />
            </div>
          </a>
          <p class="footer-desc">
            ArthroMed is a premier orthopedic medical equipment distributor specializing in Breg® clinical braces, T Scope Premier post-op mobility devices, and cold compression therapy systems for clinics, surgeons, and patients.
          </p>
          <div class="contact-pill">
            <span class="phone-label">Direct WhatsApp Hotline:</span>
            <a [href]="whatsAppUrl" target="_blank" rel="noopener noreferrer" class="phone-val" style="color: #4ade80; text-decoration: none;">+91 8604351930</a>
          </div>
        </div>

        <!-- Orthopedic Categories -->
        <div class="footer-col">
          <h4 class="col-title">Product Categories</h4>
          <ul class="footer-links">
            <li><a routerLink="/products" [queryParams]="{ category: 'Knee' }">Breg® T Scope & Knee Braces</a></li>
            <li><a routerLink="/products" [queryParams]="{ category: 'Shoulder' }">Shoulder Slings & Rotator Cuff</a></li>
            <li><a routerLink="/products" [queryParams]="{ category: 'Cold Therapy' }">Breg Polar Care Cold Systems</a></li>
            <li><a routerLink="/products" [queryParams]="{ category: 'Spine' }">Spinal Orthotics & LSO Supports</a></li>
            <li><a routerLink="/products" [queryParams]="{ category: 'Foot & Ankle' }">Pneumatic Walker Boots</a></li>
          </ul>
        </div>

        <!-- Quick Links -->
        <div class="footer-col">
          <h4 class="col-title">Navigation & Quick Links</h4>
          <ul class="footer-links">
            <li><a routerLink="/">Home Page</a></li>
            <li><a routerLink="/about">About Arthromed</a></li>
            <li><a routerLink="/products">Full Catalog</a></li>
            <li><a href="/#care-section" (click)="scrollToSection('care-section', $event)">Care Specialties</a></li>
            <li><a href="/#about-section" (click)="scrollToSection('about-section', $event)">Clinical Mission</a></li>
            <li><a [href]="whatsAppUrl" target="_blank" rel="noopener noreferrer">Request Quote on WhatsApp</a></li>
          </ul>
        </div>

        <!-- Clinical Contact & Working Hours -->
        <div class="footer-col">
          <h4 class="col-title">Clinic & Partner Desk</h4>
          <p class="contact-line"><strong>Address:</strong> Arthromed, Ashok Heights, 1302, Nicolas Wadi Rd, Verma Nagar, Gundavali Gaothan, Andheri East, Mumbai, Maharashtra 400069</p>
          <p class="contact-line"><strong>Plus Code:</strong> 4VF4+52 Mumbai, Maharashtra</p>
          <p class="contact-line"><strong>Email:</strong> arthromed.2014&#64;gmail.com</p>
          <p class="contact-line"><strong>Fulfillment:</strong> Monday – Friday, 8:00 AM – 7:00 PM CST</p>
          <div class="badge-row">
            <span class="badge badge-teal">HCPCS Billing Ready</span>
            <span class="badge badge-blue">ISO 13485 Certified</span>
          </div>
        </div>
      </div>

      <!-- Medical Disclaimer & Copyright -->
      <div class="disclaimer-bar">
        <div class="container disclaimer-inner">
          <p class="disclaimer-text">
            <strong>Medical Disclaimer:</strong> The information provided on ArthroMed is for informational and educational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified orthopedic surgeon or physician before utilizing orthopedic braces or cold compression systems.
          </p>
          <p class="copyright-text">
            &copy; 2025 ArthroMed Medical Technologies Inc. All rights reserved. Breg&reg; is a registered trademark of Breg, Inc.
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .footer {
      background-color: #0b241d;
      color: #94a3b8;
      padding-top: 4.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .footer-content {
      display: grid;
      grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
      gap: 3rem;
      margin-bottom: 3.5rem;
    }

    @media (max-width: 992px) {
      .footer-content {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 640px) {
      .footer-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }

    .footer-brand {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
      margin-bottom: 1.25rem;
    }

    .footer-logo-card {
      background: #ffffff;
      padding: 0.5rem 1.15rem;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.22);
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
    }

    .footer-brand:hover .footer-logo-card {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    }

    .footer-logo-img {
      height: 42px;
      width: auto;
      object-fit: contain;
      display: block;
    }

    .footer-desc {
      font-size: 0.885rem;
      color: #94a3b8;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .contact-pill {
      background-color: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0.6rem 1rem;
      border-radius: var(--radius-md);
      display: inline-flex;
      flex-direction: column;
    }

    .phone-label {
      font-size: 0.72rem;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .phone-val {
      color: #ffffff;
      font-weight: 700;
      font-size: 1.05rem;
    }

    .col-title {
      color: #ffffff;
      font-size: 1.05rem;
      font-weight: 700;
      margin-bottom: 1.25rem;
      position: relative;
    }

    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
      padding: 0;
      margin: 0;
    }

    .footer-links a {
      color: #94a3b8;
      font-size: 0.885rem;
      text-decoration: none;
      transition: color var(--transition-fast), padding-left var(--transition-fast);
    }

    .footer-links a:hover {
      color: #22c55e;
      padding-left: 4px;
    }

    .contact-line {
      font-size: 0.875rem;
      color: #94a3b8;
      margin-bottom: 0.6rem;
      line-height: 1.5;
    }

    .badge-row {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }

    .disclaimer-bar {
      background-color: #071914;
      padding: 1.75rem 0;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .disclaimer-inner {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .disclaimer-text {
      font-size: 0.78rem;
      color: #64748b;
      line-height: 1.5;
    }

    .copyright-text {
      font-size: 0.78rem;
      color: #64748b;
    }

    .staff-divider {
      margin: 0 0.5rem;
      color: #334155;
    }

    .staff-discreet-link {
      color: #64748b;
      text-decoration: none;
      transition: color 0.2s;
    }

    .staff-discreet-link:hover {
      color: #22c55e;
      text-decoration: underline;
    }
  `]
})
export class FooterComponent {
  whatsAppUrl: string;

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {
    this.whatsAppUrl = this.productsService.getWhatsAppInquiryUrl();
  }

  scrollToTop(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToSection(sectionId: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
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
}
