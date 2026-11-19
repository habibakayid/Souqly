import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
// import { env } from '../environments/env';
import { Paged, Product, ProductQuery } from '../models/product';
import { env } from '../environments/env';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);
  private api = `${env['baseUrl']}/api/v1/products`;

  list(q: ProductQuery = {}) {
    let p = new HttpParams();
    if (q.page) p = p.set('page', String(q.page));
    if (q.limit) p = p.set('limit', String(q.limit));
    if (q.sort) p = p.set('sort', q.sort);
    if (q.keyword) p = p.set('keyword', q.keyword);
    if (q.categories?.length) p = p.set('category[in]', q.categories.join(','));
    if (q.brands?.length) p = p.set('brand[in]', q.brands.join(','));
    if (q.minPrice != null) p = p.set('price[gte]', String(q.minPrice));
    if (q.maxPrice != null) p = p.set('price[lte]', String(q.maxPrice));
    return this.http.get<Paged<Product>>(this.api, { params: p });
  }

  get(id: string) {
    return this.http.get<{ data: Product }>(`${this.api}/${id}`).pipe(map((r) => r.data));
  }
}