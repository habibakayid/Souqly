import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { env } from '../environments/env';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const translate = inject(TranslateService);
  const auth = inject(AuthService);
  const browser = isPlatformBrowser(inject(PLATFORM_ID));

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (browser && req.url.startsWith(env.baseUrl)) {
        if (err.status === 401 && auth.isLoggedIn()) {
          auth.logout(); // التوكن منتهي
        } else {
          const silent = req.method === 'GET' && err.status > 0 && err.status < 500;
          if (!silent) toastr.error(err.error?.message ?? translate.instant('errors.generic'));
        }
      }
      return throwError(() => err);
    }),
  );
};