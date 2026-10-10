import { Component } from '@angular/core';
import { HeroComponent } from './sections/hero/hero.component';
import { CareStagesComponent } from './sections/care-stages/care-stages.component';
import { AboutSnippetComponent } from './sections/about-snippet/about-snippet.component';
import { ServicesComponent } from './sections/services/services.component';
import { WhyChooseUsComponent } from './sections/why-choose-us/why-choose-us.component';
import { StatsComponent } from './sections/stats/stats.component';
import { TestimonialsComponent } from './sections/testimonials/testimonials.component';
import { CtaBannerComponent } from './sections/cta-banner/cta-banner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    CareStagesComponent,
    AboutSnippetComponent,
    ServicesComponent,
    WhyChooseUsComponent,
    StatsComponent,
    TestimonialsComponent,
    CtaBannerComponent
  ],
  template: `
    <div class="home-page">
      <app-hero></app-hero>
      <app-care-stages></app-care-stages>
      <app-about-snippet></app-about-snippet>
      <app-services></app-services>
      <app-why-choose-us></app-why-choose-us>
      <app-stats></app-stats>
      <app-testimonials></app-testimonials>
      <app-cta-banner></app-cta-banner>
    </div>
  `,
  styles: [`
    .home-page {
      display: flex;
      flex-direction: column;
    }
  `]
})
export class HomeComponent {}
