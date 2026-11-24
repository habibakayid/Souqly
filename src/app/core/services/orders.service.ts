import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { env } from '../environments/env';
import { Order, ShippingAddress } from '../models/order';
import { AuthService } from './auth.service';
import { CartService } from './cart.service';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly cart = inject(CartService);
  private readonly doc = inject(DOCUMENT);
  private readonly api = `${env.baseUrl}/api/v1/orders`;

  
  mine() {
    const id = this.auth.user()?.id;
    return this.http.get<Order[] | { data: Order[] }>(`${this.api}/user/${id}`).pipe(
      map((res) => (Array.isArray(res) ? res : (res.data ?? []))),
      map((list) => [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))),
    );
  }

  cash(cartId: string, shippingAddress: ShippingAddress) {
    return this.http
      .post<{ data: Order }>(`${this.api}/${cartId}`, { shippingAddress })
      .pipe(tap(() => this.cart.reset()));
  }

  online(cartId: string, shippingAddress: ShippingAddress) {
    const url = `${this.doc.location.origin}/allorders`;
    return this.http
      .post<{ session: { url: string } }>(`${this.api}/checkout-session/${cartId}`, { shippingAddress }, {
        params: new HttpParams().set('url', url),
      })
      .pipe(map((res) => res.session.url));
  }
}