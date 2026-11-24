import { isPlatformBrowser } from '@angular/common';
import {
  Component, computed, DestroyRef, effect, ElementRef, inject, PLATFORM_ID, untracked, viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import type { Chart as ChartJs } from 'chart.js';
import { catchError, forkJoin, of } from 'rxjs';
import { BrandsService } from '../../../../core/services/brands.service';
import { CategoriesService } from '../../../../core/services/categories.service';
import { LanguageService } from '../../../../core/services/language.service';
import { OrdersService } from '../../../../core/services/orders.service';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { Skeleton } from '../../../../shared/components/skeleton/skeleton';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { EgpPipe } from '../../../../shared/pipes/egp-pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { buildStats, DashboardStats } from './dashboard.utils';

const PALETTE = ['#0F5E83', '#1786B4', '#4FB3DA', '#98D5EE', '#0A3C55', '#04202E'];

@Component({
  selector: 'app-dashboard',
  imports: [TranslatePipe, EgpPipe, StatCard, EmptyState, Skeleton],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly translate = inject(TranslateService);
  private readonly lang = inject(LanguageService);

  /** undefined = بيحمّل، null = error */
  private readonly data = toSignal(
    forkJoin({
      orders: inject(OrdersService).mine(),
      cats: inject(CategoriesService).list().pipe(catchError(() => of([]))),
      brands: inject(BrandsService).list().pipe(catchError(() => of([]))),
    }).pipe(catchError(() => of(null))),
  );

  protected readonly loading = computed(() => this.data() === undefined);
  protected readonly stats = computed<DashboardStats | null>(() => {
    const d = this.data();
    return d ? buildStats(d.orders, d.cats, d.brands, this.lang.lang() === 'ar' ? 'ar-EG' : 'en-US') : null;
  });

  private readonly monthlyCanvas = viewChild<ElementRef<HTMLCanvasElement>>('monthly');
  private readonly paymentCanvas = viewChild<ElementRef<HTMLCanvasElement>>('payment');
  private readonly categoryCanvas = viewChild<ElementRef<HTMLCanvasElement>>('category');

  private charts: ChartJs[] = [];
  private drawId = 0;

  constructor() {
    effect(() => {
      const s = this.stats();
      const m = this.monthlyCanvas();
      const p = this.paymentCanvas();
      const c = this.categoryCanvas();
      this.lang.lang(); // نرسم تاني لما اللغة تتغير
      if (!this.browser || !s || !m || !p || !c) return;
      untracked(() => this.draw(s, m.nativeElement, p.nativeElement, c.nativeElement));
    });
    inject(DestroyRef).onDestroy(() => {
      this.drawId++;
      this.destroyCharts();
    });
  }

  private destroyCharts(): void {
    this.charts.forEach((c) => c.destroy());
    this.charts = [];
  }

  private async draw(s: DashboardStats, m: HTMLCanvasElement, p: HTMLCanvasElement, c: HTMLCanvasElement) {
    const id = ++this.drawId;
    const { Chart, registerables } = await import('chart.js');
    if (id !== this.drawId) return;
    Chart.register(...registerables);
    this.destroyCharts();
    const t = (k: string) => this.translate.instant(k);

    this.charts = [
      new Chart(m, {
        type: 'bar',
        data: {
          labels: s.monthly.map((x) => x.label),
          datasets: [{ label: t('dashboard.spentLabel'), data: s.monthly.map((x) => x.value), backgroundColor: PALETTE[1], borderRadius: 6 }],
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
      }),
      new Chart(p, {
        type: 'doughnut',
        data: {
          labels: [t('dashboard.cash'), t('dashboard.online')],
          datasets: [{ data: [s.cash, s.card], backgroundColor: [PALETTE[0], PALETTE[2]] }],
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } },
      }),
      new Chart(c, {
        type: 'bar',
        data: {
          labels: s.byCategory.map((x) => x.name),
          datasets: [{ label: t('dashboard.spentLabel'), data: s.byCategory.map((x) => x.value), backgroundColor: PALETTE[0], borderRadius: 6 }],
        },
        options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
      }),
    ];
  }
}