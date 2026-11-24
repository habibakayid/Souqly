import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, of } from 'rxjs';
import { CategoriesService } from '../../../core/services/categories.service';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { Skeleton } from '../../../shared/components/skeleton/skeleton';
import { SearchPipe } from '../../../shared/pipes/search-pipe';

@Component({
  selector: 'app-category-list',
  imports: [RouterLink, TranslatePipe, SearchPipe, EmptyState, Skeleton],
  templateUrl: './category-list.html',
})
export class CategoryList {
  protected readonly categories = toSignal(inject(CategoriesService).list().pipe(catchError(() => of([]))));
  protected readonly term = signal('');
}