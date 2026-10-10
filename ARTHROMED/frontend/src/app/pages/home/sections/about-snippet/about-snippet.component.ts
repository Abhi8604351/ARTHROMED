import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-snippet',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section id="about-section" class="about-section">
      <div class="container">
        <div class="about-grid">
          <div class="about-image-side">
            <div class="about-img-frame">
              <img
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
                alt="Orthopedic clinician examining patient joint stability"
                class="about-img"
              />
              <div class="experience-card">
                <span class="exp-number">20+</span>
                <span class="exp-text">Years Clinical Orthopedic Excellence</span>
              </div>
            </div>
          </div>

          <div class="about-content-side">
            <div class="section-tag">
              <span class="tag-line"></span>
              <span>Our Clinical Mission</span>
            </div>

            <h2 class="about-title">
              Pioneering Joint Restoration & Anatomical Stabilization
            </h2>

            <p class="about-lead">
              At <strong>ArthroMed</strong>, we believe every patient deserves an uncompromised path back to full mobility. Through strategic distribution of gold-standard Breg® orthopedic orthoses and advanced post-surgical cold therapy units, we bridge the gap between surgical precision and daily recovery.
            </p>

            <div class="mission-pillars">
              <div class="pillar">
                <div class="pillar-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div class="pillar-body">
                  <h4>Anatomical Alignment</h4>
                  <p>Bracing systems engineered to mimic physiological joint kinematics without limiting therapeutic motion.</p>
                </div>
              </div>

              <div class="pillar">
                <div class="pillar-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="m4.93 4.93 4.24 4.24"/>
                    <path d="m14.83 9.17 4.24-4.24"/>
                    <path d="m14.83 14.83 4.24 4.24"/>
                    <path d="m9.17 14.83-4.24 4.24"/>
                    <circle cx="12" cy="12" r="4"/>
                  </svg>
                </div>
                <div class="pillar-body">
                  <h4>Swelling & Edema Control</h4>
                  <p>Targeted motorized cryo-pneumatic compression mitigating pain and minimizing dependency on opioids.</p>
                </div>
              </div>

              <div class="pillar">
                <div class="pillar-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div class="pillar-body">
                  <h4>Surgeon & Clinic Partnerships</h4>
                  <p>Dedicated medical support with HCPCS billing guidance, bulk hospital orders, and patient fitting resources.</p>
                </div>
              </div>
            </div>

            <div class="about-action">
              <a routerLink="/products" class="btn btn-primary">
                <span>Explore Orthopedic Catalog</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-section {
      padding: 6rem 0;
      background-color: #ffffff;
      border-bottom: 1px solid var(--color-border);
    }
    .about-grid {
      display: grid;
      grid-template-columns: 0.95fr 1.05fr;
      align-items: center;
      gap: 4rem;
    }
    @media (max-width: 992px) {
      .about-grid {
        grid-template-columns: 1fr;
        gap: 3rem;
      }
    }
    .about-img-frame {
      position: relative;
      border-radius: var(--radius-lg);
    }
    .about-img {
      width: 100%;
      height: 480px;
      object-fit: cover;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--color-border);
    }
    .experience-card {
      position: absolute;
      bottom: -20px;
      right: -20px;
      background: var(--color-primary);
      color: #ffffff;
      padding: 1.5rem 1.75rem;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-xl);
      display: flex;
      flex-direction: column;
      border-left: 4px solid var(--color-accent);
      max-width: 200px;
    }
    @media (max-width: 640px) {
      .experience-card {
        right: 10px;
        bottom: -10px;
      }
    }
    .exp-number {
      font-size: 2.2rem;
      font-weight: 800;
      color: #ffffff;
      line-height: 1;
    }
    .exp-text {
      font-size: 0.8rem;
      color: #94a3b8;
      font-weight: 600;
      margin-top: 0.4rem;
      line-height: 1.3;
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
    .about-title {
      font-size: 2.35rem;
      color: var(--color-primary);
      line-height: 1.2;
      margin-bottom: 1.25rem;
      letter-spacing: -0.02em;
    }
    @media (max-width: 640px) {
      .about-title { font-size: 1.85rem; }
    }
    .about-lead {
      font-size: 1.05rem;
      color: var(--color-text-muted);
      line-height: 1.7;
      margin-bottom: 2rem;
    }
    .mission-pillars {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    .pillar {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }
    .pillar-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background-color: var(--color-accent-light);
      color: var(--color-accent);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .pillar-body h4 {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--color-primary);
      margin-bottom: 0.2rem;
    }
    .pillar-body p {
      font-size: 0.9rem;
      color: var(--color-text-muted);
      line-height: 1.5;
    }
    .about-action {
      margin-top: 1rem;
    }
  `]
})
export class AboutSnippetComponent {}
