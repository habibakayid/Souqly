import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
})
export class Pagination {
  readonly current = input.required<number>();
  readonly total = input.required<number>();
  readonly pageChange = output<number>();

  
  protected readonly pages = computed<(number | null)[]>(() => {
    const t = this.total();
    const c = this.current();
    if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1);
    const set = new Set([1, t, c - 1, c, c + 1].filter((p) => p >= 1 && p <= t));
    const sorted = [...set].sort((a, b) => a - b);
    const out: (number | null)[] = [];
    sorted.forEach((p, i) => {
      if (i > 0 && p - sorted[i - 1] > 1) out.push(null);
      out.push(p);
    });
    return out;
  });

  go(p: number): void {
    if (p >= 1 && p <= this.total() && p !== this.current()) this.pageChange.emit(p);
  }
}