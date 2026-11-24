import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.html',
})
export class Skeleton {
  readonly count = input(1);
  readonly shape = input<'card' | 'line'>('card');
  protected readonly items = computed(() => Array.from({ length: this.count() }, (_, i) => i));
}