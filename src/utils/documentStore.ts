// Stores uploaded documents (PNG, JPEG, PDF, ZIP, RAR – up to 5 MB) in the browser's IndexedDB.
// localStorage is too small for 5 MB files, so only a reference ("idb:<id>") is kept in the portfolio data.

export const MAX_DOCUMENT_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_DOCUMENT_EXTENSIONS = ['png', 'jpg', 'jpeg', 'pdf', 'zip', 'rar'];
export const DOCUMENT_ACCEPT = '.png,.jpg,.jpeg,.pdf,.zip,.rar';
export const DOCUMENT_HINT = 'PNG, JPEG, PDF, ZIP or RAR – max 5 MB';
export const IDB_PREFIX = 'idb:';

const DB_NAME = 'vishnu_portfolio_documents';
const STORE = 'files';

interface StoredDocument {
  id: string;
  name: string;
  type: string;
  blob: Blob;
}

const openDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE, { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

const run = async <T,>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> => {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = fn(tx.objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  });
};

// Check the file's real content (first bytes), not just its name, and return its MIME type.
const detectType = async (file: File): Promise<string | null> => {
  const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const starts = (sig: number[]) => sig.every((b, i) => bytes[i] === b);
  if (starts([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'image/png';
  if (starts([0xff, 0xd8, 0xff])) return 'image/jpeg';
  if (starts([0x25, 0x50, 0x44, 0x46])) return 'application/pdf';
  if (starts([0x50, 0x4b, 0x03, 0x04]) || starts([0x50, 0x4b, 0x05, 0x06])) return 'application/zip';
  if (starts([0x52, 0x61, 0x72, 0x21, 0x1a, 0x07])) return 'application/vnd.rar';
  return null;
};

// Validates and saves a file. Returns the reference to keep in the form, or an error message.
export const saveDocument = async (
  file: File
): Promise<{ ok: true; documentUrl: string; documentName: string } | { ok: false; error: string }> => {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (!ALLOWED_DOCUMENT_EXTENSIONS.includes(ext)) {
    return { ok: false, error: 'Unsupported file type. Only PNG, JPEG, PDF, ZIP and RAR files are allowed.' };
  }
  if (file.size > MAX_DOCUMENT_BYTES) {
    return { ok: false, error: 'File is too large. The maximum allowed size is 5 MB.' };
  }
  if (file.size === 0) {
    return { ok: false, error: 'The selected file is empty.' };
  }
  const type = await detectType(file);
  if (!type) {
    return { ok: false, error: 'The file content does not match an allowed type (PNG, JPEG, PDF, ZIP, RAR).' };
  }
  const id = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  try {
    const record: StoredDocument = { id, name: file.name, type, blob: file };
    await run('readwrite', (s) => s.put(record));
  } catch {
    return { ok: false, error: 'Could not save the file in this browser. Please try again.' };
  }
  return { ok: true, documentUrl: `${IDB_PREFIX}${id}`, documentName: file.name };
};

export const getStoredDocument = async (ref: string): Promise<StoredDocument | null> => {
  const id = ref.slice(IDB_PREFIX.length);
  const rec = await run<StoredDocument | undefined>('readonly', (s) => s.get(id));
  return rec || null;
};

export const deleteStoredDocument = async (ref?: string) => {
  if (!ref || !ref.startsWith(IDB_PREFIX)) return;
  try {
    await run('readwrite', (s) => s.delete(ref.slice(IDB_PREFIX.length)));
  } catch {
    /* ignore */
  }
};
