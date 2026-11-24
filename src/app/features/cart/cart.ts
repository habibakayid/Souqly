import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CartService } from '../../core/services/cart.service';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { Skeleton } from '../../shared/components/skeleton/skeleton';
import { EgpPipe } from '../../shared/pipes/egp-pipe';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, TranslatePipe, EgpPipe, EmptyState, Skeleton],
  templateUrl: './cart.html',
})
export class Cart {
  protected readonly cart = inject(CartService);
}