import React, { useMemo, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import CartItem from '../components/CartItem';
import Receipt from '../components/Receipt';
import { CATEGORIES } from '../utils/defaultData';

// ---------------------------------------------------------------------------
// Billing — the main POS screen (requirement #2).
// ---------------------------------------------------------------------------
export default function Billing() {
  const { products, cart, checkout, settings } = useApp();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [discount, setDiscount] = useState('');
  const [discountType, setDiscountType] = useState('flat'); // 'flat' | 'percent'
  const [gstEnabled, setGstEnabled] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [lastBill, setLastBill] = useState(null);
  const receiptRef = useRef(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.trim().toLowerCase());
      const matchesCategory = category === 'All' || p.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = discountType === 'percent' ? (subtotal * Number(discount || 0)) / 100 : Number(discount || 0);
  const afterDiscount = Math.max(subtotal - discountAmount, 0);
  const gstPercent = gstEnabled ? Number(settings.gstPercent || 0) : 0;
  const gstAmount = (afterDiscount * gstPercent) / 100;
  const grandTotal = afterDiscount + gstAmount;

  function handleCheckout() {
    const bill = checkout({ discount, discountType, gstEnabled, paymentMethod });
    if (bill) {
      setLastBill(bill);
      setDiscount('');
    }
  }

  function handleNewBill() {
    setLastBill(null);
    setDiscount('');
    setSearch('');
    showToast('Ready for a new bill', 'info');
  }

  function handlePrint() {
    if (!lastBill) {
      showToast('Generate a bill before printing', 'error');
      return;
    }
    window.print();
  }

  return (
    <div className="page billing-page">
      <header className="page__header">
        <div>
          <h1>Billing</h1>
          <p className="page__subtitle">Search products, build the cart, and check out.</p>
        </div>
        <button className="btn btn--secondary" onClick={handleNewBill}>⟲ New Bill</button>
      </header>

      <div className="billing-layout">
        {/* -------------------- Product picker -------------------- */}
        <section className="billing-products">
          <div className="billing-products__filters">
            <div className="search-input">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search products…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="chip-row">
              <button
                className={`chip ${category === 'All' ? 'chip--active' : ''}`}
                onClick={() => setCategory('All')}
              >
                All
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  className={`chip ${category === c ? 'chip--active' : ''}`}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <p>No products match your search.</p>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} mode="billing" />
              ))}
            </div>
          )}
        </section>

        {/* -------------------- Cart / checkout -------------------- */}
        <section className="billing-cart glass">
          <h2>Current Order</h2>

          {cart.length === 0 ? (
            <div className="empty-state empty-state--cart">
              <span className="empty-state__icon">🛒</span>
              <p>Cart is empty. Add items to get started.</p>
            </div>
          ) : (
            <div className="cart-list">
              {cart.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}

          <div className="billing-cart__controls">
            <div className="field-row">
              <label className="field">
                <span>Discount</span>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="0"
                />
              </label>
              <label className="field">
                <span>Type</span>
                <select value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
                  <option value="flat">Flat (₹)</option>
                  <option value="percent">Percent (%)</option>
                </select>
              </label>
            </div>

            <label className="toggle-row">
              <span>Apply GST ({settings.gstPercent}%)</span>
              <input type="checkbox" checked={gstEnabled} onChange={(e) => setGstEnabled(e.target.checked)} />
            </label>

            <div className="payment-methods">
              {['Cash', 'UPI'].map((method) => (
                <button
                  key={method}
                  className={`payment-btn ${paymentMethod === method ? 'payment-btn--active' : ''}`}
                  onClick={() => setPaymentMethod(method)}
                >
                  {method === 'Cash' ? '💵' : '📱'} {method}
                </button>
              ))}
            </div>
          </div>

          <div className="billing-cart__totals">
            <div><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
            {discountAmount > 0 && <div><span>Discount</span><span>− ₹{discountAmount.toFixed(2)}</span></div>}
            {gstEnabled && <div><span>GST ({gstPercent}%)</span><span>+ ₹{gstAmount.toFixed(2)}</span></div>}
            <div className="billing-cart__grand-total"><span>Grand Total</span><span>₹{grandTotal.toFixed(2)}</span></div>
          </div>

          <div className="billing-cart__actions">
            <button className="btn btn--primary btn--lg" onClick={handleCheckout} disabled={cart.length === 0}>
              ✓ Generate Bill
            </button>
            <button className="btn btn--secondary" onClick={handlePrint} disabled={!lastBill}>
              🖨 Print Last Bill
            </button>
          </div>
        </section>
      </div>

      {lastBill && (
        <section className="last-receipt-preview">
          <div className="panel glass">
            <div className="panel__header">
              <h2>Last Generated Bill</h2>
              <span className="pill pill--success">{lastBill.billNumber}</span>
            </div>
            <div className="print-only-wrap">
              <Receipt bill={lastBill} ref={receiptRef} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
