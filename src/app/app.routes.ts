import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { MainLayout } from './layouts/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },

      // Public
      {
        path: 'home',
        title: 'Souqly',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
      },
      {
        path: 'products',
        title: 'Souqly | Products',
        loadComponent: () =>
          import('./features/products/product-list/product-list').then((m) => m.ProductList),
      },
      {
        path: 'products/:id',
        title: 'Souqly',
        loadComponent: () =>
          import('./features/products/product-details/product-details').then(
            (m) => m.ProductDetails,
          ),
      },
      {
        path: 'brands',
        title: 'Souqly | Brands',
        loadComponent: () =>
          import('./features/brands/brand-list/brand-list').then((m) => m.BrandList),
      },
      {
        path: 'brands/:id',
        title: 'Souqly | Brand',
        loadComponent: () =>
          import('./features/brands/brand-details/brand-details').then((m) => m.BrandDetails),
      },
      {
        path: 'categories',
        title: 'Souqly | Categories',
        loadComponent: () =>
          import('./features/categories/category-list/category-list').then((m) => m.CategoryList),
      },
      {
        path: 'categories/:id',
        title: 'Souqly | Category',
        loadComponent: () =>
          import('./features/categories/category-details/category-details').then(
            (m) => m.CategoryDetails,
          ),
      },

      // Private
      {
        path: 'cart',
        title: 'Souqly | Cart',
        canActivate: [authGuard],
        loadComponent: () => import('./features/cart/cart').then((m) => m.Cart),
      },
      {
        path: 'wishlist',
        title: 'Souqly | Wishlist',
        canActivate: [authGuard],
        loadComponent: () => import('./features/wishlist/wishlist').then((m) => m.Wishlist),
      },
      {
        path: 'checkout/:cartId',
        title: 'Souqly | Checkout',
        canActivate: [authGuard],
        loadComponent: () => import('./features/checkout/checkout').then((m) => m.Checkout),
      },
      {
        path: 'order-success',
        title: 'Souqly | Order placed',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/order-success/order-success').then((m) => m.OrderSuccess),
      },
      {
        path: 'allorders',
        title: 'Souqly | My orders',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/profile/tabs/my-orders/my-orders').then((m) => m.MyOrders),
      },
      {
        path: 'change-password',
        title: 'Souqly | Change password',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/auth/change-password/change-password').then((m) => m.ChangePassword),
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () => import('./features/profile/profile').then((m) => m.Profile),
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'overview' },
          {
            path: 'overview',
            title: 'Souqly | Profile',
            loadComponent: () =>
              import('./features/profile/tabs/overview/overview').then((m) => m.Overview),
          },
          {
            path: 'orders',
            title: 'Souqly | My orders',
            data: { embedded: true },
            loadComponent: () =>
              import('./features/profile/tabs/my-orders/my-orders').then((m) => m.MyOrders),
          },
          {
            path: 'interests',
            title: 'Souqly | Interests',
            loadComponent: () =>
              import('./features/profile/tabs/interests/interests').then((m) => m.Interests),
          },
          {
            path: 'addresses',
            title: 'Souqly | Addresses',
            loadComponent: () =>
              import('./features/profile/tabs/addresses/addresses').then((m) => m.Addresses),
          },
          {
            path: 'dashboard',
            title: 'Souqly | Dashboard',
            loadComponent: () =>
              import('./features/profile/tabs/dashboard/dashboard').then((m) => m.Dashboard),
          },
        ],
      },
    ],
  },

  // Auth (guest only)
  {
    path: '',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./layouts/auth-layout/auth-shell/auth-shell').then((m) => m.AuthShell),
    children: [
      {
        path: 'login',
        title: 'Souqly | Login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        title: 'Souqly | Register',
        loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
      },
      {
        path: 'forgot-password',
        title: 'Souqly | Reset password',
        loadComponent: () =>
          import('./features/auth/forgot-password/forgot-password').then((m) => m.ForgotPassword),
      },
    ],
  },

  {
    path: '**',
    title: 'Not found',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];
