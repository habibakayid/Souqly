import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { env } from '../environments/env';
import { Paged, SubCategory } from '../models/product';

@Injectable({ providedIn: 'root' })
export class SubcategoriesService {
  private readonly http = inject(HttpClient);
  private readonly url = `${env.baseUrl}/api/v1/subcategories`;

  list() {
    return this.http
      .get<Paged<SubCategory>>(this.url, { params: new HttpParams().set('limit', 100) })
      .pipe(map((r) => r.data));
  }
}