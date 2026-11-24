import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { WishlistService } from '../../core/services/wishlist.service';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { Skeleton } from '../../shared/components/skeleton/skeleton';

@Component({
  selector: 'app-wishlist',
  imports: [TranslatePipe, ProductCard, EmptyState, Skeleton],
  templateUrl: './wishlist.html',
})
export class Wishlist {
  protected readonly wishlist = inject(WishlistService);
}