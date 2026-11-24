import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly year = new Date().getFullYear();
  protected readonly links = [
    { path: '/products', key: 'nav.products' },
    { path: '/categories', key: 'nav.categories' },
    { path: '/brands', key: 'nav.brands' },
  ];
}