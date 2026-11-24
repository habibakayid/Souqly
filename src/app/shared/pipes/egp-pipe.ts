import { inject, Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

@Pipe({ name: 'egp', pure: false })
export class EgpPipe implements PipeTransform {
  private readonly lang = inject(LanguageService);
  private readonly cache: Record<string, Intl.NumberFormat> = {};

  transform(value: number | null | undefined): string {
    const l = this.lang.lang();
    const fmt = (this.cache[l] ??= new Intl.NumberFormat(l === 'ar' ? 'ar-EG' : 'en-US', {
      style: 'currency',
      currency: 'EGP',
      maximumFractionDigits: 0,
    }));
    return fmt.format(value ?? 0);
  }
}