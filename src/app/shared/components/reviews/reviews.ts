import { DatePipe } from '@angular/common';
import { afterNextRender, Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, of, switchMap } from 'rxjs';
import { Review } from '../../../core/models/review';
import { AuthService } from '../../../core/services/auth.service';
import { ReviewsService } from '../../../core/services/reviews.service';

@Component({
  selector: 'app-reviews',
  imports: [ReactiveFormsModule, DatePipe, TranslatePipe],
  templateUrl: './reviews.html',
})
export class Reviews {
  readonly productId = input.required<string>();

  private readonly api = inject(ReviewsService);
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly auth = inject(AuthService);

  
  protected readonly hydrated = signal(false);
  protected readonly rating = signal(0);
  protected readonly attempted = signal(false);
  protected readonly loading = signal(false);
  protected readonly stars = [1, 2, 3, 4, 5];
  protected readonly text = this.fb.control('', [Validators.required, Validators.minLength(2)]);

  private readonly reload = signal(0);

  protected readonly reviews = toSignal(
    toObservable(computed(() => ({ id: this.productId(), n: this.reload() }))).pipe(
      switchMap(({ id }) => this.api.list(id).pipe(catchError(() => of([] as Review[])))),
    ),
  );

  constructor() {
    afterNextRender(() => this.hydrated.set(true));
  }

  protected mine(r: Review): boolean {
    return r.user?._id === this.auth.user()?.id;
  }

  protected submit(): void {
    if (!this.auth.requireLogin()) return;
    this.attempted.set(true);
    if (!this.rating() || this.text.invalid) return this.text.markAsTouched();
    this.loading.set(true);
    this.api.add(this.productId(), { review: this.text.value.trim(), rating: this.rating() }).subscribe({
      next: () => {
        this.loading.set(false);
        this.attempted.set(false);
        this.rating.set(0);
        this.text.reset();
        this.reload.update((n) => n + 1);
      },
      error: () => this.loading.set(false),
    });
  }

  protected remove(r: Review): void {
    this.api.remove(r._id).subscribe(() => this.reload.update((n) => n + 1));
  }
}