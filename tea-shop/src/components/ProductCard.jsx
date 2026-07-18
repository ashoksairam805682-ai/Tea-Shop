import React from 'react';
import { useApp } from '../context/AppContext';

// ---------------------------------------------------------------------------
// ProductCard — used on both the Billing screen (add-to-cart) and the
// Products screen (with edit/delete admin actions).
// ---------------------------------------------------------------------------
export default function ProductCard({ product, mode = 'billing', onEdit, onDelete }) {
  const { addToCart } = useApp();
  const lowStock = product.stock > 0 && product.stock <= 10;
  const outOfStock = product.stock <= 0;

  return (
    <div className={`product-card glass ${outOfStock ? 'product-card--out' : ''}`}>
      <div className="product-card__top">
        <span className="product-card__category">{product.category}</span>
        {lowStock && <span className="product-card__badge product-card__badge--low">Low Stock</span>}
        {outOfStock && <span className="product-card__badge product-card__badge--out">Out of Stock</span>}
      </div>

      <h4 className="product-card__name">{product.name}</h4>

      <div className="product-card__meta">
        <span className="product-card__price">₹{product.price.toFixed(2)}</span>
        <span className="product-card__stock">Stock: {product.stock}</span>
      </div>

      {mode === 'billing' ? (
        <button
          className="btn btn--primary product-card__cta"
          disabled={outOfStock}
          onClick={() => addToCart(product)}
        >
          {outOfStock ? 'Unavailable' : '+ Add to Cart'}
        </button>
      ) : (
        <div className="product-card__admin-actions">
          <button className="btn btn--secondary btn--sm" onClick={() => onEdit(product)}>✎ Edit</button>
          <button className="btn btn--danger btn--sm" onClick={() => onDelete(product)}>🗑 Delete</button>
        </div>
      )}
    </div>
  );
}
