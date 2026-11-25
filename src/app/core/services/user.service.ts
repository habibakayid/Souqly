import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { env } from '../environments/env';
import { Profile } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly toastr = inject(ToastrService);
  private readonly translate = inject(TranslateService);

  updateMe(changes: Partial<Profile>) {
    return this.http.put(`${env.baseUrl}/api/v1/users/updateMe`, changes).pipe(
      tap(() => {
        const current = this.auth.profile() ?? { name: '', email: '' };
        this.auth.setProfile({ ...current, ...changes });
        this.toastr.success(this.translate.instant('toast.profileUpdated'));
      }),
    );
  }
}