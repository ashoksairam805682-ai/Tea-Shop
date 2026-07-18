import React from 'react';
import { useApp } from '../context/AppContext';

// ---------------------------------------------------------------------------
// CartItem — one row in the billing cart with +/- qty controls,
// subtotal, and a remove button (requirement #8).
// ---------------------------------------------------------------------------
export default function CartItem({ item }) {
  const { increaseQty, decreaseQty, removeFromCart } = useApp();
  const subtotal = item.price * item.qty;

  return (
    <div className="cart-item">
      <div className="cart-item__info">
        <span className="cart-item__name">{item.name}</span>
        <span className="cart-item__price">₹{item.price.toFixed(2)} each</span>
      </div>

      <div className="cart-item__qty">
        <button className="qty-btn" onClick={() => decreaseQty(item.id)} aria-label="Decrease quantity">−</button>
        <span className="qty-btn__value">{item.qty}</span>
        <button className="qty-btn" onClick={() => increaseQty(item.id)} aria-label="Increase quantity">+</button>
      </div>

      <div className="cart-item__subtotal">₹{subtotal.toFixed(2)}</div>

      <button className="cart-item__remove" onClick={() => removeFromCart(item.id)} aria-label="Remove item">✕</button>
    </div>
  );
}
