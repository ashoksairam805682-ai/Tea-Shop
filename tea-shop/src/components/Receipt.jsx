import React, { forwardRef } from 'react';
import { useApp } from '../context/AppContext';

// ---------------------------------------------------------------------------
// Receipt — printable receipt layout (requirement #10). Rendered both
// inline (Billing screen / Bill History details) and via window.print().
// forwardRef so parents can target it with a print stylesheet if needed.
// ---------------------------------------------------------------------------
const Receipt = forwardRef(function Receipt({ bill }, ref) {
  const { settings } = useApp();
  if (!bill) return null;

  const dateObj = new Date(bill.date);

  return (
    <div className="receipt" ref={ref}>
      <div className="receipt__logo">🍵</div>
      <h2 className="receipt__shop-name">{settings.shopName}</h2>
      <p className="receipt__line">{settings.address}</p>
      <p className="receipt__line">Ph: {settings.phone}</p>
      {settings.gstNumber && <p className="receipt__line">GSTIN: {settings.gstNumber}</p>}

      <div className="receipt__divider" />

      <div className="receipt__meta">
        <span>Bill No: <strong>{bill.billNumber}</strong></span>
        <span>{dateObj.toLocaleDateString()} {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div className="receipt__meta">
        <span>Payment: <strong>{bill.paymentMethod}</strong></span>
      </div>

      <div className="receipt__divider" />

      <table className="receipt__table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {bill.items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.qty}</td>
              <td>₹{item.price.toFixed(2)}</td>
              <td>₹{(item.price * item.qty).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="receipt__divider" />

      <div className="receipt__totals">
        <div><span>Subtotal</span><span>₹{bill.subtotal.toFixed(2)}</span></div>
        {bill.discount > 0 && (
          <div><span>Discount</span><span>− ₹{bill.discount.toFixed(2)}</span></div>
        )}
        {bill.gstPercent > 0 && (
          <div><span>GST ({bill.gstPercent}%)</span><span>+ ₹{bill.gstAmount.toFixed(2)}</span></div>
        )}
        <div className="receipt__grand-total"><span>Grand Total</span><span>₹{bill.grandTotal.toFixed(2)}</span></div>
      </div>

      <div className="receipt__divider" />

      <p className="receipt__footer">{settings.receiptFooter}</p>
    </div>
  );
});

export default Receipt;
