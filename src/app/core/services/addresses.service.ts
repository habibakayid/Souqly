import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal, untracked } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { env } from '../environments/env';
import { Address } from '../models/address';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AddressesService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly toastr = inject(ToastrService);
  private readonly translate = inject(TranslateService);
  private readonly url = `${env.baseUrl}/api/v1/addresses`;

  readonly list = signal<Address[]>([]);
  readonly loading = signal(false);

  constructor() {
    effect(() => {
      const token = this.auth.token();
      untracked(() => (token ? this.load() : this.list.set([])));
    });
  }

  load(): void {
    this.loading.set(true);
    this.http.get<{ data: Address[] }>(this.url).subscribe({
      next: (res) => {
        this.list.set(res.data ?? []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  add(body: Omit<Address, '_id'>) {
    return this.http.post<{ data: Address[] }>(this.url, body).pipe(
     
      (src) => {
        src.subscribe({ next: (res) => this.list.set(res.data ?? []) });
        return src;
      },
    );
  }

  remove(id: string): void {
    this.http.delete<{ data: Address[] }>(`${this.url}/${id}`).subscribe((res) => {
      this.list.set(res.data ?? []);
      this.toastr.success(this.translate.instant('toast.addressRemoved'));
    });
  }
}