import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-order-success',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './order-success.html',
})
export class OrderSuccess {}