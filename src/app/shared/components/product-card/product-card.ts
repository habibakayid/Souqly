import { NgOptimizedImage } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Product } from '../../../core/models/product';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { EgpPipe } from '../../pipes/egp-pipe';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, NgOptimizedImage, TranslatePipe, EgpPipe],
  templateUrl: './product-card.html',
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly view = input<'grid' | 'list'>('grid');

  protected readonly cart = inject(CartService);
  protected readonly wishlist = inject(WishlistService);
  protected readonly stars = [1, 2, 3, 4, 5];
}