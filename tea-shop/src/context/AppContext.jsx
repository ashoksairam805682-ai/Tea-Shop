import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../utils/storage';
import { DEFAULT_PRODUCTS, DEFAULT_SETTINGS, generateBillNumber, generateId } from '../utils/defaultData';
import { useToast } from './ToastContext';

// ---------------------------------------------------------------------------
// AppContext
// Single source of truth for: products, cart, bills, settings.
// Every mutation immediately persists to localStorage (requirement #14).
// ---------------------------------------------------------------------------

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { showToast } = useToast();

  // ---- Initial load (seed defaults on first run) --------------------------
  const [products, setProducts] = useState(() => {
    const existing = loadFromStorage(STORAGE_KEYS.PRODUCTS, null);
    if (existing && Array.isArray(existing) && existing.length > 0) return existing;
    saveToStorage(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
    return DEFAULT_PRODUCTS;
  });

  const [cart, setCart] = useState(() => loadFromStorage(STORAGE_KEYS.CART, []));
  const [bills, setBills] = useState(() => loadFromStorage(STORAGE_KEYS.BILLS, []));
  const [settings, setSettings] = useState(() => {
    const existing = loadFromStorage(STORAGE_KEYS.SETTINGS, null);
    if (existing) return { ...DEFAULT_SETTINGS, ...existing };
    saveToStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  });

  // ---- Persist on every change ---------------------------------------------
  useEffect(() => saveToStorage(STORAGE_KEYS.PRODUCTS, products), [products]);
  useEffect(() => saveToStorage(STORAGE_KEYS.CART, cart), [cart]);
  useEffect(() => saveToStorage(STORAGE_KEYS.BILLS, bills), [bills]);
  useEffect(() => saveToStorage(STORAGE_KEYS.SETTINGS, settings), [settings]);

  // ===================== PRODUCT CRUD =====================================
  function addProduct(product) {
    if (!product.name || !product.name.trim()) {
      showToast('Product name is required', 'error');
      return false;
    }
    if (Number(product.price) <= 0 || Number.isNaN(Number(product.price))) {
      showToast('Price must be a positive number', 'error');
      return false;
    }
    const newProduct = {
      id: generateId('p'),
      name: product.name.trim(),
      price: Number(product.price),
      category: product.category || 'Tea',
      stock: Number(product.stock) || 0,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`"${newProduct.name}" added`, 'success');
    return true;
  }

  function updateProduct(id, updates) {
    if (updates.name !== undefined && !updates.name.trim()) {
      showToast('Product name is required', 'error');
      return false;
    }
    if (updates.price !== undefined && (Number(updates.price) <= 0 || Number.isNaN(Number(updates.price)))) {
      showToast('Price must be a positive number', 'error');
      return false;
    }
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...updates,
              name: updates.name !== undefined ? updates.name.trim() : p.name,
              price: updates.price !== undefined ? Number(updates.price) : p.price,
              stock: updates.stock !== undefined ? Number(updates.stock) : p.stock,
            }
          : p
      )
    );
    showToast('Product updated', 'success');
    return true;
  }

  function deleteProduct(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast('Product deleted', 'info');
  }

  // ===================== CART OPERATIONS ==================================
  function addToCart(product) {
    if (product.stock <= 0) {
      showToast(`${product.name} is out of stock`, 'error');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) {
          showToast('No more stock available', 'error');
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1, stock: product.stock }];
    });
  }

  function increaseQty(id) {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (item.qty >= item.stock) {
          showToast('No more stock available', 'error');
          return item;
        }
        return { ...item, qty: item.qty + 1 };
      })
    );
  }

  function decreaseQty(id) {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
        .filter((item) => item.qty > 0)
    );
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  // ===================== BILLING ==========================================
  /**
   * Finalize the current cart into a saved bill, decrement stock and
   * clear the cart. Returns the created bill object.
   */
  function checkout({ discount = 0, discountType = 'flat', gstEnabled = true, paymentMethod = 'Cash' }) {
    if (cart.length === 0) {
      showToast('Cart is empty', 'error');
      return null;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const discountAmount =
      discountType === 'percent' ? (subtotal * Number(discount || 0)) / 100 : Number(discount || 0);
    const afterDiscount = Math.max(subtotal - discountAmount, 0);
    const gstPercent = gstEnabled ? Number(settings.gstPercent || 0) : 0;
    const gstAmount = (afterDiscount * gstPercent) / 100;
    const grandTotal = afterDiscount + gstAmount;

    const bill = {
      id: generateId('bill'),
      billNumber: generateBillNumber(bills.length),
      date: new Date().toISOString(),
      items: cart.map((item) => ({ ...item })),
      subtotal,
      discount: discountAmount,
      discountType,
      gstPercent,
      gstAmount,
      grandTotal,
      paymentMethod,
    };

    setBills((prev) => [bill, ...prev]);

    // Decrement stock
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = cart.find((c) => c.id === p.id);
        return cartItem ? { ...p, stock: Math.max(p.stock - cartItem.qty, 0) } : p;
      })
    );

    clearCart();
    showToast(`Bill ${bill.billNumber} generated`, 'success');
    return bill;
  }

  function deleteBill(id) {
    setBills((prev) => prev.filter((b) => b.id !== id));
    showToast('Bill deleted', 'info');
  }

  function updateSettings(updates) {
    setSettings((prev) => ({ ...prev, ...updates }));
    showToast('Settings saved', 'success');
  }

  // ===================== DERIVED / DASHBOARD DATA =========================
  const dashboardStats = useMemo(() => {
    const todayStr = new Date().toDateString();
    const todaysBills = bills.filter((b) => new Date(b.date).toDateString() === todayStr);
    const todaysSales = todaysBills.reduce((sum, b) => sum + b.grandTotal, 0);
    const totalRevenue = bills.reduce((sum, b) => sum + b.grandTotal, 0);

    const itemCounts = {};
    bills.forEach((b) => {
      b.items.forEach((item) => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.qty;
      });
    });
    let bestSellingItem = '—';
    let bestQty = 0;
    Object.entries(itemCounts).forEach(([name, qty]) => {
      if (qty > bestQty) {
        bestQty = qty;
        bestSellingItem = name;
      }
    });

    return {
      todaysSales,
      todaysBillCount: todaysBills.length,
      totalBills: bills.length,
      totalRevenue,
      bestSellingItem,
      bestQty,
      recentBills: bills.slice(0, 5),
    };
  }, [bills]);

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    cart,
    addToCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
    bills,
    checkout,
    deleteBill,
    settings,
    updateSettings,
    dashboardStats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
