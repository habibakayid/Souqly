import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-auth-shell',
  imports: [RouterOutlet, RouterLink, TranslatePipe],
  templateUrl: './auth-shell.html',
})
export class AuthShell {
  protected readonly lang = inject(LanguageService);
}