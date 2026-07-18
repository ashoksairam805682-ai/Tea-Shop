// ---------------------------------------------------------------------------
// storage.js
// Thin, safe wrapper around window.localStorage.
// Every read/write in the app goes through here so the storage keys and
// error-handling logic live in exactly one place.
// ---------------------------------------------------------------------------

export const STORAGE_KEYS = {
  PRODUCTS: 'products',
  CART: 'cart',
  BILLS: 'bills',
  SETTINGS: 'settings',
  THEME: 'theme',
};

/**
 * Read a value from localStorage and parse it as JSON.
 * Returns `fallback` if the key is missing or the JSON is corrupt.
 */
export function loadFromStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[storage] Failed to read "${key}":`, err);
    return fallback;
  }
}

/**
 * Stringify and write a value to localStorage.
 */
export function saveToStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`[storage] Failed to write "${key}":`, err);
    return false;
  }
}

export function removeFromStorage(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (err) {
    console.error(`[storage] Failed to remove "${key}":`, err);
  }
}
