import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { env } from '../environments/env';
import { Paged, Product, ProductQuery } from '../models/product';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly url = `${env.baseUrl}/api/v1/products`;

  list(q: ProductQuery = {}): Observable<Paged<Product>> {
    const keyword = q.keyword?.trim().toLowerCase();
    if (!keyword) return this.fetch(q);

   
    const page = q.page ?? 1;
    const limit = q.limit ?? 12;

    return this.fetchAll({ ...q, keyword: undefined, page: undefined, limit: 100 }).pipe(
      map((all) => {
        const matched = all.filter((p) =>
          [p.title, p.category?.name, p.brand?.name].some((t) => t?.toLowerCase().includes(keyword)),
        );
        const pages = Math.max(1, Math.ceil(matched.length / limit));
        const current = Math.min(Math.max(1, page), pages);
        return {
          results: matched.length,
          metadata: { currentPage: current, numberOfPages: pages, limit },
          data: matched.slice((current - 1) * limit, current * limit),
        } as Paged<Product>;
      }),
    );
  }

  get(id: string) {
    return this.http.get<{ data: Product }>(`${this.url}/${id}`).pipe(map((r) => r.data));
  }

  
  private fetch(q: ProductQuery): Observable<Paged<Product>> {
    let p = new HttpParams();
    if (q.page) p = p.set('page', q.page);
    if (q.limit) p = p.set('limit', q.limit);
    if (q.sort) p = p.set('sort', q.sort);
    if (q.categories?.length) p = p.set('category[in]', q.categories.join(','));
    if (q.subcategories?.length) p = p.set('subcategory[in]', q.subcategories.join(','));
    if (q.brands?.length) p = p.set('brand[in]', q.brands.join(','));
    if (q.minPrice != null) p = p.set('price[gte]', q.minPrice);
    if (q.maxPrice != null) p = p.set('price[lte]', q.maxPrice);
    return this.http.get<Paged<Product>>(this.url, { params: p });
  }

  
  private fetchAll(q: ProductQuery): Observable<Product[]> {
    return this.fetch({ ...q, page: 1 }).pipe(
      switchMap((first) => {
        const pages = first.metadata.numberOfPages;
        if (pages <= 1) return of(first.data);
        const rest = Array.from({ length: pages - 1 }, (_, i) => this.fetch({ ...q, page: i + 2 }));
        return forkJoin(rest).pipe(map((r) => [...first.data, ...r.flatMap((x) => x.data)]));
      }),
    );
  }
}