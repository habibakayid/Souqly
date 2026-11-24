import { DOCUMENT } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Address } from '../../core/models/address';
import { AddressesService } from '../../core/services/addresses.service';
import { CartService } from '../../core/services/cart.service';
import { OrdersService } from '../../core/services/orders.service';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { EgpPipe } from '../../shared/pipes/egp-pipe';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, EgpPipe, EmptyState],
  templateUrl: './checkout.html',
})
export class Checkout {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly orders = inject(OrdersService);
  private readonly doc = inject(DOCUMENT);
  protected readonly cart = inject(CartService);
  protected readonly addresses = inject(AddressesService);

 
  readonly cartId = input.required<string>();

  protected readonly payment = signal<'cash' | 'online'>('cash');
  protected readonly selectedId = signal<string | null>(null);
  protected readonly loading = signal(false);

  protected readonly form = this.fb.group({
    city: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    details: ['', [Validators.required]],
    save: [false],
    addressName: [''],
  });

  protected show(c: AbstractControl): boolean {
    return c.invalid && (c.touched || c.dirty);
  }

  protected pick(a: Address): void {
    this.selectedId.set(a._id);
    this.form.patchValue({ city: a.city, phone: a.phone, details: a.details, save: false });
  }

  protected useDifferent(): void {
    this.selectedId.set(null);
    this.form.reset();
  }

  protected toggleSave(checked: boolean): void {
    const ctrl = this.form.controls.addressName;
    ctrl.setValidators(checked ? [Validators.required] : []);
    ctrl.updateValueAndValidity();
  }

  protected submit(): void {
    if (this.form.invalid) return this.form.markAllAsTouched();
    const { city, phone, details, save, addressName } = this.form.getRawValue();
    const shipping = { city, phone, details };
    this.loading.set(true);

    if (save && !this.selectedId()) {
      this.addresses.add({ name: addressName, city, phone, details }).subscribe();
    }

    if (this.payment() === 'cash') {
      this.orders.cash(this.cartId(), shipping).subscribe({
        next: () => this.router.navigate(['/order-success']),
        error: () => this.loading.set(false),
      });
    } else {
      this.orders.online(this.cartId(), shipping).subscribe({
        next: (url) => (this.doc.location.href = url), // تحويل لصفحة Stripe
        error: () => this.loading.set(false),
      });
    }
  }
}