import { afterNextRender, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { LanguageService } from '../../../core/services/language.service';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './header.html',
})
export class Header {
  protected readonly auth = inject(AuthService);
  protected readonly cart = inject(CartService);
  protected readonly wishlist = inject(WishlistService);
  protected readonly lang = inject(LanguageService);
  private readonly router = inject(Router);

  
  protected readonly hydrated = signal(false);
  protected readonly drawer = signal(false);
  protected readonly menu = signal(false);

  protected readonly links = [
    { path: '/home', key: 'nav.home' },
    { path: '/products', key: 'nav.products' },
    { path: '/categories', key: 'nav.categories' },
    { path: '/brands', key: 'nav.brands' },
  ];

  constructor() {
    afterNextRender(() => this.hydrated.set(true));
  }

  search(term: string): void {
    const keyword = term.trim();
    this.drawer.set(false);
    this.router.navigate(['/products'], { queryParams: keyword ? { keyword } : {} });
  }

  logout(): void {
    this.menu.set(false);
    this.drawer.set(false);
    this.auth.logout();
  }
}