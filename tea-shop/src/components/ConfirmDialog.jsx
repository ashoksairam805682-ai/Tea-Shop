import React from 'react';

// ---------------------------------------------------------------------------
// ConfirmDialog — reusable "Are you sure?" modal used before any delete
// action (products, bills, etc.) per requirement #12.
// ---------------------------------------------------------------------------
export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onCancel}>
      <div className="modal confirm-dialog glass" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-dialog__icon">⚠</div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal__actions">
          <button className="btn btn--ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn--danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
