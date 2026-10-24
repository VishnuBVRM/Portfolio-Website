import { IDB_PREFIX, getStoredDocument } from './documentStore';

const downloadBlob = (blob: Blob, name: string, openInNewTab = false) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  if (!openInNewTab) {
    a.download = name;
  } else {
    a.target = '_blank';
    a.rel = 'noreferrer noopener';
  }
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 15000);
};

// Opens or downloads an uploaded document safely within iframe / web standards.
// Supports files saved in IndexedDB ("idb:<id>"), data URLs, and remote URLs.
export const openDocument = async (ref: string) => {
  if (!ref) return;
  try {
    let blob: Blob;
    let name = 'document';

    if (ref.startsWith(IDB_PREFIX)) {
      const rec = await getStoredDocument(ref);
      if (!rec) {
        console.warn('Document is no longer available in this browser.');
        return;
      }
      blob = rec.blob.type === rec.type ? rec.blob : new Blob([rec.blob], { type: rec.type });
      name = rec.name;
    } else {
      const res = await fetch(ref);
      blob = await res.blob();
      const parts = ref.split('/');
      name = parts[parts.length - 1] || 'document';
    }

    if (blob.type === 'application/pdf') {
      downloadBlob(blob, name.endsWith('.pdf') ? name : `${name}.pdf`, true);
    } else if (blob.type.startsWith('image/')) {
      downloadBlob(blob, name, true);
    } else {
      downloadBlob(blob, name, false);
    }
  } catch (err) {
    console.error('Error opening document:', err);
  }
};
