import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Billing from './pages/Billing';
import Products from './pages/Products';
import BillHistory from './pages/BillHistory';
import Settings from './pages/Settings';
import { useApp } from './context/AppContext';
import { useToast } from './context/ToastContext';

// ---------------------------------------------------------------------------
// App — top level layout (Sidebar + routed page content) and global
// keyboard shortcuts (requirement #12).
// ---------------------------------------------------------------------------
export default function App() {
  const navigate = useNavigate();
  const { clearCart } = useApp();
  const { showToast } = useToast();

  useEffect(() => {
    function handleKeyDown(e) {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const modifier = isMac ? e.metaKey : e.ctrlKey;
      if (!modifier) return;

      if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        navigate('/billing');
      } else if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        clearCart();
        navigate('/billing');
        showToast('New bill started', 'info');
      } else if (e.key.toLowerCase() === 'p') {
        e.preventDefault();
        navigate('/products');
      } else if (e.key.toLowerCase() === 'h') {
        e.preventDefault();
        navigate('/history');
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, clearCart, showToast]);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/products" element={<Products />} />
          <Route path="/history" element={<BillHistory />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}
