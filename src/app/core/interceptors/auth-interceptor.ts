import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { env } from '../environments/env';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  return token && req.url.startsWith(env.baseUrl)
    ? next(req.clone({ setHeaders: { token } }))
    : next(req);
};