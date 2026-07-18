import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

// ---------------------------------------------------------------------------
// Settings — shop profile stored in localStorage (requirement #9).
// ---------------------------------------------------------------------------
export default function Settings() {
  const { settings, updateSettings } = useApp();
  const [form, setForm] = useState(settings);

  useEffect(() => setForm(settings), [settings]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    updateSettings(form);
  }

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>Settings</h1>
          <p className="page__subtitle">Configure your shop details and receipt information.</p>
        </div>
      </header>

      <form className="panel glass settings-form" onSubmit={handleSubmit}>
        <div className="field-row">
          <label className="field">
            <span>Tea Shop Name</span>
            <input value={form.shopName} onChange={(e) => handleChange('shopName', e.target.value)} required />
          </label>
          <label className="field">
            <span>Phone Number</span>
            <input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} required />
          </label>
        </div>

        <label className="field">
          <span>Address</span>
          <textarea
            rows={2}
            value={form.address}
            onChange={(e) => handleChange('address', e.target.value)}
          />
        </label>

        <div className="field-row">
          <label className="field">
            <span>GST Number</span>
            <input value={form.gstNumber} onChange={(e) => handleChange('gstNumber', e.target.value)} />
          </label>
          <label className="field">
            <span>GST Percentage (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              value={form.gstPercent}
              onChange={(e) => handleChange('gstPercent', e.target.value)}
            />
          </label>
        </div>

        <label className="field">
          <span>Receipt Footer</span>
          <input value={form.receiptFooter} onChange={(e) => handleChange('receiptFooter', e.target.value)} />
        </label>

        <div className="modal__actions modal__actions--left">
          <button type="submit" className="btn btn--primary">💾 Save Settings</button>
        </div>
      </form>
    </div>
  );
}
