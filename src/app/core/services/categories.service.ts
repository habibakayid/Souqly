import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { env } from '../environments/env';
import { Named, Paged } from '../models/product';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private http = inject(HttpClient);
  list() {
    return this.http.get<Paged<Named>>(`${env['baseUrl']}/api/v1/categories?limit=100`).pipe(map((r) => r.data));
  }
}
// BrandsService: `${env['baseUrl']}/api/v1/brands?limit=100`