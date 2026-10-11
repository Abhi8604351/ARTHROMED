import { Component, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../../core/services/products.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero-section">
      <div class="container">
        <!-- Main Two-Column Hero Row -->
        <div class="hero-grid">
          <!-- Left Content Column -->
          <div class="hero-left">
            <span class="eyebrow-tag">BETTER CARE. BRIGHTER DAYS.</span>

            <h1 class="hero-title">
              Healthcare<br>
              that fits<br>
              your life
            </h1>

            <p class="hero-description">
              Access trusted orthopedic equipment, certified Breg® braces, direct WhatsApp inquiries, and clinical recovery support — all in one place.
            </p>

            <div class="hero-actions">
              <!-- Primary WhatsApp Query CTA Button -->
              <a
                [href]="whatsAppUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-primary-whatsapp"
                id="btn-hero-whatsapp-query"
                title="Send WhatsApp Query to 8604351930"
              >
                <svg class="wa-icon" width="21" height="21" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/>
                </svg>
                <span>WhatsApp Query</span>
                <svg class="btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>

              <!-- Secondary Watch Video CTA -->
              <button
                type="button"
                class="btn-watch-works"
                (click)="openVideoModal()"
                id="btn-hero-watch-demo"
                aria-label="Watch how Breg T Scope works"
              >
                <span class="play-circle">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </span>
                <span>Watch How It Works</span>
              </button>
            </div>

            <!-- Social Proof Rating Area -->
            <div class="hero-social-proof">
              <!-- Overlapping Customer Avatars -->
              <div class="avatar-stack">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Patient reviewer"
                  class="proof-avatar"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Patient reviewer"
                  class="proof-avatar"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Patient reviewer"
                  class="proof-avatar"
                />
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Patient reviewer"
                  class="proof-avatar"
                />
              </div>

              <div class="proof-content">
                <span class="proof-count">Trusted by 50,000+ patients</span>
                <div class="proof-rating">
                  <div class="stars-row">
                    <span class="star-icon">★</span>
                    <span class="star-icon">★</span>
                    <span class="star-icon">★</span>
                    <span class="star-icon">★</span>
                    <span class="star-icon">★</span>
                  </div>
                  <span class="rating-text">4.9/5 rating</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Visual Column (Breg T Scope Premier Post-Op Knee Brace) -->
          <div class="hero-right">
            <div class="hero-image-card">
              <!-- Breg T Scope Premier Post-Op Knee Brace Image -->
              <img
                src="/Breg/Premier Post-Op Knee Brace.png"
                alt="Breg T Scope Premier Post-Op Knee Brace with telescoping hinge and range of motion controls"
                class="hero-product-img"
              />

              <!-- Handwritten Script Calligraphy Overlay -->
              <div class="script-overlay">
                A Healthier You
              </div>

              <!-- Bottom-Right Floating Card: Small steps. Healthier tomorrows. -->
              <div
                class="floating-motto-card"
                (click)="openVideoModal()"
                role="button"
                tabindex="0"
                title="Click to learn about Breg T Scope"
              >
                <div class="motto-icon-box">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dcfce7" stroke-width="2.2">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                  </svg>
                </div>
                <div class="motto-text">
                  <span>Small steps.</span>
                  <span>Healthier tomorrows.</span>
                </div>
                <button type="button" class="motto-arrow-btn" aria-label="Learn more about T Scope">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 5-Item Quick Feature Strip Directly Below Hero -->
        <div class="feature-strip">
          <!-- 1: WhatsApp Inquiries -->
          <a
            [href]="whatsAppUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="feature-strip-item link-strip-item"
            title="Chat directly on WhatsApp (8604351930)"
          >
            <div class="feature-icon-circle wa-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#25d366">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/>
              </svg>
            </div>
            <div class="feature-item-text">
              <span class="feature-title">WhatsApp Inquiries</span>
              <span class="feature-sub">Instant chat on 8604351930</span>
            </div>
            <span class="feature-arrow-indicator">&rarr;</span>
          </a>

          <!-- 2: Breg Products Catalog -->
          <a
            routerLink="/products"
            class="feature-strip-item link-strip-item"
            title="Browse Breg Orthopedic Braces"
          >
            <div class="feature-icon-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#12382e" stroke-width="2">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div class="feature-item-text">
              <span class="feature-title">Breg® Equipment</span>
              <span class="feature-sub">Braces, cold therapy &amp; walkers</span>
            </div>
            <span class="feature-arrow-indicator">&rarr;</span>
          </a>

          <!-- 3: Clinical Sizing Guides -->
          <a
            [href]="whatsAppUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="feature-strip-item link-strip-item"
            title="Ask for Sizing &amp; Fitting Assistance"
          >
            <div class="feature-icon-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#12382e" stroke-width="2">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="9" y1="13" x2="15" y2="13"/>
                <line x1="9" y1="17" x2="13" y2="17"/>
              </svg>
            </div>
            <div class="feature-item-text">
              <span class="feature-title">Clinical Sizing</span>
              <span class="feature-sub">Expert sizing &amp; fitting advice</span>
            </div>
            <span class="feature-arrow-indicator">&rarr;</span>
          </a>

          <!-- 4: Trusted Professionals -->
          <div
            class="feature-strip-item"
            (click)="scrollToSection('testimonials', $event)"
            role="button"
            tabindex="0"
            title="Meet Trusted Orthopedic Specialists"
          >
            <div class="feature-icon-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#12382e" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
            </div>
            <div class="feature-item-text">
              <span class="feature-title">Trusted Professionals</span>
              <span class="feature-sub">Care you can count on</span>
            </div>
            <span class="feature-arrow-indicator">&darr;</span>
          </div>

          <!-- 5: Personalized Care -->
          <div
            class="feature-strip-item"
            (click)="scrollToSection('care-section', $event)"
            role="button"
            tabindex="0"
            title="Explore Care Stages"
          >
            <div class="feature-icon-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#12382e" stroke-width="2">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </div>
            <div class="feature-item-text">
              <span class="feature-title">Personalized Care</span>
              <span class="feature-sub">Support for every recovery stage</span>
            </div>
            <span class="feature-arrow-indicator">&darr;</span>
          </div>
        </div>
      </div>

      <!-- Breg T Scope Premier Video & Interactive Demo Modal -->
      @if (isVideoModalOpen()) {
        <div class="modal-backdrop" (click)="closeVideoModal()">
          <div class="modal-dialog" (click)="$event.stopPropagation()">
            <div class="modal-head">
              <div class="modal-title-group">
                <span class="badge-tag">Clinical Product Demonstration</span>
                <h3>Breg® T Scope Premier Post-Op Knee Brace</h3>
              </div>
              <button class="modal-close-btn" (click)="closeVideoModal()" aria-label="Close modal">✕</button>
            </div>

            <div class="modal-body-content">
              <div class="product-feature-hero">
                <img
                  src="/Breg/Premier Post-Op Knee Brace.png"
                  alt="Breg T Scope Premier Post-Op Knee Brace"
                  class="modal-thumb-img"
                />
                <div class="feature-breakdown">
                  <h4>Precision Range-of-Motion (ROM) &amp; Stabilization</h4>
                  <p>
                    Engineered for surgical ligament repairs (ACL, PCL, MCL, LCL) and meniscal restorations, the <strong>Breg T Scope Premier</strong> offers the most user-friendly telescoping hinge system in clinical orthopedics.
                  </p>

                  <!-- Live Interactive ROM Stop Tester -->
                  <div class="rom-interactive-panel">
                    <div class="rom-row">
                      <span class="rom-label">Extension Stop:</span>
                      <div class="rom-btns">
                        @for (ext of ['-10°', '0°', '10°', '20°', '30°']; track ext) {
                          <button
                            type="button"
                            class="rom-chip"
                            [class.active]="currentExtension() === ext"
                            (click)="setExtension(ext)"
                          >
                            {{ ext }}
                          </button>
                        }
                      </div>
                    </div>

                    <div class="rom-row">
                      <span class="rom-label">Flexion Stop:</span>
                      <div class="rom-btns">
                        @for (flex of ['30°', '60°', '90°', '120°']; track flex) {
                          <button
                            type="button"
                            class="rom-chip"
                            [class.active]="currentFlexion() === flex"
                            (click)="setFlexion(flex)"
                          >
                            {{ flex }}
                          </button>
                        }
                      </div>
                    </div>

                    <div class="rom-status-banner">
                      <span>Live Setting: <strong>Ext {{ currentExtension() }} &rarr; Flex {{ currentFlexion() }}</strong></span>
                      <button
                        type="button"
                        class="drop-lock-btn"
                        [class.locked]="isDropLocked()"
                        (click)="toggleDropLock()"
                      >
                        {{ isDropLocked() ? '🔒 Drop-Lock Engaged (0°)' : '🔓 Drop-Lock Free ROM' }}
                      </button>
                    </div>
                  </div>

                  <div class="spec-grid">
                    <div class="spec-cell">
                      <span class="spec-label">Extension Range</span>
                      <span class="spec-val">-10° to 90° (10° steps)</span>
                    </div>
                    <div class="spec-cell">
                      <span class="spec-label">Flexion Range</span>
                      <span class="spec-val">-10° to 120° (10° steps)</span>
                    </div>
                    <div class="spec-cell">
                      <span class="spec-label">Telescoping Length</span>
                      <span class="spec-val">17" to 27" (Universal)</span>
                    </div>
                    <div class="spec-cell">
                      <span class="spec-label">Surgical Billing</span>
                      <span class="spec-val">HCPCS L1832 / L1833</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="modal-action-bar">
                <a
                  [href]="whatsAppUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-fast-whatsapp"
                  title="Inquire about Breg T Scope on WhatsApp"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/>
                  </svg>
                  <span>WhatsApp Query (8604351930)</span>
                </a>
                <a routerLink="/products" [queryParams]="{ category: 'Knee' }" (click)="closeVideoModal()" class="btn-outline-dark">
                  <span>Browse Knee Catalog</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styles: [`
    .hero-section {
      background-color: #ffffff;
      padding: 3.5rem 0 4rem;
      position: relative;
      width: 100%;
      max-width: 100%;
      overflow-x: hidden;
      box-sizing: border-box;
    }

    /* Two Column Main Hero Layout */
    .hero-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      align-items: center;
      gap: 3.5rem;
    }

    @media (max-width: 992px) {
      .hero-grid {
        grid-template-columns: 1fr;
        gap: 3rem;
      }
    }

    /* Left Content Column */
    .hero-left {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .eyebrow-tag {
      font-size: 0.78rem;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      margin-bottom: 1.25rem;
      display: inline-block;
    }

    /* Massive high-impact title matching reference */
    .hero-title {
      font-size: 4.1rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.05;
      letter-spacing: -0.035em;
      margin-bottom: 1.5rem;
      word-break: break-word;
    }

    @media (max-width: 1200px) {
      .hero-title {
        font-size: 3.5rem;
      }
    }

    @media (max-width: 640px) {
      .hero-title {
        font-size: 2.65rem;
      }
    }

    @media (max-width: 480px) {
      .hero-title {
        font-size: 2.2rem;
      }
    }

    .hero-description {
      font-size: 1.125rem;
      color: #475569;
      line-height: 1.6;
      max-width: 480px;
      margin-bottom: 2.25rem;
      font-weight: 400;
    }

    /* Action Buttons Row */
    .hero-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 2.75rem;
      flex-wrap: wrap;
    }

    /* Primary WhatsApp Button: Deep forest green with glowing WhatsApp icon */
    .btn-primary-whatsapp {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      background-color: #12382e;
      color: #ffffff;
      padding: 0.95rem 1.95rem;
      border-radius: 9999px;
      font-size: 1rem;
      font-weight: 700;
      text-decoration: none;
      box-shadow: 0 4px 18px rgba(18, 56, 46, 0.25);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .btn-primary-whatsapp:hover {
      background-color: #0b241d;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(18, 56, 46, 0.35);
      color: #ffffff;
    }

    .wa-icon {
      color: #25d366;
      flex-shrink: 0;
      transition: transform 0.2s ease;
    }

    .btn-primary-whatsapp:hover .wa-icon {
      transform: scale(1.15);
    }

    .btn-arrow {
      transition: transform 0.2s ease;
    }

    .btn-primary-whatsapp:hover .btn-arrow {
      transform: translateX(3px);
    }

    /* Secondary CTA: Watch How It Works */
    .btn-watch-works {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      background: transparent;
      border: none;
      cursor: pointer;
      color: #0f172a;
      font-size: 0.96rem;
      font-weight: 600;
      padding: 0.5rem 0.75rem;
      border-radius: 9999px;
      transition: all 0.2s ease;
    }

    .play-circle {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: 1.5px solid #cbd5e1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #0f172a;
      transition: all 0.2s ease;
    }

    .btn-watch-works:hover .play-circle {
      border-color: #12382e;
      background-color: #12382e;
      color: #ffffff;
      transform: scale(1.06);
    }

    /* Social Proof Section */
    .hero-social-proof {
      display: flex;
      align-items: center;
      gap: 1.15rem;
    }

    .avatar-stack {
      display: flex;
      align-items: center;
    }

    .proof-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: 2.5px solid #ffffff;
      object-fit: cover;
      margin-left: -10px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
    }

    .proof-avatar:first-child {
      margin-left: 0;
    }

    .proof-content {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .proof-count {
      font-size: 0.88rem;
      font-weight: 700;
      color: #0f172a;
    }

    .proof-rating {
      display: flex;
      align-items: center;
      gap: 0.45rem;
    }

    .stars-row {
      display: flex;
      align-items: center;
      color: #15803d;
      font-size: 0.85rem;
      letter-spacing: 0.1em;
    }

    .rating-text {
      font-size: 0.82rem;
      font-weight: 600;
      color: #475569;
    }

    /* Right Visual Column */
    .hero-right {
      display: flex;
      justify-content: center;
    }

    .hero-image-card {
      position: relative;
      width: 100%;
      max-width: 540px;
      height: 520px;
      border-radius: 32px;
      overflow: hidden;
      box-shadow: 0 24px 50px -12px rgba(0, 0, 0, 0.15);
      background-color: #f1f5f9;
    }

    @media (max-width: 640px) {
      .hero-image-card {
        height: 420px;
        border-radius: 24px;
      }
    }

    .hero-product-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.6s ease;
    }

    .hero-image-card:hover .hero-product-img {
      transform: scale(1.02);
    }

    /* Handwritten Script Calligraphy Overlay */
    .script-overlay {
      position: absolute;
      top: 36px;
      left: 36px;
      font-family: 'Caveat', 'Dancing Script', cursive;
      font-size: 2.85rem;
      font-weight: 700;
      color: #ffffff;
      line-height: 1;
      transform: rotate(-6deg);
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.7);
      pointer-events: none;
      z-index: 5;
    }

    /* Bottom-Right Floating Card: Small steps. Healthier tomorrows. */
    .floating-motto-card {
      position: absolute;
      bottom: 24px;
      right: 24px;
      background: rgba(78, 102, 88, 0.92);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-radius: 16px;
      padding: 0.75rem 1.15rem;
      display: flex;
      align-items: center;
      gap: 0.85rem;
      color: #ffffff;
      box-shadow: 0 16px 36px -6px rgba(0, 0, 0, 0.22);
      z-index: 10;
      border: 1px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
    }

    .floating-motto-card:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 20px 42px -6px rgba(0, 0, 0, 0.28);
    }

    .motto-icon-box {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .motto-text {
      display: flex;
      flex-direction: column;
      font-size: 0.8rem;
      font-weight: 600;
      line-height: 1.25;
      color: #ffffff;
    }

    .motto-arrow-btn {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.22);
      color: #ffffff;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease;
      flex-shrink: 0;
    }

    .floating-motto-card:hover .motto-arrow-btn {
      background: rgba(255, 255, 255, 0.45);
    }

    /* 5-Item Feature Strip Below Hero */
    .feature-strip {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1.5rem;
      margin-top: 4.5rem;
      padding-top: 2rem;
      border-top: 1px solid #f1f5f9;
    }

    @media (max-width: 1100px) {
      .feature-strip {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 768px) {
      .feature-strip {
        grid-template-columns: 1fr;
        gap: 1.25rem;
      }
    }

    .feature-strip-item {
      display: flex;
      align-items: center;
      gap: 0.95rem;
      padding: 0.75rem 0.85rem;
      border-radius: 16px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .feature-strip-item:hover {
      background: #f8fafc;
      transform: translateY(-3px);
      box-shadow: 0 8px 20px -6px rgba(0, 0, 0, 0.06);
    }

    .feature-icon-circle {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.2s ease;
    }

    .feature-icon-circle.wa-circle {
      background: #ecfdf5;
      border-color: #a7f3d0;
    }

    .feature-strip-item:hover .feature-icon-circle {
      background: #eaf3ec;
      border-color: #a7f3d0;
      transform: translateY(-2px);
    }

    .feature-item-text {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .feature-title {
      font-size: 0.92rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.25;
      margin-bottom: 0.15rem;
    }

    .feature-sub {
      font-size: 0.78rem;
      color: #64748b;
      line-height: 1.3;
    }

    .feature-arrow-indicator {
      font-size: 0.95rem;
      font-weight: 700;
      color: #94a3b8;
      opacity: 0;
      transition: all 0.2s ease;
      margin-left: 0.25rem;
    }

    .feature-strip-item:hover .feature-arrow-indicator {
      opacity: 1;
      transform: translateX(3px);
      color: #12382e;
    }

    /* Modal Backdrop & Shared Styles */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      z-index: 3000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      overflow-y: auto;
      box-sizing: border-box;
    }

    .modal-dialog {
      background: #ffffff;
      border-radius: 24px;
      width: 100%;
      max-width: 720px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.3);
      animation: modalScale 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes modalScale {
      from { opacity: 0; transform: scale(0.94); }
      to { opacity: 1; transform: scale(1); }
    }

    .modal-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 1.75rem 2rem 1.25rem;
      border-bottom: 1px solid #f1f5f9;
      position: sticky;
      top: 0;
      background: #ffffff;
      z-index: 10;
    }

    .badge-tag {
      font-size: 0.72rem;
      font-weight: 700;
      color: #12382e;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 0.35rem;
      display: block;
    }

    .modal-title-group h3 {
      font-size: 1.35rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
    }

    .modal-close-btn {
      background: #f1f5f9;
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      font-size: 1rem;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-close-btn:hover {
      background: #e2e8f0;
      color: #0f172a;
    }

    .modal-body-content {
      padding: 1.75rem 2rem 2rem;
    }

    /* Product Demo / Breg T Scope Modal */
    .product-feature-hero {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 1.75rem;
      align-items: center;
      margin-bottom: 1.75rem;
    }

    @media (max-width: 640px) {
      .product-feature-hero {
        grid-template-columns: 1fr;
      }
    }

    .modal-thumb-img {
      width: 100%;
      height: 240px;
      object-fit: cover;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
    }

    .feature-breakdown h4 {
      font-size: 1.05rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 0.5rem;
    }

    .feature-breakdown p {
      font-size: 0.88rem;
      color: #475569;
      line-height: 1.55;
      margin-bottom: 1rem;
    }

    /* Interactive ROM Simulator */
    .rom-interactive-panel {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 14px;
      padding: 1rem;
      margin-bottom: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .rom-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .rom-label {
      font-size: 0.78rem;
      font-weight: 700;
      color: #12382e;
      min-width: 105px;
    }

    .rom-btns {
      display: flex;
      gap: 0.4rem;
      flex-wrap: wrap;
    }

    .rom-chip {
      padding: 0.3rem 0.65rem;
      border-radius: 8px;
      border: 1px solid #a7f3d0;
      background: #ffffff;
      font-size: 0.75rem;
      font-weight: 700;
      color: #12382e;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .rom-chip.active {
      background: #12382e;
      color: #ffffff;
      border-color: #12382e;
    }

    .rom-status-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px dashed #86efac;
      font-size: 0.82rem;
      color: #12382e;
      flex-wrap: wrap;
    }

    .drop-lock-btn {
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      font-size: 0.75rem;
      font-weight: 700;
      color: #334155;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .drop-lock-btn.locked {
      background: #fef2f2;
      border-color: #fecaca;
      color: #b91c1c;
    }

    .spec-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.65rem;
      background: #f8fafc;
      padding: 0.85rem;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }

    .spec-cell {
      display: flex;
      flex-direction: column;
    }

    .spec-label {
      font-size: 0.7rem;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
    }

    .spec-val {
      font-size: 0.82rem;
      font-weight: 700;
      color: #0f172a;
    }

    .modal-action-bar {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      justify-content: flex-end;
      padding-top: 1.25rem;
      border-top: 1px solid #f1f5f9;
      flex-wrap: wrap;
    }

    .btn-fast-whatsapp {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      background-color: #25d366;
      color: #ffffff;
      padding: 0.85rem 1.45rem;
      border-radius: 9999px;
      font-size: 0.92rem;
      font-weight: 700;
      border: none;
      cursor: pointer;
      text-decoration: none;
      box-shadow: 0 4px 14px rgba(37, 211, 102, 0.3);
      transition: all 0.2s ease;
    }

    .btn-fast-whatsapp:hover {
      background-color: #1eb855;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
    }

    .btn-outline-dark {
      padding: 0.85rem 1.4rem;
      border-radius: 9999px;
      border: 1.5px solid #cbd5e1;
      color: #0f172a;
      font-size: 0.92rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
    }

    .btn-outline-dark:hover {
      border-color: #12382e;
      color: #12382e;
    }
  `]
})
export class HeroComponent {
  whatsAppUrl: string;
  isVideoModalOpen = signal(false);

  // ROM Interactive Simulator
  currentExtension = signal('0°');
  currentFlexion = signal('90°');
  isDropLocked = signal(false);

  constructor(
    private productsService: ProductsService,
    public authService: AuthService,
    private router: Router
  ) {
    this.whatsAppUrl = this.productsService.getWhatsAppInquiryUrl();
  }

  // Product Video & ROM Modal Handlers
  openVideoModal(): void {
    this.isVideoModalOpen.set(true);
  }

  closeVideoModal(): void {
    this.isVideoModalOpen.set(false);
  }

  setExtension(val: string): void {
    this.currentExtension.set(val);
  }

  setFlexion(val: string): void {
    this.currentFlexion.set(val);
  }

  toggleDropLock(): void {
    this.isDropLocked.update(v => !v);
  }

  // Section Scrolling
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
