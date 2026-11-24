import { Component, inject, signal } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './forgot-password.html',
})
export class ForgotPassword {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly step = signal<1 | 2 | 3>(1);
  protected readonly loading = signal(false);

  protected readonly email = this.fb.control('', [Validators.required, Validators.email]);
  protected readonly code = this.fb.control('', [Validators.required]);
  protected readonly password = this.fb.control('', [
    Validators.required,
    Validators.pattern(/^[A-Z][A-Za-z0-9]{5,10}$/),
  ]);

  protected show(c: AbstractControl): boolean {
    return c.invalid && (c.touched || c.dirty);
  }

  protected sendCode(): void {
    if (this.email.invalid) return this.email.markAsTouched();
    this.loading.set(true);
    this.auth.forgotPassword(this.email.value).subscribe({
      next: () => { this.loading.set(false); this.step.set(2); },
      error: () => this.loading.set(false),
    });
  }

  protected verify(): void {
    if (this.code.invalid) return this.code.markAsTouched();
    this.loading.set(true);
    this.auth.verifyCode(this.code.value.trim()).subscribe({
      next: () => { this.loading.set(false); this.step.set(3); },
      error: () => this.loading.set(false),
    });
  }

  protected reset(): void {
    if (this.password.invalid) return this.password.markAsTouched();
    this.loading.set(true);
    this.auth.resetPassword(this.email.value, this.password.value).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.loading.set(false),
    });
  }

  protected useDifferentEmail(): void {
    this.code.reset();
    this.step.set(1);
  }
}