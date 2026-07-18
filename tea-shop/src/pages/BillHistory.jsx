import React, { useMemo, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import ConfirmDialog from '../components/ConfirmDialog';
import Pagination from '../components/Pagination';
import Receipt from '../components/Receipt';

const PAGE_SIZE = 8;

// ---------------------------------------------------------------------------
// BillHistory — search, view, reprint and delete past bills (requirement #4).
// ---------------------------------------------------------------------------
export default function BillHistory() {
  const { bills, deleteBill } = useApp();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [viewingBill, setViewingBill] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const receiptRef = useRef(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return bills;
    return bills.filter(
      (b) =>
        b.billNumber.toLowerCase().includes(q) ||
        b.items.some((item) => item.name.toLowerCase().includes(q)) ||
        b.paymentMethod.toLowerCase().includes(q)
    );
  }, [bills, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleReprint(bill) {
    setViewingBill(bill);
    window.setTimeout(() => window.print(), 150);
  }

  function handleDeleteConfirm() {
    if (confirmTarget) {
      deleteBill(confirmTarget.id);
      if (viewingBill?.id === confirmTarget.id) setViewingBill(null);
      setConfirmTarget(null);
    }
  }

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>Bill History</h1>
          <p className="page__subtitle">Every bill you've ever generated, searchable and reprintable.</p>
        </div>
      </header>

      <div className="search-input search-input--wide">
        <span>🔍</span>
        <input
          type="text"
          placeholder="Search by bill number, item, or payment method…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {pageItems.length === 0 ? (
        <div className="empty-state">
          <p>No bills found.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bill No.</th>
                <th>Date</th>
                <th>Items</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((bill) => (
                <tr key={bill.id}>
                  <td>{bill.billNumber}</td>
                  <td>{new Date(bill.date).toLocaleString()}</td>
                  <td>{bill.items.reduce((s, i) => s + i.qty, 0)} items</td>
                  <td><span className="pill">{bill.paymentMethod}</span></td>
                  <td className="data-table__amount">₹{bill.grandTotal.toFixed(2)}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn--ghost btn--sm" onClick={() => setViewingBill(bill)}>👁 View</button>
                      <button className="btn btn--secondary btn--sm" onClick={() => handleReprint(bill)}>🖨 Reprint</button>
                      <button className="btn btn--danger btn--sm" onClick={() => setConfirmTarget(bill)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {viewingBill && (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={() => setViewingBill(null)}>
          <div className="modal modal--receipt glass" onClick={(e) => e.stopPropagation()}>
            <Receipt bill={viewingBill} ref={receiptRef} />
            <div className="modal__actions">
              <button className="btn btn--ghost" onClick={() => setViewingBill(null)}>Close</button>
              <button className="btn btn--primary" onClick={() => window.print()}>🖨 Print</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmTarget}
        title="Delete bill?"
        message={confirmTarget ? `Bill ${confirmTarget.billNumber} will be permanently removed from history.` : ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
