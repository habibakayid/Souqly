import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { env } from '../environments/env';
import { Category } from '../models/category';
import { Paged, SubCategory } from '../models/product';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly http = inject(HttpClient);
  private readonly url = `${env.baseUrl}/api/v1/categories`;

  list() {
    return this.http
      .get<Paged<Category>>(this.url, { params: new HttpParams().set('limit', 100) })
      .pipe(map((r) => r.data));
  }
  get(id: string) {
    return this.http.get<{ data: Category }>(`${this.url}/${id}`).pipe(map((r) => r.data));
  }
  subcategories(id: string) {
    return this.http.get<{ data: SubCategory[] }>(`${this.url}/${id}/subcategories`).pipe(map((r) => r.data));
  }
}