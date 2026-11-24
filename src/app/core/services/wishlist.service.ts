import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal, untracked } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { env } from '../environments/env';
import { Product } from '../models/product';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly toastr = inject(ToastrService);
  private readonly translate = inject(TranslateService);
  private readonly url = `${env.baseUrl}/api/v1/wishlist`;

  readonly items = signal<Product[]>([]);
  readonly ids = signal<string[]>([]);
  readonly count = computed(() => this.ids().length);
  readonly loading = signal(false);

  constructor() {
    effect(() => {
      const token = this.auth.token();
      untracked(() => (token ? this.refresh() : this.reset()));
    });
  }

  has(id: string): boolean {
    return this.ids().includes(id);
  }

  refresh(): void {
    this.loading.set(true);
    this.http.get<{ data: Product[] }>(this.url).subscribe({
      next: (res) => {
        this.items.set(res.data ?? []);
        this.ids.set((res.data ?? []).map((p) => p._id));
        this.loading.set(false);
      },
      error: () => {
        this.reset();
        this.loading.set(false);
      },
    });
  }

  toggle(productId: string): void {
    if (!this.auth.requireLogin()) return;
    if (this.has(productId)) {
      this.http.delete<{ data: string[] }>(`${this.url}/${productId}`).subscribe((res) => {
        this.ids.set(res.data ?? []);
        this.items.update((list) => list.filter((p) => p._id !== productId));
        this.toastr.success(this.translate.instant('toast.wishRemoved'));
      });
    } else {
      this.http.post<{ data: string[] }>(this.url, { productId }).subscribe((res) => {
        this.ids.set(res.data ?? []);
        this.toastr.success(this.translate.instant('toast.wishAdded'));
        this.refresh();
      });
    }
  }

  reset(): void {
    this.items.set([]);
    this.ids.set([]);
  }
}