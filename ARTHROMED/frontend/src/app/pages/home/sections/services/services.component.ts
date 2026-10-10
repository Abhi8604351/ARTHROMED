import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ServiceItem {
  iconSvg: string;
  category: string;
  title: string;
  description: string;
  points: string[];
  filterParam: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section id="services-section" class="services-section">
      <div class="container">
        <div class="section-header text-center">
          <div class="section-tag-center">
            <span>Clinical Capabilities</span>
          </div>
          <h2 class="section-title">Specialized Orthopedic Product Lines</h2>
          <p class="section-subtitle">
            Engineered in tandem with leading orthopedic surgeons to maximize stability, accelerate physiological recovery, and safeguard joint reconstructions.
          </p>
        </div>

        <div class="services-grid">
          @for (service of services; track service.title) {
            <div class="service-card card">
              <div class="card-icon-box" [innerHTML]="service.iconSvg"></div>
              <span class="service-category">{{ service.category }}</span>
              <h3 class="service-title">{{ service.title }}</h3>
              <p class="service-desc">{{ service.description }}</p>

              <ul class="service-points">
                @for (pt of service.points; track pt) {
                  <li>
                    <span class="check-bullet">✓</span>
                    <span>{{ pt }}</span>
                  </li>
                }
              </ul>

              <div class="service-action">
                <a [routerLink]="['/products']" [queryParams]="{ category: service.filterParam }" class="service-link">
                  <span>View Equipment</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .services-section {
      padding: 6rem 0;
      background-color: var(--color-surface-bg);
    }
    .text-center {
      text-align: center;
    }
    .section-header {
      max-width: 680px;
      margin: 0 auto 3.5rem;
    }
    .section-tag-center {
      display: inline-block;
      color: var(--color-accent);
      font-size: 0.825rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 0.6rem;
      background: var(--color-accent-light);
      padding: 0.25rem 0.85rem;
      border-radius: var(--radius-full);
    }
    .section-title {
      font-size: 2.35rem;
      margin-bottom: 0.85rem;
      letter-spacing: -0.02em;
    }
    .section-subtitle {
      font-size: 1.05rem;
      color: var(--color-text-muted);
      line-height: 1.6;
    }
    .services-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.75rem;
    }
    @media (max-width: 1024px) {
      .services-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 640px) {
      .services-grid {
        grid-template-columns: 1fr;
      }
    }
    .service-card {
      padding: 2rem 1.65rem;
      display: flex;
      flex-direction: column;
      border-top: 4px solid var(--color-primary);
      transition: all var(--transition-normal);
    }
    .service-card:hover {
      border-top-color: var(--color-accent);
      transform: translateY(-4px);
    }
    .card-icon-box {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      background: #f1f5f9;
      color: var(--color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
    }
    .service-category {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--color-accent);
      letter-spacing: 0.05em;
      margin-bottom: 0.35rem;
    }
    .service-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-primary);
      margin-bottom: 0.75rem;
      line-height: 1.3;
    }
    .service-desc {
      font-size: 0.885rem;
      color: var(--color-text-muted);
      line-height: 1.6;
      margin-bottom: 1.25rem;
    }
    .service-points {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1.75rem;
      margin-top: auto;
    }
    .service-points li {
      font-size: 0.825rem;
      color: var(--color-text-muted);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .check-bullet {
      color: var(--color-accent);
      font-weight: 800;
      font-size: 0.9rem;
    }
    .service-action {
      padding-top: 1rem;
      border-top: 1px solid var(--color-border);
    }
    .service-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--color-primary);
      transition: color var(--transition-fast);
    }
    .service-link:hover {
      color: var(--color-accent);
    }
  `]
})
export class ServicesComponent {
  services: ServiceItem[] = [
    {
      category: 'Ligament & Joint Repair',
      title: 'Arthroscopy & Surgical Recovery',
      description: 'Specialized post-arthroscopic immobilization and rehabilitation braces for ACL, meniscus, and labral stabilization.',
      points: [
        'Dynamic extension stops',
        'Early controlled mobilization',
        'Lightweight composite frames'
      ],
      filterParam: 'Knee',
      iconSvg: `
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="m10 15 5-3-5-3v6z"/>
        </svg>
      `
    },
    {
      category: 'Cryo-Pneumatic Therapy',
      title: 'Motorized Cold Therapy',
      description: 'Breg Polar Care systems delivering calibrated motorized cooling and compression to drastically reduce pain and post-op swelling.',
      points: [
        'Up to 6-8 hours continuous cooling',
        'FDA-cleared medical grade',
        'Whisper-quiet hospital pump'
      ],
      filterParam: 'Cold Therapy',
      iconSvg: `
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07 19.07 4.93"/>
        </svg>
      `
    },
    {
      category: 'Functional Orthotics',
      title: 'Clinical Bracing Systems',
      description: 'ProForm contoured knee braces, shoulder abduction slings, and spinal LSO supports tailored to patient anatomy.',
      points: [
        'Anatomically contoured fit',
        'Moisture-wicking breathable liners',
        'Proven anti-migration grip'
      ],
      filterParam: 'Shoulder',
      iconSvg: `
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      `
    },
    {
      category: 'Clinical Logistics',
      title: 'Clinic & Patient Support',
      description: 'Full-service provider backing with pre-filled HCPCS billing forms, fitting video guides, and rapid surgeon fulfillment.',
      points: [
        'Official HCPCS billing verification',
        'Free digital PDF fitting guides',
        '24/7 WhatsApp clinical desk'
      ],
      filterParam: 'General Orthopedics',
      iconSvg: `
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      `
    }
  ];
}
