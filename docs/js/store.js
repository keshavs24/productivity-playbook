/**
 * store.js — IndexedDB for offline cache + pending writes queue
 */

const DB_NAME = 'playbook-cache';
const DB_VERSION = 1;
const CACHE_STORE = 'cache';
const QUEUE_STORE = 'writeQueue';

let db = null;

/**
 * Open/create the IndexedDB database
 */
export async function initStore() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(CACHE_STORE)) {
        db.createObjectStore(CACHE_STORE, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(QUEUE_STORE)) {
        db.createObjectStore(QUEUE_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (e) => {
      db = e.target.result;
      resolve();
    };

    request.onerror = (e) => {
      console.error('IndexedDB error:', e.target.error);
      reject(e.target.error);
    };
  });
}

/**
 * Cache fetched data
 */
export async function cacheData(key, data) {
  if (!db) return;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CACHE_STORE, 'readwrite');
    tx.objectStore(CACHE_STORE).put({
      key,
      data,
      timestamp: Date.now()
    });
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Get cached data
 * @param {string} key
 * @param {number} maxAge - max age in ms (default 5 min)
 */
export async function getCachedData(key, maxAge = 5 * 60 * 1000) {
  if (!db) return null;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CACHE_STORE, 'readonly');
    const request = tx.objectStore(CACHE_STORE).get(key);
    request.onsuccess = () => {
      const result = request.result;
      if (!result) { resolve(null); return; }
      if (Date.now() - result.timestamp > maxAge) { resolve(null); return; }
      resolve(result.data);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Queue a write for when we're back online
 */
export async function queueWrite(sheetName, range, values) {
  if (!db) return;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(QUEUE_STORE, 'readwrite');
    tx.objectStore(QUEUE_STORE).add({
      sheetName,
      range,
      values,
      timestamp: Date.now()
    });
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Get all pending writes
 */
export async function getPendingWrites() {
  if (!db) return [];
  return new Promise((resolve, reject) => {
    const tx = db.transaction(QUEUE_STORE, 'readonly');
    const request = tx.objectStore(QUEUE_STORE).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Clear a pending write after it's been flushed
 */
export async function clearPendingWrite(id) {
  if (!db) return;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(QUEUE_STORE, 'readwrite');
    tx.objectStore(QUEUE_STORE).delete(id);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Flush all pending writes (call when back online)
 */
export async function flushPendingWrites(writeRangeFn) {
  const pending = await getPendingWrites();
  for (const item of pending) {
    try {
      await writeRangeFn(item.sheetName, item.range, item.values);
      await clearPendingWrite(item.id);
    } catch (e) {
      console.error('Failed to flush write:', e);
      break; // Stop on first failure, retry later
    }
  }
}

/**
 * Check network status
 */
export function isOnline() {
  return navigator.onLine;
}
