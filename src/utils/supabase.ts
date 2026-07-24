import { UserProfile, DocumentItem } from '../types';

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

const isSupabaseConfigured = (): boolean => {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
};

console.log(
  isSupabaseConfigured()
    ? '[Database] Supabase credentials loaded. Operations routed to cloud PostgreSQL.'
    : '[Database] VITE_SUPABASE_URL unconfigured. Operating in Local Sandbox Mode (LocalStorage).'
);

// 1. Fetch User Profile
export const fetchUserProfile = async (fallback: UserProfile): Promise<UserProfile> => {
  if (!isSupabaseConfigured()) {
    const saved = localStorage.getItem('mv_user');
    return saved ? JSON.parse(saved) : fallback;
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*&limit=1`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Supabase fetch failed');
    const data = await response.json();
    return data && data[0] ? data[0] : fallback;
  } catch (err) {
    console.warn('[Database] Supabase fetch error, using local fallback:', err);
    const saved = localStorage.getItem('mv_user');
    return saved ? JSON.parse(saved) : fallback;
  }
};

// 2. Save User Profile
export const saveUserProfile = async (profile: UserProfile): Promise<boolean> => {
  localStorage.setItem('mv_user', JSON.stringify(profile));

  if (!isSupabaseConfigured()) {
    return true;
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.default`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        id: 'default',
        ...profile
      })
    });
    return response.ok;
  } catch (err) {
    console.error('[Database] Supabase save error:', err);
    return false;
  }
};

// 3. Fetch Vault Documents
export const fetchVaultDocuments = async (fallback: DocumentItem[]): Promise<DocumentItem[]> => {
  if (!isSupabaseConfigured()) {
    const saved = localStorage.getItem('mv_documents');
    return saved ? JSON.parse(saved) : fallback;
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/documents?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Supabase documents fetch failed');
    return await response.json();
  } catch (err) {
    console.warn('[Database] Supabase documents fetch error, using local:', err);
    const saved = localStorage.getItem('mv_documents');
    return saved ? JSON.parse(saved) : fallback;
  }
};

// 4. Save Document Node to Vault
export const saveDocumentToVault = async (doc: DocumentItem): Promise<boolean> => {
  const savedDocs = localStorage.getItem('mv_documents');
  const currentDocs: DocumentItem[] = savedDocs ? JSON.parse(savedDocs) : [];
  localStorage.setItem('mv_documents', JSON.stringify([doc, ...currentDocs]));

  if (!isSupabaseConfigured()) {
    return true;
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/documents`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(doc)
    });
    return response.ok;
  } catch (err) {
    console.error('[Database] Supabase save document error:', err);
    return false;
  }
};
