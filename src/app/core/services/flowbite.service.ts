import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FlowbiteService {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

 
  initCarousels(): void {
    if (!this.browser) return;
    import('flowbite').then((m) => m.initCarousels());
  }
}