import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, of } from 'rxjs';
import { Product } from '../../../../core/models/product';
import { CategoriesService } from '../../../../core/services/categories.service';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { ProductCard } from '../../../../shared/components/product-card/product-card';

interface Group { id: string; name?: string; products: Product[]; percent: number }

@Component({
  selector: 'app-interests',
  imports: [RouterLink, TranslatePipe, ProductCard, EmptyState],
  templateUrl: './interests.html',
})
export class Interests {
  protected readonly wishlist = inject(WishlistService);
  private readonly categories = toSignal(inject(CategoriesService).list().pipe(catchError(() => of([]))), {
    initialValue: [],
  });

  protected readonly groups = computed<Group[]>(() => {
    const items = this.wishlist.items();
    const cats = this.categories();
    const map = new Map<string, Group>();

    for (const p of items) {
      const ref = p.category as unknown as { _id?: string; name?: string } | string | undefined;
      const id = (typeof ref === 'string' ? ref : ref?._id) ?? 'other';
      const name = typeof ref === 'object' && ref?.name ? ref.name : cats.find((c) => c._id === id)?.name;
      const g = map.get(id) ?? { id, name, products: [], percent: 0 };
      g.products.push(p);
      map.set(id, g);
    }
    return [...map.values()]
      .map((g) => ({ ...g, percent: Math.round((g.products.length / items.length) * 100) }))
      .sort((a, b) => b.products.length - a.products.length);
  });
}