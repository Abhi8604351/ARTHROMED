import { Component } from '@angular/core';

interface ValuePillar {
  title: string;
  desc: string;
  metric: string;
  iconSvg: string;
}

@Component({
  selector: 'app-why-choose-us',
  standalone: true,
  template: `
    <section class="why-section">
      <div class="container">
        <div class="why-grid">
          <div class="why-header-area">
            <div class="section-tag">
              <span class="tag-line"></span>
              <span>The ArthroMed Standard</span>
            </div>
            <h2 class="why-title">Why Leading Orthopedic Centers Rely on Us</h2>
            <p class="why-desc">
              From high-volume orthopedic surgery suites to outpatient sports rehabilitation clinics, our precision supply chain guarantees clinical reliability, compliance, and patient comfort.
            </p>
          </div>

          <div class="pillars-grid">
            @for (pillar of pillars; track pillar.title) {
              <div class="pillar-card card">
                <div class="pillar-top">
                  <div class="pillar-icon" [innerHTML]="pillar.iconSvg"></div>
                  <span class="pillar-metric">{{ pillar.metric }}</span>
                </div>
                <h3 class="pillar-title">{{ pillar.title }}</h3>
                <p class="pillar-text">{{ pillar.desc }}</p>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .why-section {
      padding: 6rem 0;
      background-color: #ffffff;
      border-bottom: 1px solid var(--color-border);
    }
    .why-grid {
      display: flex;
      flex-direction: column;
      gap: 3.5rem;
    }
    .why-header-area {
      max-width: 720px;
    }
    .section-tag {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--color-accent);
      font-size: 0.825rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 0.75rem;
    }
    .tag-line {
      width: 24px;
      height: 2px;
      background-color: var(--color-accent);
    }
    .why-title {
      font-size: 2.35rem;
      line-height: 1.2;
      margin-bottom: 1rem;
      letter-spacing: -0.02em;
    }
    .why-desc {
      font-size: 1.05rem;
      color: var(--color-text-muted);
      line-height: 1.6;
    }
    .pillars-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.75rem;
    }
    @media (max-width: 1024px) {
      .pillars-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 640px) {
      .pillars-grid {
        grid-template-columns: 1fr;
      }
    }
    .pillar-card {
      padding: 2rem 1.65rem;
      background-color: var(--color-surface-bg);
      border: 1px solid var(--color-border);
    }
    .pillar-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }
    .pillar-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background-color: #ffffff;
      color: var(--color-accent);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-sm);
    }
    .pillar-metric {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--color-primary);
      background-color: #ffffff;
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-full);
      border: 1px solid var(--color-border);
    }
    .pillar-title {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--color-primary);
      margin-bottom: 0.6rem;
      line-height: 1.3;
    }
    .pillar-text {
      font-size: 0.885rem;
      color: var(--color-text-muted);
      line-height: 1.6;
    }
  `]
})
export class WhyChooseUsComponent {
  pillars: ValuePillar[] = [
    {
      title: 'Certified Breg Authenticity',
      desc: '100% factory-sealed Breg medical devices with verified serial tracking, warranty backing, and official manufacturing documentation.',
      metric: '100% Authentic',
      iconSvg: `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      `
    },
    {
      title: 'HCPCS Insurance Codes',
      desc: 'All products feature pre-mapped CMS HCPCS codes (e.g. E0218, L1845, L3960) to streamline insurance reimbursement and clinic billing claims.',
      metric: 'CMS Verified',
      iconSvg: `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <rect width="18" height="18" x="3" y="3" rx="2"/>
          <path d="M7 7h10M7 12h10M7 17h6"/>
        </svg>
      `
    },
    {
      title: 'Rapid Clinic Fulfillment',
      desc: 'Same-day hospital and clinic dispatch for post-op cold therapy systems, mitigating emergency surgical bottlenecks.',
      metric: '24-48h Delivery',
      iconSvg: `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
          <path d="M15 18H9"/>
          <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
          <circle cx="17" cy="18" r="2"/>
          <circle cx="7" cy="18" r="2"/>
        </svg>
      `
    },
    {
      title: 'Licensed Clinical Guidance',
      desc: 'Direct consultation with certified orthotists to verify precise brace measurements, sizing protocols, and joint offloading settings.',
      metric: 'Surgeon Trusted',
      iconSvg: `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      `
    }
  ];
}
