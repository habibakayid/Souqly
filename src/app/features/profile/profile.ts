import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, TranslatePipe],
  templateUrl: './profile.html',
})
export class Profile {
  protected readonly auth = inject(AuthService);
  protected readonly tabs = [
    { path: '/profile/overview', key: 'profile.tabs.overview', icon: 'fa-regular fa-user' },
    { path: '/profile/orders', key: 'profile.tabs.orders', icon: 'fa-solid fa-box' },
    { path: '/profile/interests', key: 'profile.tabs.interests', icon: 'fa-regular fa-heart' },
    { path: '/profile/addresses', key: 'profile.tabs.addresses', icon: 'fa-solid fa-location-dot' },
    { path: '/profile/dashboard', key: 'profile.tabs.dashboard', icon: 'fa-solid fa-chart-pie' },
  ];
}