try {
  const SUPABASE_URL = 'https://hugcitgrogypvxyowiaj.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_lwMkPcbqGQF1TPppIj0phQ_qb_JJdrp';
  window.sb = (window.supabase || supabase).createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (e) {
  console.warn('Supabase non disponible, mode localStorage uniquement.', e);
  window.sb = null;
}
