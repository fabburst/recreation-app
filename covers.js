// covers.js — résolution d'images de couverture depuis des API publiques.
// Cache localStorage + fallback sur le poster procédural si l'appel échoue.
//
// Clés API à configurer (dans le vrai repo, .env → import.meta.env.VITE_*).
// Pour la démo, on utilise Open Library (pas de clé) et des endpoints publics
// de TMDB via le champ fourni par l'utilisateur. Si la clé est vide, on bascule
// sur le poster procédural sans faire d'appel réseau.
const COVER_KEYS = {
  // À remplir côté utilisateur (Tweaks > "Clés API" ou .env au déploiement)
  tmdb: (typeof localStorage !== 'undefined' && localStorage.getItem('rec.key.tmdb')) || '',
  rawg: (typeof localStorage !== 'undefined' && localStorage.getItem('rec.key.rawg')) || '',
};

const CACHE_NS = 'rec.covers.v1';
function cacheGet(key) {
  try { const all = JSON.parse(localStorage.getItem(CACHE_NS) || '{}'); return all[key]; } catch { return null; }
}
function cacheSet(key, val) {
  try {
    const all = JSON.parse(localStorage.getItem(CACHE_NS) || '{}');
    all[key] = val;
    localStorage.setItem(CACHE_NS, JSON.stringify(all));
  } catch {}
}

async function fetchJson(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}

// ── TMDB (films + séries) ────────────────────────────────────────────────
async function tmdbCover(title, year, isSerie) {
  if (!COVER_KEYS.tmdb) return null;
  const path = isSerie ? 'tv' : 'movie';
  const url = `https://api.themoviedb.org/3/search/${path}?api_key=${COVER_KEYS.tmdb}&language=fr-FR&query=${encodeURIComponent(title)}${year ? `&${isSerie ? 'first_air_date_year' : 'year'}=${year}` : ''}`;
  const data = await fetchJson(url);
  const hit = (data.results || [])[0];
  if (!hit || !hit.poster_path) return null;
  return `https://image.tmdb.org/t/p/w500${hit.poster_path}`;
}

// ── RAWG (jeux vidéo) ────────────────────────────────────────────────────
async function rawgCover(title) {
  if (!COVER_KEYS.rawg) return null;
  const url = `https://api.rawg.io/api/games?key=${COVER_KEYS.rawg}&search=${encodeURIComponent(title)}&page_size=1`;
  const data = await fetchJson(url);
  const hit = (data.results || [])[0];
  return hit?.background_image || null;
}

// ── Google Books (livres, sans clé, 100 req/jour) ───────────────────────
async function googleBooksCover(title, author) {
  const q = `intitle:${encodeURIComponent(title)}${author ? `+inauthor:${encodeURIComponent(author)}` : ''}`;
  const data = await fetchJson(`https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1&printType=books`);
  const item = (data.items || [])[0];
  const thumb = item?.volumeInfo?.imageLinks?.thumbnail || item?.volumeInfo?.imageLinks?.smallThumbnail;
  if (!thumb) return null;
  // Force HTTPS + taille large
  return thumb.replace('http://', 'https://').replace('&zoom=1', '&zoom=3');
}

// Résolution principale. Asynchrone mais idempotente via cache.
async function resolveCover(item) {
  const key = `${item.type}|${(item.title || '').toLowerCase()}|${item.year || ''}`;
  const cached = cacheGet(key);
  if (cached !== undefined) return cached;
  let url = null;
  try {
    if (item.type === 'film')        url = await tmdbCover(item.title, item.year, false);
    else if (item.type === 'serie')  url = await tmdbCover(item.title, item.year, true);
    else if (item.type === 'jeu')    url = await rawgCover(item.title);
    else if (item.type === 'livre')  url = await googleBooksCover(item.title, item.dir);
  } catch (e) {
    url = null;
  }
  cacheSet(key, url); // on cache aussi les null pour éviter de re-tenter
  return url;
}

// Hook React : retourne { url, loading } pour un item donné.
function useCover(item) {
  const [url, setUrl] = React.useState(() => {
    const key = `${item.type}|${(item.title || '').toLowerCase()}|${item.year || ''}`;
    return cacheGet(key);
  });
  const [loading, setLoading] = React.useState(url === null || url === undefined ? true : false);
  React.useEffect(() => {
    let off = false;
    const key = `${item.type}|${(item.title || '').toLowerCase()}|${item.year || ''}`;
    const cached = cacheGet(key);
    if (cached !== undefined) { setUrl(cached); setLoading(false); return; }
    setLoading(true);
    resolveCover(item).then(u => { if (!off) { setUrl(u); setLoading(false); } });
    return () => { off = true; };
  }, [item.id, item.title, item.type, item.year]);
  return { url, loading };
}

// Composant : affiche la vraie couverture si elle existe, sinon retombe sur
// le poster procédural. Props : item, ...rest passés au <img> final.
function Cover({ item, style, alt, ...rest }) {
  const { url, loading } = useCover(item);
  const fallback = posterFor(item);
  const src = url || fallback;
  return (
    <img src={src} alt={alt ?? item.title}
         onError={(e) => { if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback; }}
         style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity .2s', opacity: loading && !url ? 0.7 : 1, ...style }}
         {...rest} />
  );
}

Object.assign(window, { COVER_KEYS, resolveCover, useCover, Cover, cacheGet: cacheGet, cacheSet: cacheSet });
