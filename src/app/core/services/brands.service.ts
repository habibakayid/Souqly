import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { env } from '../environments/env';
import { Brand } from '../models/brand';
import { Paged } from '../models/product';

@Injectable({ providedIn: 'root' })
export class BrandsService {
  private readonly http = inject(HttpClient);
  private readonly url = `${env.baseUrl}/api/v1/brands`;

  list() {
    return this.http
      .get<Paged<Brand>>(this.url, { params: new HttpParams().set('limit', 100) })
      .pipe(map((r) => r.data));
  }
  get(id: string) {
    return this.http.get<{ data: Brand }>(`${this.url}/${id}`).pipe(map((r) => r.data));
  }
}