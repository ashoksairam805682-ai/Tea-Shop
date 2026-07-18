import React from 'react';

// ---------------------------------------------------------------------------
// Pagination — simple prev/next + page-number control (requirement #12).
// ---------------------------------------------------------------------------
export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <button className="btn btn--ghost btn--sm" disabled={page === 1} onClick={() => onChange(page - 1)}>
        ‹ Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          className={`pagination__page ${p === page ? 'pagination__page--active' : ''}`}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
      <button className="btn btn--ghost btn--sm" disabled={page === totalPages} onClick={() => onChange(page + 1)}>
        Next ›
      </button>
    </div>
  );
}
