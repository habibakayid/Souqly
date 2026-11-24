import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal, untracked } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { finalize, of, switchMap } from 'rxjs';
import { env } from '../environments/env';
import { CartData, CartResponse } from '../models/cart';
import { AuthService } from './auth.service';

interface AddResponse { data: { products: { product: string; count: number }[] } }

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly toastr = inject(ToastrService);
  private readonly translate = inject(TranslateService);
  private readonly url = `${env.baseUrl}/api/v1/cart`;

  readonly cart = signal<CartData | null>(null);
  readonly count = signal(0);
  readonly loading = signal(false);
 


  readonly busyId = signal<string | null>(null);
  readonly cartId = computed(() => this.cart()?._id ?? null);
  readonly items = computed(() => this.cart()?.products ?? []);
  readonly total = computed(() => this.cart()?.totalCartPrice ?? 0);

  constructor() {
    effect(() => {
      const token = this.auth.token();
      untracked(() => (token ? this.load() : this.reset()));
    });
  }

  load(): void {
    this.loading.set(true);
    this.http
      .get<CartResponse>(this.url)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          this.cart.set(res.data);
          this.count.set(res.numOfCartItems ?? res.data?.products?.length ?? 0);
        },
        error: () => this.reset(),
      });
  }

  add(productId: string, qty = 1): void {
    if (!this.auth.requireLogin()) return;
    this.busyId.set(productId);
    this.http
      .post<AddResponse>(this.url, { productId })
      .pipe(
        switchMap((res) => {
          
          const line = res.data.products.find((p) => p.product === productId);
          return qty > 1 && line
            ? this.http.put(`${this.url}/${productId}`, { count: line.count + qty - 1 })
            : of(res);
        }),
        finalize(() => this.busyId.set(null)),
      )
      .subscribe(() => {
        this.toastr.success(this.translate.instant('toast.cartAdded'));
        this.load();
      });
  }

  setCount(productId: string, count: number): void {
    if (count < 1) return this.remove(productId);
    this.busyId.set(productId);
    this.http
      .put(`${this.url}/${productId}`, { count })
      .pipe(finalize(() => this.busyId.set(null)))
      .subscribe(() => this.load());
  }

  remove(productId: string): void {
    this.busyId.set(productId);
    this.http
      .delete(`${this.url}/${productId}`)
      .pipe(finalize(() => this.busyId.set(null)))
      .subscribe(() => {
        this.toastr.success(this.translate.instant('toast.itemRemoved'));
        this.load();
      });
  }

  clear(): void {
    this.http.delete(this.url).subscribe(() => {
      this.reset();
      this.toastr.success(this.translate.instant('toast.cartCleared'));
    });
  }

  reset(): void {
    this.cart.set(null);
    this.count.set(0);
  }
}