// Small safe storage wrapper: attempts to use localStorage and falls back to an
// in-memory store when the quota is exceeded or storage is not available.
type StoredValue = string | null;

const memoryStore: Record<string, string> = {};

function isLocalStorageAvailable() {
  try {
    if (typeof window === "undefined") return false;
    const testKey = "__storage_test__";
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

export function safeSetItem(key: string, value: string): boolean {
  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (e: any) {
      // QuotaExceededError or other DOMException
      // Fallback to in-memory store and warn for visibility.
      try {
        memoryStore[key] = value;
      } catch (innerErr) {
        // If even memory fails (very unlikely), fail silently but return false
      }
      // Keep the console warning minimal and consistent.
      // eslint-disable-next-line no-console
      console.warn(`safeSetItem: localStorage.setItem failed for key=${key}. Using in-memory fallback.`);
      return false;
    }
  }

  // localStorage not available (SSR or blocked), use memory
  memoryStore[key] = value;
  return false;
}

export function safeGetItem(key: string): StoredValue {
  if (isLocalStorageAvailable()) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      // If localStorage throws when reading, fall back to memory
      return memoryStore.hasOwnProperty(key) ? memoryStore[key] : null;
    }
  }

  return memoryStore.hasOwnProperty(key) ? memoryStore[key] : null;
}

export function safeRemoveItem(key: string): void {
  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.removeItem(key);
      return;
    } catch (e) {
      // ignore and fallback to memory
    }
  }

  if (memoryStore.hasOwnProperty(key)) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete memoryStore[key];
  }
}

export function clearMemoryFallback() {
  Object.keys(memoryStore).forEach((k) => delete memoryStore[k]);
}
