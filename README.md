# 🛒 Souqly E-Commerce Platform

> **Your Universal Shopping Destination** — A modern, full-featured e-commerce web application built with Angular, designed to deliver a seamless shopping experience with clean UX and robust architecture.

---

##  Brand Identity & Design System
* **Brand Name:** Souqly (سوقلي)
* **Color Palette (Sky / Nebo Theme):**
  * **Primary Deep Navy (`#0A3C55` / `#04202E`):** Used for headers, main typography, and structure.
  * **Brand Ocean Blue (`#1786B4` / `#4FB3DA`):** Used for primary buttons, active states, and interactive accents.
  * **Background Ice Blue (`#E1F2FA`):** Used for clean, modern section and page backgrounds.

---

##  Key Features & Flow Architecture

1. **Authentication & Security (`authGuard` & `guestGuard`):**
   * Guest routes (Login/Register/Forgot Password) are protected for logged-out users.
   * Secure routes (Cart, Wishlist, Checkout, Orders, Change Password) require authentication via `authGuard`.
   * **Smart Return URL:** Redirects unauthenticated users attempting to add items to cart/wishlist to `/login?returnUrl=...` and automatically completes the action upon successful login.

2. **Real-time Cart Management:**
   * Powered by Angular **Signals** (`CartService`) for instant, reactive updates in the navbar counter without page reloads.

3. **Wishlist System:**
   * Fast $O(1)$ lookup utilizing reactive Sets for heart icons on product cards, preloaded right after login.

4. **Checkout & Online Payment:**
   * Supports both **Cash on Delivery** and **Online Secure Payment** integrated via Stripe Checkout sessions, returning users smoothly to `/allorders`.

5. **UI/UX Enhancements:**
   * Modern skeletons for loading states, global HTTP Interceptors for error handling (Toasts), and a dedicated 404 Not Found page.

---

##  Tech Stack
* **Frontend Framework:** Angular
* **State Management & Reactivity:** Angular Signals, RxJS
* **Styling & UI:** CSS / Modern Responsive Layouts
* **API Integration:** RESTful APIs (Products, Categories, Brands, Cart, Wishlist, Orders)

---

##  Route Access Table

| Page / Route | Access Guard | Key Endpoints / Actions |
| :--- | :--- | :--- |
| **Home** (`/home`) | Public | `GET /products`, `categories`, `brands` |
| **Products** (`/products`) | Public | `GET /products` (Pagination & Search) |
| **Product Details** (`/products/:id`) | Public | `GET /products/:id` |
| **Login / Register** | Guest Guard | Sign in, Sign up, Forgot/Reset Password |
| **Cart** (`/cart`) | Auth Guard | `GET/POST /cart`, `PUT/DELETE /cart/:id` |
| **Wishlist** (`/wishlist`) | Auth Guard | `GET/POST /wishlist`, `DELETE /wishlist/:id` |
| **Checkout** (`/checkout/:cartId`) | Auth Guard | Cash & Online Stripe Orders |
| **Orders** (`/allorders`) | Auth Guard | `GET /orders/user/:userId` |

---

##  Getting Started

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/souqly-ecommerce.git](https://github.com/your-username/souqly-ecommerce.git)
