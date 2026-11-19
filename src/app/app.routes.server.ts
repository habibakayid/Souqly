import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'home', renderMode: RenderMode.Server },
  { path: 'products', renderMode: RenderMode.Server },
  { path: 'products/:id', renderMode: RenderMode.Server },
  { path: 'brands', renderMode: RenderMode.Server },
  { path: 'brands/:id', renderMode: RenderMode.Server },
  { path: 'categories', renderMode: RenderMode.Server },
  { path: 'categories/:id', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Client }, // auth + الصفحات الخاصة
];