import { Component } from '@angular/core';

interface SurgeonTestimonial {
  quote: string;
  surgeonName: string;
  title: string;
  institution: string;
  specialty: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  template: `
    <section id="testimonials" class="testimonials-section">
      <div class="container">
        <div class="section-header text-center">
          <span class="section-tag-center">Physician Endorsements</span>
          <h2 class="section-title">Trusted by Orthopedic Surgeons & Sports Specialists</h2>
          <p class="section-subtitle">
            Read clinical insights from fellowship-trained orthopedic surgeons who routinely prescribe ArthroMed-distributed Breg systems.
          </p>
        </div>

        <div class="testimonials-grid">
          @for (item of testimonials; track item.surgeonName) {
            <div class="testimonial-card card">
              <div class="quote-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
              </div>

              <p class="quote-text">“{{ item.quote }}”</p>

              <div class="surgeon-meta">
                <div class="avatar-ph">
                  {{ item.surgeonName.charAt(3) }}{{ item.surgeonName.charAt(4) }}
                </div>
                <div class="surgeon-info">
                  <h4 class="surgeon-name">{{ item.surgeonName }}</h4>
                  <span class="surgeon-title">{{ item.title }}</span>
                  <span class="surgeon-inst">{{ item.institution }}</span>
                </div>
              </div>

              <div class="specialty-badge">
                <span>{{ item.specialty }}</span>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .testimonials-section {
      padding: 6rem 0;
      background-color: #ffffff;
      border-bottom: 1px solid var(--color-border);
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
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }
    @media (max-width: 992px) {
      .testimonials-grid {
        grid-template-columns: 1fr;
      }
    }
    .testimonial-card {
      padding: 2.25rem 1.85rem;
      display: flex;
      flex-direction: column;
      position: relative;
      background-color: var(--color-surface-bg);
    }
    .quote-icon {
      color: rgba(13, 148, 136, 0.25);
      margin-bottom: 1rem;
    }
    .quote-text {
      font-size: 0.965rem;
      color: var(--color-text-main);
      line-height: 1.7;
      margin-bottom: 2rem;
      font-style: italic;
    }
    .surgeon-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: auto;
    }
    .avatar-ph {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.95rem;
    }
    .surgeon-info {
      display: flex;
      flex-direction: column;
    }
    .surgeon-name {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--color-primary);
    }
    .surgeon-title {
      font-size: 0.775rem;
      font-weight: 600;
      color: var(--color-accent);
    }
    .surgeon-inst {
      font-size: 0.775rem;
      color: var(--color-text-muted);
    }
    .specialty-badge {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      background-color: #ffffff;
      border: 1px solid var(--color-border);
      padding: 0.2rem 0.6rem;
      border-radius: var(--radius-full);
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--color-primary);
    }
  `]
})
export class TestimonialsComponent {
  testimonials: SurgeonTestimonial[] = [
    {
      quote: 'Prescribing the Breg Polar Care Wave after multi-ligament knee reconstructions has drastically truncated our patients’ acute post-operative swelling phase. The motorized compression ensures continuous compliance.',
      surgeonName: 'Dr. Marcus Vance, MD',
      title: 'Chief of Sports Medicine',
      institution: 'Midwest Orthopedic Institute',
      specialty: 'Knee & Shoulder Arthroscopy'
    },
    {
      quote: 'The Breg Fusion XT provides the rigid varus/valgus stabilization my competitive collegiate athletes require when returning to turf sports following ACL reconstruction. Fitting accuracy is unmatched.',
      surgeonName: 'Dr. Elena Rostova, MD, FAAOS',
      title: 'Associate Professor of Orthopedic Surgery',
      institution: 'Great Lakes Ortho Specialty Clinic',
      specialty: 'Ligament Reconstruction'
    },
    {
      quote: 'ArthroMed makes clinical ordering instantaneous. Having accurate HCPCS codes on every product alongside prompt WhatsApp clinical support saves our billing coordinators hours each week.',
      surgeonName: 'Dr. David Chen, MD',
      title: 'Director of Spine Rehabilitation',
      institution: 'Twin Cities Spine & Joint Care',
      specialty: 'Spinal Orthotics & Trauma'
    }
  ];
}
