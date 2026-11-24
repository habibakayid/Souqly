import { NgOptimizedImage } from '@angular/common';
import { afterNextRender, Component, effect, inject, Injector, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Product } from '../../../core/models/product';
import { FlowbiteService } from '../../../core/services/flowbite.service';
import { EgpPipe } from '../../pipes/egp-pipe';

@Component({
  selector: 'app-hero-carousel',
  imports: [RouterLink, NgOptimizedImage, TranslatePipe, EgpPipe],
  templateUrl: './hero-carousel.html',
})
export class HeroCarousel {
  readonly slides = input.required<Product[]>();

  private readonly flowbite = inject(FlowbiteService);
  private readonly injector = inject(Injector);

  constructor() {
    effect(() => {
      if (this.slides().length) {
        afterNextRender(() => this.flowbite.initCarousels(), { injector: this.injector });
      }
    });
  }
}