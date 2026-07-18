# 🍵 Tea Shop Billing System

A complete, offline-first POS (Point of Sale) and billing system for tea shops,
built with **React + Vite**. No backend, no database — everything is stored in
the browser's `localStorage`.

## ✨ Features

- **Dashboard** — today's sales, total bills, total revenue, best-selling item, recent bills
- **Billing screen** — product search, category filters, cart with +/− quantity, discount (flat or %), GST toggle, Cash/UPI payment, print receipt, "New Bill"
- **Product management** — add / edit / delete products (name, price, category, stock), with instant `localStorage` sync
- **Bill history** — search, view, reprint, and delete past bills
- **Settings** — shop name, address, phone, GST number, receipt footer
- **Dark / Light mode**, keyboard shortcuts, responsive mobile layout, toast notifications, confirm-before-delete dialogs, pagination

## 🚀 Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## ⌨️ Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl/Cmd + B` | Go to Billing |
| `Ctrl/Cmd + N` | Start a new bill |
| `Ctrl/Cmd + P` | Go to Products |
| `Ctrl/Cmd + H` | Go to Bill History |

## 🗂 Folder structure

```
src/
├── components/     # Reusable UI: Sidebar, ProductCard, CartItem, Receipt, modals...
├── context/         # React Context: AppContext (products/cart/bills/settings), ThemeContext, ToastContext
├── pages/           # Route-level screens: Dashboard, Billing, Products, BillHistory, Settings
├── styles/          # Plain CSS, split by concern (tokens, base, layout, components, billing, print)
├── utils/            # localStorage wrapper + default seed data
├── App.jsx
└── main.jsx
```

## 💾 LocalStorage keys

| Key | Contents |
| --- | --- |
| `products` | Array of `{ id, name, price, category, stock }` |
| `cart` | Current in-progress cart |
| `bills` | Array of saved bills (full history) |
| `settings` | Shop profile: name, address, phone, GST, receipt footer |
| `theme` | `'light'` or `'dark'` |

On first load, if `products`/`settings` don't exist yet, the app seeds them
with sensible defaults (a small tea-shop menu). Every add/edit/delete
immediately persists to `localStorage`, so a page refresh never loses data.

## 🎨 Design

Brown + green + cream palette, glassmorphism panels, a thermal-receipt-style
printed bill, and subtle motion (card lift, cart item slide-in, toast
entrance). Fully responsive down to mobile, with a slide-out sidebar on small
screens.
