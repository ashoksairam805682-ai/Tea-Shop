import React, { useEffect, useState } from 'react';
import { CATEGORIES } from '../utils/defaultData';

// ---------------------------------------------------------------------------
// ProductModal — single modal reused for both "Add Product" and
// "Edit Product" (requirements #3 and #7).
// ---------------------------------------------------------------------------
const EMPTY_FORM = { name: '', price: '', category: CATEGORIES[0], stock: '' };

export default function ProductModal({ open, mode = 'add', product, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setErrors({});
      if (mode === 'edit' && product) {
        setForm({
          name: product.name,
          price: String(product.price),
          category: product.category,
          stock: String(product.stock),
        });
      } else {
        setForm(EMPTY_FORM);
      }
    }
  }, [open, mode, product]);

  if (!open) return null;

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (form.price === '' || Number(form.price) <= 0) next.price = 'Enter a valid price';
    if (form.stock === '' || Number(form.stock) < 0) next.stock = 'Enter a valid stock quantity';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      name: form.name,
      price: Number(form.price),
      category: form.category,
      stock: Number(form.stock),
    });
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <form className="modal glass" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3>{mode === 'edit' ? 'Edit Product' : 'Add New Product'}</h3>

        <label className="field">
          <span>Product Name</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Masala Chai"
            autoFocus
          />
          {errors.name && <span className="field__error">{errors.name}</span>}
        </label>

        <div className="field-row">
          <label className="field">
            <span>Price (₹)</span>
            <input
              type="number"
              min="0"
              step="0.5"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="0.00"
            />
            {errors.price && <span className="field__error">{errors.price}</span>}
          </label>

          <label className="field">
            <span>Stock</span>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              placeholder="0"
            />
            {errors.stock && <span className="field__error">{errors.stock}</span>}
          </label>
        </div>

        <label className="field">
          <span>Category</span>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <div className="modal__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn--primary">Save</button>
        </div>
      </form>
    </div>
  );
}
