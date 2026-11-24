import { afterNextRender, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  constructor() {
    inject(LanguageService);
    const auth = inject(AuthService);
    afterNextRender(() => {
      if (auth.isLoggedIn()) auth.verify().subscribe();
    });
  }
}