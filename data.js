// Poster generator for Récréation.
// Posters are procedurally generated color-field covers keyed off the title hash.

const MEDIA = []; // source de vérité = Supabase

const STATUS_LABEL = { a_voir: 'À voir', en_cours: 'En cours', termine: 'Terminé' };
const TYPE_LABEL   = { film: 'Film',    serie: 'Série',       jeu: 'Jeu', livre: 'Livre' };
const TYPE_GLYPH   = { film: '▸',       serie: '▦',           jeu: '◆',  livre: '❒' };

// Deterministic hash → used for consistent poster colors.
function titleHash(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

// Palettes tuned to our dark ground. Each entry: [top, bottom, accent, ink]
const POSTER_PALETTES = [
  ['#1f2a36', '#0a0d10', '#f4a261', '#f5f1e8'],
  ['#2b1e2a', '#0d0a10', '#e9c46a', '#f5f1e8'],
  ['#10302e', '#070d0c', '#94d2bd', '#f5f1e8'],
  ['#2a2213', '#0e0a05', '#e76f51', '#f5f1e8'],
  ['#1a2332', '#06080c', '#bde0fe', '#f5f1e8'],
  ['#2a1a1a', '#0b0606', '#ffb4a2', '#f5f1e8'],
  ['#1c2b1e', '#070c08', '#a3c9a8', '#f5f1e8'],
  ['#321e10', '#0c0704', '#ddbea9', '#f5f1e8'],
  ['#15202b', '#05090d', '#caf0f8', '#f5f1e8'],
  ['#231a2f', '#08060c', '#cdb4db', '#f5f1e8'],
];

// Build a procedural poster as a data-URI SVG. Deterministic per title.
function posterFor(item, opts = {}) {
  const w = opts.w || 300, h = opts.h || 444;
  const seed = titleHash(item.title);
  const pal = POSTER_PALETTES[seed % POSTER_PALETTES.length];
  const [top, bottom, accent, ink] = pal;
  const variant = (seed >> 8) % 5;
  const ang = ((seed >> 3) % 180) - 90;

  let art = '';
  if (variant === 0) {
    const cx = 60 + ((seed >> 5) % 180);
    const cy = 90 + ((seed >> 9) % 180);
    const r  = 80 + ((seed >> 11) % 60);
    art = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${accent}" opacity="0.9"/>`;
  } else if (variant === 1) {
    art = `<rect x="-40" y="${140 + ((seed>>7)%120)}" width="${w+80}" height="${40 + ((seed>>5)%40)}" fill="${accent}" transform="rotate(${ang/6} ${w/2} ${h/2})"/>`;
  } else if (variant === 2) {
    const g = [];
    for (let i = 0; i < 6; i++) {
      const y = 60 + i*40;
      const x = 20 + ((seed >> (i*3)) % 140);
      const bw = 40 + ((seed >> (i*2+4)) % 120);
      g.push(`<rect x="${x}" y="${y}" width="${bw}" height="6" fill="${accent}" opacity="${0.3 + (i%3)*0.25}"/>`);
    }
    art = g.join('');
  } else if (variant === 3) {
    const cy = 200 + ((seed>>4)%120);
    art = `<circle cx="${w/2}" cy="${cy}" r="${140}" fill="${accent}" opacity="0.85"/><rect x="0" y="${cy}" width="${w}" height="${h-cy}" fill="${bottom}"/>`;
  } else {
    const x1 = (seed>>6)%w, x2 = w - ((seed>>10)%w);
    art = `<polygon points="${x1},60 ${x2},60 ${w/2},${h-80}" fill="${accent}" opacity="0.9"/>`;
  }

  const title = (item.title || '').replace(/&/g,'&amp;').replace(/</g,'&lt;');
  const year  = item.year || '';
  const typ   = (TYPE_LABEL[item.type] || '').toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${top}"/>
        <stop offset="1" stop-color="${bottom}"/>
      </linearGradient>
      <filter id="n"><feTurbulence baseFrequency="0.9" numOctaves="2"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0"/></filter>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    ${art}
    <rect width="${w}" height="${h}" filter="url(#n)"/>
    <g font-family="'Instrument Serif', Georgia, serif" fill="${ink}">
      <text x="20" y="${h - 44}" font-size="26" font-style="italic" style="letter-spacing:-0.5px">${title.slice(0, 22)}</text>
    </g>
    <g font-family="'JetBrains Mono', ui-monospace, monospace" fill="${ink}" opacity="0.65">
      <text x="20" y="${h - 22}" font-size="10" style="letter-spacing:1.5px">${typ} · ${year}</text>
    </g>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// Compact stats derived from data, for the stats panel layout.
function computeStats(items) {
  const termine = items.filter(i => i.status === 'termine');
  const byType = { film: 0, serie: 0, jeu: 0, livre: 0 };
  termine.forEach(i => { byType[i.type] = (byType[i.type]||0)+1; });
  const ratings = termine.filter(i => i.rating != null).map(i => i.rating);
  const avg = ratings.length ? (ratings.reduce((a,b)=>a+b,0)/ratings.length).toFixed(2) : '—';
  const top = [...termine].filter(i=>i.rating!=null).sort((a,b)=>b.rating-a.rating).slice(0,3);
  return { termine: termine.length, byType, avg, top };
}

Object.assign(window, { MEDIA, STATUS_LABEL, TYPE_LABEL, TYPE_GLYPH, posterFor, computeStats, titleHash });
