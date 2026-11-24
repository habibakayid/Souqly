import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { Component, effect, inject, input, linkedSignal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { ProductsService } from '../../../core/services/products.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { Reviews } from '../../../shared/components/reviews/reviews';
import { SectionTitle } from '../../../shared/components/section-title/section-title';
import { EgpPipe } from '../../../shared/pipes/egp-pipe';

@Component({
  selector: 'app-product-details',
  imports: [
    RouterLink,
    NgOptimizedImage,
    DecimalPipe,
    TranslatePipe,
    EgpPipe,
    ProductCard,
    SectionTitle,
    EmptyState,
    Reviews,
  ],
  templateUrl: './product-details.html',
})
export class ProductDetails {
  private readonly api = inject(ProductsService);
  private readonly title = inject(Title);
  protected readonly cart = inject(CartService);
  protected readonly wishlist = inject(WishlistService);

 
  readonly id = input.required<string>();

 
  protected readonly product = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) => this.api.get(id).pipe(catchError(() => of(null)), startWith(undefined))),
    ),
  );

  protected readonly activeImage = linkedSignal<string | null>(() => this.product()?.imageCover ?? null);
  protected readonly qty = linkedSignal(() => (this.product() ? 1 : 1));
  protected readonly stars = [1, 2, 3, 4, 5];

  protected readonly related = toSignal(
    toObservable(this.product).pipe(
      switchMap((p) =>
        p
          ? this.api.list({ categories: [p.category._id], limit: 9 }).pipe(
              map((r) => r.data.filter((x) => x._id !== p._id).slice(0, 4)),
              catchError(() => of([])),
            )
          : of([]),
      ),
    ),
    { initialValue: [] },
  );

  constructor() {
    effect(() => {
      const p = this.product();
      if (p) this.title.setTitle(`${p.title} | Souqly`);
    });
  }

  protected images(): string[] {
    const p = this.product();
    return p ? [p.imageCover, ...(p.images ?? [])] : [];
  }

  protected step(delta: number, max: number): void {
    this.qty.update((q) => Math.min(Math.max(1, q + delta), Math.max(1, max)));
  }
}