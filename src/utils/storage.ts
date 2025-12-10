/**
 * Safe storage utility with fallback to in-memory storage
 * Handles storage access errors that occur on Render.com HTTPS
 */

const memoryStorage: Record<string, string> = {};

function isStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    console.warn('localStorage is not available, using in-memory storage as fallback');
    return false;
  }
}

const storageAvailable = isStorageAvailable();

export function getFromStorage(key: string): string | null {
  try {
    if (storageAvailable) {
      return localStorage.getItem(key);
    }
    return memoryStorage[key] || null;
  } catch (error) {
    console.warn(`Failed to get storage item "${key}":`, error);
    return memoryStorage[key] || null;
  }
}

export function setInStorage(key: string, value: string): void {
  try {
    if (storageAvailable) {
      localStorage.setItem(key, value);
    } else {
      memoryStorage[key] = value;
    }
  } catch (error) {
    console.warn(`Failed to set storage item "${key}":`, error);
    memoryStorage[key] = value;
  }
}

export function removeFromStorage(key: string): void {
  try {
    if (storageAvailable) {
      localStorage.removeItem(key);
    } else {
      delete memoryStorage[key];
    }
  } catch (error) {
    console.warn(`Failed to remove storage item "${key}":`, error);
    delete memoryStorage[key];
  }
}

export function clearStorage(): void {
  try {
    if (storageAvailable) {
      localStorage.clear();
    }
  } catch (error) {
    console.warn('Failed to clear storage:', error);
  }
  Object.keys(memoryStorage).forEach((key) => {
    delete memoryStorage[key];
  });
}

export function hasStorageAccess(): boolean {
  return storageAvailable;
}
