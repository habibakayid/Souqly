import { Component, inject, signal } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import { Profile } from '../../../../core/models/user';

@Component({
  selector: 'app-overview',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './overview.html',
})
export class Overview {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly user = inject(UserService);
  protected readonly auth = inject(AuthService);

  protected readonly loading = signal(false);

  protected readonly form = this.fb.group({
    name: [this.auth.profile()?.name ?? '', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    email: [this.auth.profile()?.email ?? '', [Validators.required, Validators.email]],
    phone: [this.auth.profile()?.phone ?? '', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
  });

  protected show(c: AbstractControl): boolean {
    return c.invalid && (c.touched || c.dirty);
  }

   protected submit(): void {
    if (this.form.invalid) return this.form.markAllAsTouched();

    const value = this.form.getRawValue();
    const current = this.auth.profile();
    const changes: Partial<Profile> = {};
    if (value.name !== current?.name) changes.name = value.name;
    if (value.email !== current?.email) changes.email = value.email;
    if (value.phone !== current?.phone) changes.phone = value.phone;
    if (!Object.keys(changes).length) return;

    this.loading.set(true);
    this.user.updateMe(changes).subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }
}