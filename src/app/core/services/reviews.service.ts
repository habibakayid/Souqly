import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { map, tap } from 'rxjs';
import { env } from '../environments/env';
import { Review } from '../models/review';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private readonly http = inject(HttpClient);
  private readonly toastr = inject(ToastrService);
  private readonly translate = inject(TranslateService);
  private readonly api = `${env.baseUrl}/api/v1`;

  list(productId: string) {
    return this.http
      .get<{ data: Review[] }>(`${this.api}/products/${productId}/reviews`)
      .pipe(map((r) => r.data ?? []));
  }

  add(productId: string, body: { review: string; rating: number }) {
    return this.http.post(`${this.api}/products/${productId}/reviews`, body).pipe(
      tap(() => this.toastr.success(this.translate.instant('toast.reviewAdded'))),
    );
  }

  remove(reviewId: string) {
    return this.http.delete(`${this.api}/reviews/${reviewId}`).pipe(
      tap(() => this.toastr.success(this.translate.instant('toast.reviewRemoved'))),
    );
  }
}