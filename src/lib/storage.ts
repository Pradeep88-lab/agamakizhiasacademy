// Storage utility with safe localStorage and IndexedDB fallback for large PDFs
const DB_NAME = 'agamakizh_app_db';
const STORE_NAME = 'blobs';

function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function storeBlob(key: string, data: string): Promise<void> {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(data, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB write error:', err);
  }
}

export async function getBlob(key: string): Promise<string | null> {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Safely sets an item in localStorage.
 * If quota is exceeded, attempts to clean or truncate large data URLs and retry,
 * preventing unhandled exceptions.
 */
export function safeLocalStorageSet(key: string, value: any): boolean {
  try {
    const str = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, str);
    return true;
  } catch (e: any) {
    console.warn(`localStorage quota exceeded for key "${key}". Attempting compression/fallback...`, e);

    // If quota exceeded, try to strip heavy base64 data URLs from objects
    try {
      if (typeof value === 'object' && value !== null) {
        const sanitized = sanitizeLargeBlobs(value);
        localStorage.setItem(key, JSON.stringify(sanitized));
        return true;
      }
    } catch (e2) {
      console.warn('Fallback sanitization also failed:', e2);
    }
    return false;
  }
}

/**
 * Strips huge base64 strings if quota exceeded, keeping metadata intact
 */
function sanitizeLargeBlobs(obj: any): any {
  if (Array.isArray(obj)) {
    // Keep most recent items, trim older ones if array is large
    const trimmed = obj.slice(0, 15);
    return trimmed.map(item => sanitizeLargeBlobs(item));
  } else if (typeof obj === 'object' && obj !== null) {
    const copy: any = { ...obj };
    for (const k of Object.keys(copy)) {
      if (typeof copy[k] === 'string' && copy[k].startsWith('data:') && copy[k].length > 100000) {
        // Asynchronously persist the huge blob in IndexedDB using key-timestamp
        const blobKey = `blob_${k}_${Date.now()}`;
        storeBlob(blobKey, copy[k]);
        // Replace with reference or truncated placeholder
        copy[`_${k}_indexedDbKey`] = blobKey;
        copy[k] = ''; // clear from localStorage to free quota
      } else if (typeof copy[k] === 'object') {
        copy[k] = sanitizeLargeBlobs(copy[k]);
      }
    }
    return copy;
  }
  return obj;
}

export function safeLocalStorageGet<T = any>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch {
    return defaultValue;
  }
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const mimeMatch = parts[0]?.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
  const byteString = atob(parts[1] || '');
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mime });
}

export async function getResolvedPdfUrl(pdfUrl?: string, indexedDbKey?: string): Promise<{ url: string; isBlobUrl: boolean } | null> {
  let source = pdfUrl;
  if ((!source || source === 'local-indexeddb-blob') && indexedDbKey) {
    const fromIdb = await getBlob(indexedDbKey);
    if (fromIdb) {
      source = fromIdb;
    }
  }
  if (!source || source === 'local-indexeddb-blob') return null;

  if (source.startsWith('data:')) {
    try {
      const blob = dataUrlToBlob(source);
      const blobUrl = URL.createObjectURL(blob);
      return { url: blobUrl, isBlobUrl: true };
    } catch (err) {
      console.error('Error creating PDF blob URL:', err);
      return { url: source, isBlobUrl: false };
    }
  }

  return { url: source, isBlobUrl: false };
}

export async function openPdfPreview(pdfUrl?: string, indexedDbKey?: string, title?: string): Promise<boolean> {
  const resolved = await getResolvedPdfUrl(pdfUrl, indexedDbKey);
  if (!resolved) {
    alert('No PDF document available to preview.');
    return false;
  }
  const win = window.open(resolved.url, '_blank');
  if (win && title) {
    try {
      win.document.title = title;
    } catch {}
  }
  if (resolved.isBlobUrl) {
    setTimeout(() => URL.revokeObjectURL(resolved.url), 120000);
  }
  return true;
}

export async function downloadPdfFile(pdfUrl?: string, indexedDbKey?: string, filename: string = 'document.pdf'): Promise<boolean> {
  const resolved = await getResolvedPdfUrl(pdfUrl, indexedDbKey);
  if (!resolved) {
    alert('No PDF document available to download.');
    return false;
  }
  const a = document.createElement('a');
  a.href = resolved.url;
  a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  if (resolved.isBlobUrl) {
    setTimeout(() => URL.revokeObjectURL(resolved.url), 120000);
  }
  return true;
}
