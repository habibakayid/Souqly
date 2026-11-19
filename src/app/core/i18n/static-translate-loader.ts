import { Injectable } from '@angular/core';
import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import en from './en.json';
import ar from './ar.json';

@Injectable({ providedIn: 'root' })
export class StaticTranslateLoader extends TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    return of(lang === 'ar' ? ar : en);
  }
}