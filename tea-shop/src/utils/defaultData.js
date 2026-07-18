// ---------------------------------------------------------------------------
// defaultData.js
// Seed data used only the very first time the app runs (i.e. when
// localStorage has no "products" / "settings" key yet).
// ---------------------------------------------------------------------------

export const CATEGORIES = ['Tea', 'Coffee', 'Snacks', 'Beverages', 'Desserts'];

export const DEFAULT_PRODUCTS = [
  { id: 'p1', name: 'Masala Chai', price: 15, category: 'Tea', stock: 120 },
  { id: 'p2', name: 'Ginger Tea', price: 18, category: 'Tea', stock: 90 },
  { id: 'p3', name: 'Elaichi Tea', price: 20, category: 'Tea', stock: 80 },
  { id: 'p4', name: 'Lemon Tea', price: 15, category: 'Tea', stock: 70 },
  { id: 'p5', name: 'Kulhad Chai', price: 25, category: 'Tea', stock: 60 },
  { id: 'p6', name: 'Green Tea', price: 20, category: 'Tea', stock: 55 },
  { id: 'p7', name: 'Black Coffee', price: 20, category: 'Coffee', stock: 50 },
  { id: 'p8', name: 'Cold Coffee', price: 45, category: 'Coffee', stock: 40 },
  { id: 'p9', name: 'Cappuccino', price: 50, category: 'Coffee', stock: 35 },
  { id: 'p10', name: 'Samosa', price: 15, category: 'Snacks', stock: 100 },
  { id: 'p11', name: 'Bun Maska', price: 25, category: 'Snacks', stock: 60 },
  { id: 'p12', name: 'Vada Pav', price: 20, category: 'Snacks', stock: 70 },
  { id: 'p13', name: 'Biscuit (Parle-G)', price: 5, category: 'Snacks', stock: 200 },
  { id: 'p14', name: 'Lassi', price: 35, category: 'Beverages', stock: 30 },
  { id: 'p15', name: 'Buttermilk', price: 20, category: 'Beverages', stock: 40 },
  { id: 'p16', name: 'Gulab Jamun', price: 30, category: 'Desserts', stock: 25 },
];

export const DEFAULT_SETTINGS = {
  shopName: 'Chai Point',
  address: '12, MG Road, Tiruchirappalli, Tamil Nadu',
  phone: '+91 98765 43210',
  gstNumber: '33ABCDE1234F1Z5',
  gstPercent: 5,
  receiptFooter: 'Thank You! Visit Again ☕',
  currency: '₹',
};

/** Generate a human friendly, sequential-looking bill number. */
export function generateBillNumber(existingBillsCount) {
  const seq = String(existingBillsCount + 1).padStart(4, '0');
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `TS-${datePart}-${seq}`;
}

export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
