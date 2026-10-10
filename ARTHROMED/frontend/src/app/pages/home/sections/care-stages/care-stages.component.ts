import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface CareStage {
  id: string;
  category: string;
  title: string;
  description: string;
  tag: string;
  categoryParam: string;
  iconSvg: string;
}

@Component({
  selector: 'app-care-stages',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section id="care-section" class="care-section">
      <div class="container">
        <div class="care-grid">
          <!-- Left Visual Card: Doctor Consulting Patient + "People first. Always." -->
          <div class="doctor-story-card">
            <img
              src="/images/doctor-consultation.jpg"
              alt="Orthopedic clinician consulting with recovering patient"
              class="doctor-story-img"
            />

            <!-- Overlaid Dark Badge -->
            <div class="story-overlay-badge">
              <h3 class="story-headline">
                People first.<br>
                Always.
              </h3>
              <p class="story-desc">
                We're here to make quality healthcare and orthopedic recovery more accessible, human, and personal.
              </p>
              <a href="/#about-section" (click)="scrollToAbout($event)" class="btn-our-story">
                <span>Our Story</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
          </div>

          <!-- Right Content: "CARE FOR EVERY STAGE" & 4 Category Cards -->
          <div class="care-content-side">
            <!-- Header with Slider Arrows -->
            <div class="care-header-row">
              <div class="care-titles">
                <span class="care-eyebrow">CARE FOR EVERY STAGE</span>
                <h2 class="care-title">Your health, our priority</h2>
              </div>

              <!-- Interactive Carousel Controls -->
              <div class="carousel-nav-arrows">
                <button
                  type="button"
                  class="nav-arrow-btn"
                  (click)="prevCard()"
                  aria-label="Previous care specialty"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
                <button
                  type="button"
                  class="nav-arrow-btn"
                  (click)="nextCard()"
                  aria-label="Next care specialty"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>

            <!-- 4 Vertical Cards Grid -->
            <div class="stage-cards-grid">
              @for (stage of stages; track stage.id; let idx = $index) {
                <div
                  class="stage-card"
                  [class.active-stage]="activeIndex() === idx"
                  (click)="setActive(idx)"
                >
                  <div class="stage-icon-wrap" [innerHTML]="stage.iconSvg"></div>
                  <h4 class="stage-name">{{ stage.title }}</h4>
                  <p class="stage-desc">{{ stage.description }}</p>
                  <div class="stage-footer">
                    <span class="stage-tag">{{ stage.tag }}</span>
                    <a
                      [routerLink]="['/products']"
                      [queryParams]="{ category: stage.categoryParam }"
                      class="stage-link-btn"
                      (click)="$event.stopPropagation()"
                      title="Browse {{ stage.tag }}"
                    >
                      <span>Explore</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </a>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .care-section {
      padding: 4.5rem 0 5.5rem;
      background-color: #ffffff;
      border-top: 1px solid #f1f5f9;
    }

    .care-grid {
      display: grid;
      grid-template-columns: 0.9fr 1.1fr;
      align-items: center;
      gap: 3.5rem;
    }

    @media (max-width: 1024px) {
      .care-grid {
        grid-template-columns: 1fr;
        gap: 3rem;
      }
    }

    /* Left Doctor Story Card */
    .doctor-story-card {
      position: relative;
      border-radius: 28px;
      overflow: hidden;
      height: 480px;
      box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.12);
      background-color: #f1f5f9;
    }

    @media (max-width: 640px) {
      .doctor-story-card {
        height: 420px;
        border-radius: 22px;
      }
    }

    .doctor-story-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    /* Overlaid Dark Badge */
    .story-overlay-badge {
      position: absolute;
      top: 32px;
      left: 32px;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-radius: 20px;
      padding: 1.75rem 1.85rem;
      max-width: 290px;
      color: #ffffff;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.12);
    }

    @media (max-width: 640px) {
      .story-overlay-badge {
        top: 20px;
        left: 20px;
        padding: 1.25rem;
        max-width: 250px;
      }
    }

    .story-headline {
      font-size: 1.6rem;
      font-weight: 800;
      line-height: 1.15;
      color: #ffffff;
      letter-spacing: -0.025em;
      margin-bottom: 0.65rem;
    }

    .story-desc {
      font-size: 0.825rem;
      color: #cbd5e1;
      line-height: 1.5;
      margin-bottom: 1.25rem;
    }

    .btn-our-story {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      background: #ffffff;
      color: #0f172a;
      padding: 0.55rem 1.15rem;
      border-radius: 9999px;
      font-size: 0.84rem;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s ease;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    }

    .btn-our-story:hover {
      background: #f1f5f9;
      transform: translateY(-1px);
    }

    /* Right Side Content */
    .care-content-side {
      display: flex;
      flex-direction: column;
    }

    .care-header-row {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 2rem;
    }

    .care-eyebrow {
      font-size: 0.76rem;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      display: block;
      margin-bottom: 0.45rem;
    }

    .care-title {
      font-size: 2.35rem;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.03em;
      line-height: 1.15;
    }

    @media (max-width: 640px) {
      .care-title {
        font-size: 1.85rem;
      }
    }

    /* Carousel Nav Arrows */
    .carousel-nav-arrows {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }

    .nav-arrow-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      color: #0f172a;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .nav-arrow-btn:hover {
      border-color: #12382e;
      color: #12382e;
      background: #f8fafc;
    }

    /* 4 Stage Cards Grid */
    .stage-cards-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
    }

    @media (max-width: 1200px) {
      .stage-cards-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 540px) {
      .stage-cards-grid {
        grid-template-columns: 1fr;
      }
    }

    .stage-card {
      background: #f8fafc;
      border: 1.5px solid transparent;
      border-radius: 18px;
      padding: 1.6rem 1.25rem;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .stage-card:hover {
      background: #ffffff;
      border-color: #cbd5e1;
      transform: translateY(-3px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.06);
    }

    /* Active Highlighted State matching reference */
    .stage-card.active-stage {
      background: #ffffff;
      border-color: #12382e;
      box-shadow: 0 12px 28px -6px rgba(18, 56, 46, 0.14);
      transform: translateY(-2px);
    }

    .stage-icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #12382e;
      margin-bottom: 1.15rem;
      transition: all 0.2s ease;
    }

    .stage-card.active-stage .stage-icon-wrap {
      background: #eaf3ec;
      border-color: #a7f3d0;
      color: #12382e;
    }

    .stage-name {
      font-size: 1.05rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 0.45rem;
      line-height: 1.2;
    }

    .stage-desc {
      font-size: 0.825rem;
      color: #64748b;
      line-height: 1.5;
      margin-bottom: 1.25rem;
      flex: 1;
    }

    .stage-tag {
      font-size: 0.7rem;
      font-weight: 700;
      color: #12382e;
      background: #eaf3ec;
      padding: 0.2rem 0.55rem;
      border-radius: 9999px;
      width: fit-content;
      letter-spacing: 0.02em;
    }

    .stage-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      margin-top: auto;
    }

    .stage-link-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.72rem;
      font-weight: 700;
      color: #12382e;
      text-decoration: none;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      padding: 0.2rem 0.55rem;
      border-radius: 9999px;
      transition: all 0.2s ease;
    }

    .stage-link-btn:hover {
      background: #12382e;
      color: #ffffff;
      border-color: #12382e;
      transform: translateX(2px);
    }
  `]
})
export class CareStagesComponent {
  activeIndex = signal(0);

  stages: CareStage[] = [
    {
      id: 'primary',
      category: 'Stage 1',
      title: 'Primary Care',
      description: 'Everyday care for a healthier you.',
      tag: 'Breg T Scope Post-Op',
      categoryParam: 'Knee',
      iconSvg: `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          <path d="M12 5v14"/>
          <path d="M5 12h14"/>
        </svg>
      `
    },
    {
      id: 'mental',
      category: 'Stage 2',
      title: 'Mental Health',
      description: 'Support for a brighter mind.',
      tag: 'Polar Care Wave Cryo',
      categoryParam: 'Cold Therapy',
      iconSvg: `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/>
          <path d="M9 21h6"/>
        </svg>
      `
    },
    {
      id: 'women',
      category: 'Stage 3',
      title: "Women's Health",
      description: 'Care through every stage.',
      tag: 'Pinnacle LSO & Slings',
      categoryParam: 'Spine',
      iconSvg: `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="8" r="5"/>
          <path d="M20 21a8 8 0 1 0-16 0"/>
        </svg>
      `
    },
    {
      id: 'chronic',
      category: 'Stage 4',
      title: 'Chronic Care',
      description: 'Ongoing support for a better tomorrow.',
      tag: 'Genesis Walkers & Braces',
      categoryParam: 'Foot & Ankle',
      iconSvg: `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <polyline points="9 12 11 14 15 10"/>
        </svg>
      `
    }
  ];

  scrollToAbout(event: Event): void {
    event.preventDefault();
    const el = document.getElementById('about-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', '/#about-section');
    }
  }

  setActive(idx: number): void {
    this.activeIndex.set(idx);
  }

  nextCard(): void {
    this.activeIndex.update(curr => (curr + 1) % this.stages.length);
  }

  prevCard(): void {
    this.activeIndex.update(curr => (curr - 1 + this.stages.length) % this.stages.length);
  }
}
