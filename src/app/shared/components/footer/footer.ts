import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly lang = inject(LanguageService);
  protected readonly year = new Date().getFullYear();

  protected readonly shop = [
    { path: '/products', key: 'nav.products' },
    { path: '/categories', key: 'nav.categories' },
    { path: '/brands', key: 'nav.brands' },
  ];
  protected readonly account = [
    { path: '/profile/overview', key: 'nav.profile' },
    { path: '/profile/orders', key: 'nav.myOrders' },
    { path: '/wishlist', key: 'nav.wishlist' },
    { path: '/cart', key: 'nav.cart' },
  ];
}