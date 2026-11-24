import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';

function match(group: AbstractControl): ValidationErrors | null {
  return group.get('password')?.value === group.get('rePassword')?.value ? null : { mismatch: true };
}

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './change-password.html',
})
export class ChangePassword {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loading = signal(false);

  protected readonly form = this.fb.group(
    {
      currentPassword: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern(/^[A-Z][A-Za-z0-9]{5,10}$/)]],
      rePassword: ['', [Validators.required]],
    },
    { validators: match },
  );

  protected show(c: AbstractControl): boolean {
    return c.invalid && (c.touched || c.dirty);
  }

  protected submit(): void {
    if (this.form.invalid) return this.form.markAllAsTouched();
    this.loading.set(true);
    this.auth.changePassword(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/profile/overview']),
      error: () => this.loading.set(false),
    });
  }
}