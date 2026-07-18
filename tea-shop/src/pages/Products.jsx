import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Pagination from '../components/Pagination';
import { CATEGORIES } from '../utils/defaultData';

const PAGE_SIZE = 8;

// ---------------------------------------------------------------------------
// Products — admin CRUD screen (requirements #3, #6, #7).
// ---------------------------------------------------------------------------
export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [activeProduct, setActiveProduct] = useState(null);

  const [confirmTarget, setConfirmTarget] = useState(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.trim().toLowerCase());
      const matchesCategory = category === 'All' || p.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openAddModal() {
    setModalMode('add');
    setActiveProduct(null);
    setModalOpen(true);
  }

  function openEditModal(product) {
    setModalMode('edit');
    setActiveProduct(product);
    setModalOpen(true);
  }

  function handleSave(formData) {
    const ok =
      modalMode === 'edit' ? updateProduct(activeProduct.id, formData) : addProduct(formData);
    if (ok) setModalOpen(false);
  }

  function handleDeleteConfirm() {
    if (confirmTarget) {
      deleteProduct(confirmTarget.id);
      setConfirmTarget(null);
    }
  }

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>Products</h1>
          <p className="page__subtitle">Manage your menu — add, edit or remove items.</p>
        </div>
        <button className="btn btn--primary" onClick={openAddModal}>+ Add Product</button>
      </header>

      <div className="billing-products__filters">
        <div className="search-input">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="chip-row">
          <button
            className={`chip ${category === 'All' ? 'chip--active' : ''}`}
            onClick={() => { setCategory('All'); setPage(1); }}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`chip ${category === c ? 'chip--active' : ''}`}
              onClick={() => { setCategory(c); setPage(1); }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {pageItems.length === 0 ? (
        <div className="empty-state">
          <p>No products found. Try a different search or add a new product.</p>
        </div>
      ) : (
        <div className="product-grid">
          {pageItems.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              mode="admin"
              onEdit={openEditModal}
              onDelete={setConfirmTarget}
            />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      <ProductModal
        open={modalOpen}
        mode={modalMode}
        product={activeProduct}
        onSave={handleSave}
        onClose={() => setModalOpen(false)}
      />

      <ConfirmDialog
        open={!!confirmTarget}
        title="Delete product?"
        message={confirmTarget ? `"${confirmTarget.name}" will be permanently removed from your menu.` : ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
