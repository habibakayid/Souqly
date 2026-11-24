import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal, computed } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './storage.service';

export type Lang = 'en' | 'ar';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly storage = inject(StorageService);
  private readonly doc = inject(DOCUMENT);

  readonly lang = signal<Lang>(this.storage.get('lang') === 'ar' ? 'ar' : 'en');
  readonly isRtl = computed(() => this.lang() === 'ar');

  constructor() {
    effect(() => {
      const l = this.lang();
      this.translate.use(l);
      this.doc.documentElement.lang = l;
      this.doc.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    });
  }

  set(lang: Lang): void {
    this.lang.set(lang);
    this.storage.set('lang', lang);
  }
  toggle(): void {
    this.set(this.lang() === 'ar' ? 'en' : 'ar');
  }
}