import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-section-title',
  imports: [RouterLink],
  templateUrl: './section-title.html',
})
export class SectionTitle {
  readonly title = input.required<string>();
  readonly linkText = input<string>();
  readonly link = input<string>();
}