import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, map, of } from 'rxjs';
import { BrandsService } from '../../core/services/brands.service';
import { CategoriesService } from '../../core/services/categories.service';
import { ProductsService } from '../../core/services/products.service';
import { HeroCarousel } from '../../shared/components/hero-carousel/hero-carousel';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { SectionTitle } from '../../shared/components/section-title/section-title';
import { Skeleton } from '../../shared/components/skeleton/skeleton';

@Component({
  selector: 'app-home',
  imports: [RouterLink, TranslatePipe, HeroCarousel, ProductCard, SectionTitle, Skeleton],
  templateUrl: './home.html',
})
export class Home {
  private readonly products = inject(ProductsService);
  private readonly categoriesApi = inject(CategoriesService);
  private readonly brandsApi = inject(BrandsService);

  protected readonly hero = toSignal(
    this.products.list({ sort: '-ratingsAverage', limit: 5 }).pipe(
      map((r) => r.data),
      catchError(() => of([])),
    ),
  );
  protected readonly trending = toSignal(
    this.products.list({ sort: '-sold', limit: 8 }).pipe(
      map((r) => r.data),
      catchError(() => of([])),
    ),
  );
  protected readonly categories = toSignal(this.categoriesApi.list().pipe(catchError(() => of([]))));
  protected readonly brands = toSignal(
    this.brandsApi.list().pipe(
      map((b) => b.slice(0, 12)),
      catchError(() => of([])),
    ),
  );
}