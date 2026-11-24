import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  get(key: string): string | null {
    if (!this.browser) return null;
    try { return localStorage.getItem(key); } catch { return null; }
  }
  set(key: string, value: string): void {
    if (!this.browser) return;
    try { localStorage.setItem(key, value); } catch { /* ignore */ }
  }
  remove(key: string): void {
    if (!this.browser) return;
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  }
}