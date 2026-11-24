import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { env } from '../environments/env';
import { Paged, Product, ProductQuery } from '../models/product';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly url = `${env.baseUrl}/api/v1/products`;

  list(q: ProductQuery = {}) {
    let p = new HttpParams();
    if (q.page) p = p.set('page', q.page);
    if (q.limit) p = p.set('limit', q.limit);
    if (q.sort) p = p.set('sort', q.sort);
    if (q.keyword) p = p.set('keyword', q.keyword);
    if (q.categories?.length) p = p.set('category[in]', q.categories.join(','));
    if (q.brands?.length) p = p.set('brand[in]', q.brands.join(','));
    if (q.minPrice != null) p = p.set('price[gte]', q.minPrice);
    if (q.maxPrice != null) p = p.set('price[lte]', q.maxPrice);
    return this.http.get<Paged<Product>>(this.url, { params: p });
  }

  get(id: string) {
    return this.http.get<{ data: Product }>(`${this.url}/${id}`).pipe(map((r) => r.data));
  }
}