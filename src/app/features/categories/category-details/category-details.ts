import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, of, startWith, switchMap } from 'rxjs';
import { CategoriesService } from '../../../core/services/categories.service';
import { ProductsService } from '../../../core/services/products.service';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { Skeleton } from '../../../shared/components/skeleton/skeleton';

@Component({
  selector: 'app-category-details',
  imports: [TranslatePipe, ProductCard, Pagination, EmptyState, Skeleton],
  templateUrl: './category-details.html',
})
export class CategoryDetails {
  private readonly categoriesApi = inject(CategoriesService);
  private readonly productsApi = inject(ProductsService);
  private readonly doc = inject(DOCUMENT);

  readonly id = input.required<string>();

  protected readonly category = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) => this.categoriesApi.get(id).pipe(catchError(() => of(null)), startWith(undefined))),
    ),
  );

  protected readonly subcategories = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) => this.categoriesApi.subcategories(id).pipe(catchError(() => of([])))),
    ),
    { initialValue: [] },
  );

  protected readonly page = linkedSignal(() => {
    this.id();
    return 1;
  });

  protected readonly result = toSignal(
    toObservable(computed(() => ({ id: this.id(), page: this.page() }))).pipe(
      switchMap(({ id, page }) =>
        this.productsApi.list({ categories: [id], page, limit: 12 }).pipe(catchError(() => of(null)), startWith(undefined)),
      ),
    ),
  );

  protected goPage(p: number): void {
    this.page.set(p);
    this.doc.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
  }
}