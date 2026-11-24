import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, of } from 'rxjs';
import { Brand } from '../../../core/models/brand';
import { BrandsService } from '../../../core/services/brands.service';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { Skeleton } from '../../../shared/components/skeleton/skeleton';
import { SearchPipe } from '../../../shared/pipes/search-pipe';

@Component({
  selector: 'app-brand-list',
  imports: [RouterLink, TranslatePipe, SearchPipe, EmptyState, Skeleton],
  templateUrl: './brand-list.html',
})
export class BrandList {
  protected readonly brands = toSignal(
    inject(BrandsService).list().pipe(catchError(() => of([] as Brand[]))),
  );
  protected readonly term = signal('');
}