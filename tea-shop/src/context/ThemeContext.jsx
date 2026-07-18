import React, { createContext, useContext, useEffect, useState } from 'react';
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../utils/storage';

// ---------------------------------------------------------------------------
// ThemeContext — persists Dark / Light mode choice to localStorage and
// toggles a `data-theme` attribute on <html> which the CSS reacts to.
// ---------------------------------------------------------------------------

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => loadFromStorage(STORAGE_KEYS.THEME, 'light'));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveToStorage(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
