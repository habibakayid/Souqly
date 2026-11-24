import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { env } from '../environments/env';
import { Profile, User } from '../models/user';
import { StorageService } from './storage.service';
import {  HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY} from 'rxjs';


interface AuthResponse { message: string; token: string; user: { name: string; email: string; role: string } }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly storage = inject(StorageService);
  private readonly toastr = inject(ToastrService);
  private readonly translate = inject(TranslateService);
  private readonly api = `${env.baseUrl}/api/v1`;

  readonly token = signal<string | null>(this.storage.get('token'));
  readonly profile = signal<Profile | null>(this.readProfile());
  readonly isLoggedIn = computed(() => !!this.token());
  readonly user = computed<User | null>(() => this.decode(this.token()));
  readonly userName = computed(() => this.profile()?.name ?? this.user()?.name ?? '');

  register(body: { name: string; email: string; password: string; rePassword: string; phone: string }) {
    return this.http.post<AuthResponse>(`${this.api}/auth/signup`, body).pipe(
      tap(() => this.toastr.success(this.translate.instant('toast.registered'))),
    );
  }

  login(body: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.api}/auth/signin`, body).pipe(
      tap((res) => {
        this.setToken(res.token);
        const old = this.profile();
        this.setProfile({
          name: res.user.name,
          email: res.user.email,
          phone: old?.email === res.user.email ? old.phone : undefined,
        });
        this.toastr.success(this.translate.instant('toast.welcome'));
      }),
    );
  }

  logout(): void {
    this.token.set(null);
    this.profile.set(null);
    this.storage.remove('token');
    this.storage.remove('profile');
    this.router.navigate(['/login']);
  }

 
  requireLogin(): boolean {
    if (this.isLoggedIn()) return true;
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    return false;
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.api}/auth/forgotPasswords`, { email }).pipe(
      tap(() => this.toastr.success(this.translate.instant('toast.codeSent'))),
    );
  }
  verifyCode(resetCode: string) {
    return this.http.post(`${this.api}/auth/verifyResetCode`, { resetCode });
  }
  resetPassword(email: string, newPassword: string) {
    return this.http.put(`${this.api}/auth/resetPassword`, { email, newPassword }).pipe(
      tap(() => this.toastr.success(this.translate.instant('toast.passwordReset'))),
    );
  }
  changePassword(body: { currentPassword: string; password: string; rePassword: string }) {
    return this.http.put<{ token: string }>(`${this.api}/users/changeMyPassword`, body).pipe(
      tap((res) => {
        if (res.token) this.setToken(res.token);
        this.toastr.success(this.translate.instant('toast.passwordChanged'));
      }),
    );
  }

  setProfile(p: Profile): void {
    this.profile.set(p);
    this.storage.set('profile', JSON.stringify(p));
  }

  private setToken(token: string): void {
    this.token.set(token);
    this.storage.set('token', token);
  }

  private readProfile(): Profile | null {
    try {
      const raw = this.storage.get('profile');
      return raw ? (JSON.parse(raw) as Profile) : null;
    } catch {
      return null;
    }
  }

  private decode(token: string | null): User | null {
    if (!token) return null;
    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(payload).split('').map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join(''),
      );
      return JSON.parse(json) as User;
    } catch {
      return null;
    }
  }


  verify() {
    return this.http.get(`${this.api}/auth/verifyToken`).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status !== 401 && err.status >= 400 && err.status < 500) this.logout();
        return EMPTY;
      }),
    );
  }

}