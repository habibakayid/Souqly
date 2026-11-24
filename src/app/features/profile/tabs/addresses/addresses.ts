import { Component, inject, signal } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AddressesService } from '../../../../core/services/addresses.service';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-addresses',
  imports: [ReactiveFormsModule, TranslatePipe, EmptyState],
  templateUrl: './addresses.html',
})
export class Addresses {
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly addresses = inject(AddressesService);
  protected readonly loading = signal(false);

  protected readonly form = this.fb.group({
    name: ['', [Validators.required]],
    city: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    details: ['', [Validators.required]],
  });

  protected show(c: AbstractControl): boolean {
    return c.invalid && (c.touched || c.dirty);
  }

  protected submit(): void {
    if (this.form.invalid) return this.form.markAllAsTouched();
    this.loading.set(true);
    this.addresses.add(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.form.reset();
      },
      error: () => this.loading.set(false),
    });
  }
}