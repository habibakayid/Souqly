import { Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, of, startWith, switchMap } from 'rxjs';
import { ProductQuery } from '../../../core/models/product';
import { BrandsService } from '../../../core/services/brands.service';
import { CategoriesService } from '../../../core/services/categories.service';
import { ProductsService } from '../../../core/services/products.service';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { Skeleton } from '../../../shared/components/skeleton/skeleton';

const csv = (v?: string) => (v ? v.split(',').filter(Boolean) : []);
const num = (v?: string) => (v && !isNaN(+v) ? +v : undefined);

@Component({
  selector: 'app-product-list',
  imports: [TranslatePipe, ProductCard, Pagination, Skeleton, EmptyState],
  templateUrl: './product-list.html',
})
export class ProductList {
  private readonly router = inject(Router);
  private readonly productsApi = inject(ProductsService);

  // الـ query params بتتربط تلقائيًا (withComponentInputBinding)
  readonly keyword = input<string>();
  readonly sort = input<string>();
  readonly page = input<string>();
  readonly category = input<string>();
  readonly brand = input<string>();
  readonly min = input<string>();
  readonly max = input<string>();

  protected readonly view = signal<'grid' | 'list'>('grid');
  protected readonly filtersOpen = signal(false);

  protected readonly categories = toSignal(inject(CategoriesService).list().pipe(catchError(() => of([]))), { initialValue: [] });
  protected readonly brands = toSignal(inject(BrandsService).list().pipe(catchError(() => of([]))), { initialValue: [] });

  protected readonly selCategories = computed(() => csv(this.category()));
  protected readonly selBrands = computed(() => csv(this.brand()));
  protected readonly hasFilters = computed(
    () => !!(this.category() || this.brand() || this.min() || this.max() || this.sort()),
  );

  protected readonly sortOptions = [
    { value: '', key: 'products.sort.default' },
    { value: 'price', key: 'products.sort.priceAsc' },
    { value: '-price', key: 'products.sort.priceDesc' },
    { value: '-ratingsAverage', key: 'products.sort.top' },
    { value: '-sold', key: 'products.sort.best' },
  ];
  protected readonly presets = [500, 1000, 5000, 10000];

  private readonly query = computed<ProductQuery>(() => ({
    page: Math.max(1, num(this.page()) ?? 1),
    limit: 12,
    sort: this.sort() || undefined,
    keyword: this.keyword() || undefined,
    categories: this.selCategories(),
    brands: this.selBrands(),
    minPrice: num(this.min()),
    maxPrice: num(this.max()),
  }));

  /** undefined = بيحمّل، null = error */
  protected readonly result = toSignal(
    toObservable(this.query).pipe(
      switchMap((q) => this.productsApi.list(q).pipe(catchError(() => of(null)), startWith(undefined))),
    ),
  );

  private go(params: Record<string, string | null>, resetPage = true): void {
    this.router.navigate([], {
      queryParams: resetPage ? { ...params, page: null } : params,
      queryParamsHandling: 'merge',
    });
  }

  private toggle(list: string[], id: string): string | null {
    const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
    return next.length ? next.join(',') : null;
  }

  protected toggleCategory(id: string): void { this.go({ category: this.toggle(this.selCategories(), id) }); }
  protected toggleBrand(id: string): void { this.go({ brand: this.toggle(this.selBrands(), id) }); }
  protected setSort(value: string): void { this.go({ sort: value || null }); }
  protected applyPrice(min: string, max: string): void { this.go({ min: min || null, max: max || null }); }
  protected presetMax(value: number): void { this.go({ min: null, max: String(value) }); }
  protected goPage(p: number): void { this.go({ page: p === 1 ? null : String(p) }, false); }
  protected clearAll(): void {
    this.go({ category: null, brand: null, min: null, max: null, sort: null });
  }
}