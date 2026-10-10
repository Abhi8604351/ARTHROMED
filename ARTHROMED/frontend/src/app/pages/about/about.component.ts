import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="about-page">
      <!-- 1. Header Banner -->
      <section class="about-header-banner">
        <div class="container banner-inner">
          <div class="breadcrumb">
            <a routerLink="/" class="crumb-link">Home</a> &gt; <span class="current">About Arthromed</span>
          </div>
          <span class="motto-pill">“Healthcare for Better Life”</span>
          <h1 class="about-hero-title">About Arthromed Healthcare</h1>
          <p class="about-hero-subtitle">
            Founded in 2014 in Mumbai, Arthromed Healthcare is a premier channel partner and authorized distributor for 
            <strong>ARTHREX®</strong> and <strong>BREG®</strong> products across major hospitals in Mumbai, Navi Mumbai, and Nashik.
          </p>
        </div>
      </section>

      <!-- 2. Main Company Intro Section -->
      <section class="company-intro-section container">
        <div class="intro-grid">
          <!-- Left: Brand Logo Card -->
          <div class="intro-logo-card card">
            <div class="logo-display-box">
              <img
                src="/Breg/Logo.png"
                alt="Arthromed Healthcare - Healthcare for better life !"
                class="company-logo-img"
              />
            </div>
            <div class="established-tag">
              <span class="est-label">Established</span>
              <span class="est-year">2014</span>
              <span class="est-loc">Mumbai, Maharashtra, India</span>
            </div>
            <div class="partnership-badges">
              <div class="partner-badge">
                <span class="badge-dot"></span>
                <span>ARTHREX® Channel Partner</span>
              </div>
              <div class="partner-badge">
                <span class="badge-dot"></span>
                <span>BREG® Certified Distributor</span>
              </div>
            </div>
          </div>

          <!-- Right: Company Overview & Specializations -->
          <div class="intro-content">
            <span class="eyebrow-accent">WHO WE ARE</span>
            <h2 class="section-title">Say Hello to Arthromed Healthcare</h2>
            <p class="lead-text">
              Arthromed Healthcare is committed to providing surgeons with world-class quality of services and certified cutting-edge medical devices.
            </p>
            <p class="body-text">
              Since 2014, we have operated as an indispensable bridge between world-renowned orthopedic device manufacturers and leading orthopedic surgeons. With a presence across tertiary healthcare facilities and hospitals in Mumbai, Navi Mumbai, and Nashik, we deliver surgical precision, rapid product availability, and clinical reliability where it matters most.
            </p>

            <!-- Focus Areas Grid -->
            <div class="focus-areas-container">
              <h3 class="focus-title">Clinical Focus Areas &amp; Product Solutions</h3>
              <div class="focus-grid">
                <div class="focus-pill">
                  <span class="pill-icon">🏃‍♂️</span>
                  <span>Sports Medicine</span>
                </div>
                <div class="focus-pill">
                  <span class="pill-icon">🦴</span>
                  <span>Trauma &amp; Fracture Care</span>
                </div>
                <div class="focus-pill">
                  <span class="pill-icon">🦵</span>
                  <span>Knee Surgery &amp; Reconstruction</span>
                </div>
                <div class="focus-pill">
                  <span class="pill-icon">🦾</span>
                  <span>Orthopedic Bracing &amp; Supports</span>
                </div>
                <div class="focus-pill">
                  <span class="pill-icon">🩺</span>
                  <span>Surgical Instrumentation</span>
                </div>
                <div class="focus-pill">
                  <span class="pill-icon">🦶</span>
                  <span>Pneumatic Air Walkers</span>
                </div>
              </div>

              <!-- Flagship Implants & Devices -->
              <div class="flagship-card">
                <span class="flagship-label">Flagship Surgical Systems:</span>
                <div class="flagship-tags">
                  <span class="device-tag">FiberStitch™</span>
                  <span class="device-tag">FlipCutter® III Drill</span>
                  <span class="device-tag">ACL TightRope® II Implant</span>
                  <span class="device-tag">Breg® ROM Knee Bracing</span>
                  <span class="device-tag">Genesis Full Shell Walkers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Vision & Mission Section -->
      <section class="vision-mission-section">
        <div class="container">
          <div class="vm-grid">
            <!-- Our Vision -->
            <div class="vm-card card">
              <div class="vm-icon-box vision-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <h3 class="vm-title">Our Vision</h3>
              <p class="vm-quote">“At Arthromed, we believe in giving 110%.”</p>
              <p class="vm-desc">
                By closing the loop and delivering world-class medical supplies, we help surgeons and hospitals grow and nurture their patients with the latest healthcare products. We thrive because of our deep market knowledge, clinical integrity, and the great team behind our products.
              </p>
            </div>

            <!-- Our Mission -->
            <div class="vm-card card">
              <div class="vm-icon-box mission-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <h3 class="vm-title">Our Mission</h3>
              <p class="vm-quote">“Committed to Zero-Compromise Surgical Care”</p>
              <p class="vm-desc">
                We are constantly working hard to add new verticals and deepen our presence in the medical device industry. Our mission is to empower operating rooms with premier devices and flawless technical support so that every patient journey leads to restoration and active living.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Key Strategic Pillars & 50+ Team -->
      <section class="pillars-section container">
        <div class="section-header text-center">
          <span class="eyebrow-accent">OPERATIONAL EXCELLENCE</span>
          <h2 class="section-title">The Pillars That Set Us Apart</h2>
          <p class="section-subtitle">
            From the operating room to hospital administration, our multi-tiered support ecosystem ensures seamless clinical execution.
          </p>
        </div>

        <div class="pillars-grid">
          <!-- Card 1: 50+ Team -->
          <div class="pillar-card card">
            <div class="pillar-stat">50+</div>
            <h4 class="pillar-title">Team of Excellence</h4>
            <p class="pillar-desc">
              We have a dedicated team of 50+ specialized employees whose clinical expertise, responsiveness, and discipline make Arthromed strong, dependable, and successful.
            </p>
          </div>

          <!-- Card 2: Surgeon to Surgeon Marking -->
          <div class="pillar-card card highlight-pillar">
            <div class="pillar-icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
            </div>
            <h4 class="pillar-title">Surgeon to Surgeon Marking</h4>
            <p class="pillar-desc">
              Our award-winning operating room strategy: our trained scrub technicians personally attend surgery suites to assist orthopedic surgeons for smooth, precise, and hassle-free implantations.
            </p>
          </div>

          <!-- Card 3: Skill Improvements -->
          <div class="pillar-card card">
            <div class="pillar-icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
            <h4 class="pillar-title">Continuous Skill Development</h4>
            <p class="pillar-desc">
              Our scrub technicians undergo continuous training and certification on the latest surgical tools, implants, and arthroscopic techniques to remain at the cutting edge of modern medicine.
            </p>
          </div>

          <!-- Card 4: Zero Difficulties -->
          <div class="pillar-card card">
            <div class="pillar-icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h4 class="pillar-title">Flawless Surgical Support</h4>
            <p class="pillar-desc">
              We do our absolute best so that our partnered surgeons face ZERO difficulties before, during, or after surgical implantation procedures.
            </p>
          </div>

          <!-- Card 5: Prompt Quotations & Billing -->
          <div class="pillar-card card">
            <div class="pillar-icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="5" width="20" height="14" rx="2"/>
                <line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
            </div>
            <h4 class="pillar-title">Efficient Quotations &amp; Billing</h4>
            <p class="pillar-desc">
              Our back office operates with speed and precision, delivering rapid quotations, transparent billing, and effortless administrative coordination for hospital procurement teams.
            </p>
          </div>

          <!-- Card 6: Geographic Presence -->
          <div class="pillar-card card">
            <div class="pillar-icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <h4 class="pillar-title">Strategic Network</h4>
            <p class="pillar-desc">
              Deep hospital integration and rapid stock dispatch across premier healthcare networks in Mumbai, Navi Mumbai, and Nashik.
            </p>
          </div>
        </div>
      </section>

      <!-- 5. Leadership Profile: Parag Shah (Founder & Leadership) -->
      <section class="leadership-section">
        <div class="container">
          <div class="leadership-card card">
            <div class="leader-grid">
              <!-- Left: Photo Frame & Credentials -->
              <div class="leader-visual">
                <div class="leader-photo-frame">
                  <!-- Image tag pointing to Parag Shah's photo with fallback avatar -->
                  <img
                    [src]="leaderPhotoUrl()"
                    (error)="onPhotoError()"
                    alt="Parag Shah - Founder, Arthromed Healthcare"
                    class="leader-img"
                  />
                  @if (photoFallback()) {
                    <div class="leader-initials-fallback">
                      <span class="initials-text">PS</span>
                      <span class="upload-hint">Parag Shah</span>
                    </div>
                  }
                </div>
                <div class="leader-credentials-badge">
                  <span class="cred-title">Parag Shah</span>
                  <span class="cred-role">Founder &amp; Managing Director</span>
                  <span class="cred-exp">Leading Arthromed Since 2014</span>
                </div>
              </div>

              <!-- Right: Bio & Leadership Vision -->
              <div class="leader-bio">
                <span class="eyebrow-accent">LEADERSHIP SPOTLIGHT</span>
                <h2 class="leader-name">Parag Shah</h2>
                <h3 class="leader-designation">Founder &amp; Managing Director, Arthromed Healthcare</h3>

                <blockquote class="leader-quote">
                  “Our commitment has always been rooted in providing Indian surgeons with the exact same gold-standard medical devices, precision implants, and in-person technical scrub assistance that the best hospitals worldwide demand.”
                </blockquote>

                <div class="bio-paragraphs">
                  <p>
                    <strong>Parag Shah</strong> founded Arthromed Healthcare in 2014 with an unwavering focus on transforming orthopedic and sports medicine distribution in Maharashtra. Recognizing the critical need for surgeon-centric support, he established Arthromed as an authorized channel partner for global giants <strong>Arthrex®</strong> and <strong>Breg®</strong>.
                  </p>
                  <p>
                    Under his leadership over the past decade, Arthromed has grown from an ambitious healthcare enterprise into a robust organization powered by <strong>50+ dedicated medical and technical professionals</strong>. He pioneered the company’s signature <em>“Surgeon to Surgeon Marking”</em> model—ensuring certified scrub technicians support operating rooms during intricate arthroscopic and trauma procedures.
                  </p>
                  <p>
                    Today, Mr. Shah actively steers the organization toward expanding its orthopedic horizons, integrating next-generation surgical devices, and delivering on the founding promise: <em>“Healthcare for Better Life”</em>.
                  </p>
                </div>

                <!-- Leader Stats Strip -->
                <div class="leader-stats-strip">
                  <div class="stat-item">
                    <span class="stat-num">2014</span>
                    <span class="stat-lbl">Founded Company</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-num">50+</span>
                    <span class="stat-lbl">Team Members</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-num">3+</span>
                    <span class="stat-lbl">Key Regions (Mumbai, Navi Mumbai, Nashik)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 6. Headquarters & Direct Inquiries -->
      <section class="contact-cta-section container">
        <div class="cta-inner card">
          <div class="cta-content">
            <span class="eyebrow-accent-light">GET IN TOUCH</span>
            <h2 class="cta-title">Collaborate with Arthromed Healthcare</h2>
            <p class="cta-desc">
              Whether you are an orthopedic surgeon, surgical team, hospital procurement director, or patient requiring verified Breg® bracing, our team is at your service.
            </p>
            <div class="contact-details-grid">
              <div class="cta-contact-item">
                <strong>Corporate Office:</strong>
                <span>Arthromed, Ashok Heights, 1302, Nicolas Wadi Rd, Verma Nagar, Gundavali Gaothan, Andheri East, Mumbai, Maharashtra 400069</span>
              </div>
              <div class="cta-contact-item">
                <strong>Plus Code:</strong>
                <span>4VF4+52 Mumbai, Maharashtra</span>
              </div>
              <div class="cta-contact-item">
                <strong>Official Email:</strong>
                <span>arthromed.2014&#64;gmail.com</span>
              </div>
            </div>
          </div>
          <div class="cta-actions">
            <a routerLink="/products" class="btn-cta-products">Explore Product Catalog &rarr;</a>
            <a href="https://wa.me/918604351930?text=Hello%20Arthromed%20Healthcare,%20I%20would%20like%20to%20inquire%20about%20your%20orthopedic%20products." 
               target="_blank" rel="noopener noreferrer" class="btn-cta-whatsapp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/>
              </svg>
              <span>Connect on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .about-page {
      background-color: #f8fafc;
      padding-bottom: 5rem;
    }

    /* 1. Header Banner */
    .about-header-banner {
      background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%);
      color: #ffffff;
      padding: 3.5rem 0 3.75rem;
      margin-bottom: 3rem;
    }

    .breadcrumb {
      font-size: 0.85rem;
      color: #94a3b8;
      margin-bottom: 1rem;
    }

    .crumb-link {
      color: #94a3b8;
      text-decoration: none;
      transition: color var(--transition-fast);
    }

    .crumb-link:hover {
      color: #ffffff;
    }

    .breadcrumb .current {
      color: #5eead4;
      font-weight: 600;
    }

    .motto-pill {
      display: inline-block;
      background: rgba(34, 197, 94, 0.15);
      color: #86efac;
      border: 1px solid rgba(34, 197, 94, 0.3);
      padding: 0.35rem 0.9rem;
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      margin-bottom: 1rem;
    }

    .about-hero-title {
      font-size: 2.5rem;
      color: #ffffff;
      margin-bottom: 0.85rem;
      letter-spacing: -0.02em;
      font-weight: 800;
    }

    @media (max-width: 640px) {
      .about-hero-title {
        font-size: 1.95rem;
      }
    }

    .about-hero-subtitle {
      font-size: 1.08rem;
      color: #cbd5e1;
      max-width: 780px;
      line-height: 1.65;
    }

    /* 2. Company Intro */
    .company-intro-section {
      margin-bottom: 4rem;
    }

    .intro-grid {
      display: grid;
      grid-template-columns: 340px 1fr;
      gap: 3rem;
      align-items: start;
    }

    @media (max-width: 900px) {
      .intro-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }

    .intro-logo-card {
      padding: 2rem;
      background: #ffffff;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-md);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .logo-display-box {
      width: 100%;
      min-height: 130px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background: #ffffff;
      border-radius: var(--radius-md);
      margin-bottom: 1.5rem;
    }

    .company-logo-img {
      max-width: 220px;
      height: auto;
      max-height: 80px;
      object-fit: contain;
    }

    .established-tag {
      width: 100%;
      padding: 1rem 0;
      border-top: 1px solid var(--color-border);
      border-bottom: 1px solid var(--color-border);
      margin-bottom: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .est-label {
      font-size: 0.75rem;
      color: var(--color-text-light);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }

    .est-year {
      font-size: 1.5rem;
      color: var(--color-primary);
      font-weight: 800;
    }

    .est-loc {
      font-size: 0.85rem;
      color: var(--color-text-muted);
    }

    .partnership-badges {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      width: 100%;
    }

    .partner-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #f1f5f9;
      padding: 0.55rem 0.85rem;
      border-radius: var(--radius-sm);
      font-size: 0.825rem;
      font-weight: 600;
      color: var(--color-primary-dark);
    }

    .badge-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #15803d;
    }

    .eyebrow-accent {
      font-size: 0.8rem;
      color: #15803d;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      display: block;
      margin-bottom: 0.5rem;
    }

    .section-title {
      font-size: 2rem;
      color: var(--color-primary-dark);
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 1rem;
    }

    .lead-text {
      font-size: 1.15rem;
      color: var(--color-primary);
      font-weight: 600;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .body-text {
      font-size: 0.98rem;
      color: var(--color-text-muted);
      line-height: 1.7;
      margin-bottom: 2rem;
    }

    .focus-areas-container {
      background: #ffffff;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 1.5rem;
    }

    .focus-title {
      font-size: 1.05rem;
      color: var(--color-primary-dark);
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .focus-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .focus-pill {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #f8fafc;
      border: 1px solid var(--color-border);
      padding: 0.6rem 0.85rem;
      border-radius: var(--radius-sm);
      font-size: 0.885rem;
      font-weight: 600;
      color: var(--color-text-main);
    }

    .pill-icon {
      font-size: 1.1rem;
    }

    .flagship-card {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      padding: 1rem 1.25rem;
      border-radius: var(--radius-sm);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .flagship-label {
      font-size: 0.825rem;
      font-weight: 700;
      color: #166534;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .flagship-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .device-tag {
      background: #ffffff;
      color: #166534;
      border: 1px solid #86efac;
      padding: 0.25rem 0.6rem;
      border-radius: var(--radius-sm);
      font-size: 0.825rem;
      font-weight: 600;
    }

    /* 3. Vision & Mission */
    .vision-mission-section {
      background: linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%);
      padding: 4.5rem 0;
      margin-bottom: 4rem;
    }

    .vm-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2.5rem;
    }

    @media (max-width: 768px) {
      .vm-grid {
        grid-template-columns: 1fr;
      }
    }

    .vm-card {
      background: #ffffff;
      border-radius: var(--radius-lg);
      padding: 2.5rem;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--color-border);
      position: relative;
    }

    .vm-icon-box {
      width: 54px;
      height: 54px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
    }

    .vision-icon {
      background: #ecfdf5;
      color: #059669;
    }

    .mission-icon {
      background: #eff6ff;
      color: #2563eb;
    }

    .vm-title {
      font-size: 1.45rem;
      color: var(--color-primary-dark);
      font-weight: 800;
      margin-bottom: 0.5rem;
    }

    .vm-quote {
      font-size: 1.05rem;
      color: var(--color-accent);
      font-weight: 700;
      font-style: italic;
      margin-bottom: 0.85rem;
    }

    .vm-desc {
      font-size: 0.95rem;
      color: var(--color-text-muted);
      line-height: 1.65;
    }

    /* 4. Strategic Pillars */
    .pillars-section {
      margin-bottom: 4.5rem;
    }

    .section-header {
      margin-bottom: 2.75rem;
    }

    .section-subtitle {
      font-size: 1.05rem;
      color: var(--color-text-muted);
      max-width: 650px;
      margin: 0 auto;
      line-height: 1.6;
    }

    .pillars-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.75rem;
    }

    @media (max-width: 992px) {
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
      background: #ffffff;
      padding: 2rem;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      transition: transform var(--transition-fast), box-shadow var(--transition-fast);
      display: flex;
      flex-direction: column;
    }

    .pillar-card:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-md);
    }

    .highlight-pillar {
      border-color: #86efac;
      background: #fcfdfd;
    }

    .pillar-stat {
      font-size: 2.5rem;
      font-weight: 900;
      color: #15803d;
      line-height: 1;
      margin-bottom: 1rem;
    }

    .pillar-icon-circle {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      background: #f1f5f9;
      color: var(--color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .highlight-pillar .pillar-icon-circle {
      background: #dcfce7;
      color: #15803d;
    }

    .pillar-title {
      font-size: 1.15rem;
      color: var(--color-primary-dark);
      font-weight: 700;
      margin-bottom: 0.6rem;
    }

    .pillar-desc {
      font-size: 0.915rem;
      color: var(--color-text-muted);
      line-height: 1.6;
    }

    /* 5. Leadership Profile: Parag Shah */
    .leadership-section {
      background: #ffffff;
      padding: 4.5rem 0;
      border-top: 1px solid var(--color-border);
      border-bottom: 1px solid var(--color-border);
      margin-bottom: 4rem;
    }

    .leadership-card {
      background: #f8fafc;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      padding: 3rem;
      box-shadow: var(--shadow-lg);
    }

    @media (max-width: 640px) {
      .leadership-card {
        padding: 1.5rem;
      }
    }

    .leader-grid {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 3.5rem;
      align-items: center;
    }

    @media (max-width: 900px) {
      .leader-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }

    .leader-visual {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .leader-photo-frame {
      width: 240px;
      height: 280px;
      border-radius: var(--radius-lg);
      overflow: hidden;
      background: linear-gradient(135deg, #12382e 0%, #0b241d 100%);
      box-shadow: 0 10px 25px -5px rgba(18, 56, 46, 0.35);
      border: 4px solid #ffffff;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .leader-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .leader-initials-fallback {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0b241d 0%, #164e63 100%);
      color: #ffffff;
    }

    .initials-text {
      font-size: 4rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #5eead4;
    }

    .upload-hint {
      font-size: 0.8rem;
      color: #94a3b8;
      margin-top: 0.25rem;
      font-weight: 600;
    }

    .leader-credentials-badge {
      margin-top: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .cred-title {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--color-primary-dark);
    }

    .cred-role {
      font-size: 0.9rem;
      color: #15803d;
      font-weight: 700;
    }

    .cred-exp {
      font-size: 0.8rem;
      color: var(--color-text-light);
    }

    .leader-name {
      font-size: 2.3rem;
      color: var(--color-primary-dark);
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 0.25rem;
    }

    .leader-designation {
      font-size: 1.1rem;
      color: #15803d;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }

    .leader-quote {
      background: #ffffff;
      border-left: 4px solid #15803d;
      padding: 1.25rem 1.5rem;
      border-radius: 0 var(--radius-md) var(--radius-md) 0;
      font-size: 1rem;
      font-style: italic;
      color: var(--color-primary);
      margin-bottom: 1.5rem;
      box-shadow: var(--shadow-sm);
    }

    .bio-paragraphs {
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
      margin-bottom: 2rem;
    }

    .bio-paragraphs p {
      font-size: 0.965rem;
      color: var(--color-text-muted);
      line-height: 1.7;
    }

    .leader-stats-strip {
      display: flex;
      gap: 2.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--color-border);
      flex-wrap: wrap;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
    }

    .stat-num {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--color-primary);
    }

    .stat-lbl {
      font-size: 0.8rem;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    /* 6. Contact CTA */
    .contact-cta-section {
      margin-top: 1rem;
    }

    .cta-inner {
      background: linear-gradient(135deg, #0b241d 0%, #12382e 100%);
      color: #ffffff;
      padding: 3rem;
      border-radius: var(--radius-lg);
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 3rem;
      align-items: center;
    }

    @media (max-width: 900px) {
      .cta-inner {
        grid-template-columns: 1fr;
        padding: 2rem;
        gap: 2rem;
      }
    }

    .eyebrow-accent-light {
      font-size: 0.8rem;
      color: #86efac;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      display: block;
      margin-bottom: 0.5rem;
    }

    .cta-title {
      font-size: 1.85rem;
      color: #ffffff;
      font-weight: 800;
      margin-bottom: 0.75rem;
    }

    .cta-desc {
      font-size: 0.965rem;
      color: #cbd5e1;
      max-width: 620px;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .contact-details-grid {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .cta-contact-item {
      font-size: 0.885rem;
      color: #cbd5e1;
      line-height: 1.5;
    }

    .cta-contact-item strong {
      color: #ffffff;
      margin-right: 0.4rem;
    }

    .cta-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 240px;
    }

    .btn-cta-products {
      background: #ffffff;
      color: var(--color-primary-dark);
      text-decoration: none;
      font-weight: 700;
      font-size: 0.95rem;
      padding: 0.85rem 1.4rem;
      border-radius: var(--radius-md);
      text-align: center;
      transition: all var(--transition-fast);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .btn-cta-products:hover {
      background: #f1f5f9;
      transform: translateY(-2px);
    }

    .btn-cta-whatsapp {
      background: var(--color-whatsapp);
      color: #ffffff;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.95rem;
      padding: 0.85rem 1.4rem;
      border-radius: var(--radius-md);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all var(--transition-fast);
      box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
    }

    .btn-cta-whatsapp:hover {
      background: var(--color-whatsapp-hover);
      transform: translateY(-2px);
    }
  `]
})
export class AboutComponent {
  // Parag Shah's photo source path. When the user places the image at /Breg/parag-shah.jpg, it loads automatically.
  public readonly leaderPhotoUrl = signal<string>('/Breg/parag-shah.jpg');
  public readonly photoFallback = signal<boolean>(true);

  onPhotoError(): void {
    // Graceful fallback to initials badge if the file has not yet been uploaded
    this.photoFallback.set(true);
  }
}
