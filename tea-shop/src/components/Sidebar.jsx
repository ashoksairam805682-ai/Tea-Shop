import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '⌂', end: true },
  { to: '/billing', label: 'Billing', icon: '🧾' },
  { to: '/products', label: 'Products', icon: '🍃' },
  { to: '/history', label: 'Bill History', icon: '🕘' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
];

// ---------------------------------------------------------------------------
// Sidebar — primary navigation (requirement #11). Collapses to a bottom
// tab-bar / slide-out drawer on mobile via CSS.
// ---------------------------------------------------------------------------
export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const { settings } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="sidebar__mobile-toggle" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
        <span />
        <span />
        <span />
      </button>

      {open && <div className="sidebar__scrim" onClick={() => setOpen(false)} />}

      <aside className={`sidebar glass ${open ? 'sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <div className="sidebar__logo">🍵</div>
          <div>
            <div className="sidebar__brand-name">{settings.shopName || 'Tea Shop'}</div>
            <div className="sidebar__brand-tag">POS &amp; Billing</div>
          </div>
        </div>

        <nav className="sidebar__nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
            >
              <span className="sidebar__icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="sidebar__theme-toggle" onClick={toggleTheme}>
          <span>{theme === 'light' ? '🌙' : '☀️'}</span>
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>

        <div className="sidebar__hint">
          <kbd>Ctrl</kbd>+<kbd>B</kbd> Billing &nbsp;·&nbsp; <kbd>Ctrl</kbd>+<kbd>N</kbd> New Bill
        </div>
      </aside>
    </>
  );
}
