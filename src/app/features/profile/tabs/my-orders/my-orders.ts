import { DatePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, of } from 'rxjs';
import { OrdersService } from '../../../../core/services/orders.service';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { Skeleton } from '../../../../shared/components/skeleton/skeleton';
import { EgpPipe } from '../../../../shared/pipes/egp-pipe';

@Component({
  selector: 'app-my-orders',
  imports: [DatePipe, TranslatePipe, EgpPipe, EmptyState, Skeleton],
  templateUrl: './my-orders.html',
})
export class MyOrders {
 
  readonly embedded = input(false);

  protected readonly orders = toSignal(inject(OrdersService).mine().pipe(catchError(() => of([]))));
}