import { Component } from '@angular/core';

interface StatMetric {
  value: string;
  label: string;
  detail: string;
}

@Component({
  selector: 'app-stats',
  standalone: true,
  template: `
    <section class="stats-section">
      <div class="container">
        <div class="stats-container">
          <div class="stats-header">
            <span class="stats-badge">Clinical Clinical Reach & Impact</span>
            <h2 class="stats-title">Documented Outcomes Across Orthopedic Networks</h2>
          </div>

          <div class="stats-grid">
            @for (stat of stats; track stat.label) {
              <div class="stat-card">
                <div class="stat-value">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
                <p class="stat-detail">{{ stat.detail }}</p>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .stats-section {
      background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%);
      color: #ffffff;
      padding: 5rem 0;
    }
    .stats-container {
      display: flex;
      flex-direction: column;
      gap: 3.5rem;
    }
    .stats-header {
      text-align: center;
      max-width: 650px;
      margin: 0 auto;
    }
    .stats-badge {
      display: inline-block;
      color: #5eead4;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 0.6rem;
      background: rgba(13, 148, 136, 0.2);
      padding: 0.25rem 0.85rem;
      border-radius: var(--radius-full);
      border: 1px solid rgba(45, 212, 191, 0.3);
    }
    .stats-title {
      font-size: 2.15rem;
      color: #ffffff;
      line-height: 1.25;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
    }
    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 640px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
    .stat-card {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 2.25rem 1.75rem;
      border-radius: var(--radius-lg);
      text-align: center;
      transition: all var(--transition-normal);
    }
    .stat-card:hover {
      background: rgba(255, 255, 255, 0.08);
      transform: translateY(-4px);
    }
    .stat-value {
      font-size: 2.85rem;
      font-weight: 800;
      color: #38bdf8;
      font-family: var(--font-primary);
      line-height: 1;
      margin-bottom: 0.75rem;
    }
    .stat-label {
      font-size: 1.05rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.4rem;
    }
    .stat-detail {
      font-size: 0.825rem;
      color: #94a3b8;
      line-height: 1.5;
    }
  `]
})
export class StatsComponent {
  stats: StatMetric[] = [
    {
      value: '25,000+',
      label: 'Patients Mobilized',
      detail: 'Successful post-surgical recoveries with Breg Polar Care cold therapy and bracing.'
    },
    {
      value: '450+',
      label: 'Surgical Centers',
      detail: 'Active orthopedic hospitals and sports medicine clinics supplied monthly.'
    },
    {
      value: '68%',
      label: 'Opioid Reduction',
      detail: 'Documented decrease in analgesic medication usage with motorized cryo-compression.'
    },
    {
      value: '99.2%',
      label: 'Fitting Accuracy',
      detail: 'Precision sizing verified with anatomical measurement guides and expert support.'
    }
  ];
}
