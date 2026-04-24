// Shared mock data + poster generator for Récréation.
// All titles are original/fictional to avoid IP concerns.
// Posters are procedurally generated color-field covers keyed off the title hash.

const MEDIA = [
  // FILMS — à voir
  { id: 'f1',  type: 'film',  status: 'a_voir',  title: 'La Nuit Verticale',        year: 2019, dir: 'M. Orlov',          runtime: '1h 52', rating: null, mood: null, added: '2026-03-14', note: '' },
  { id: 'f2',  type: 'film',  status: 'a_voir',  title: 'Chromies',                 year: 2023, dir: 'A. Benali',         runtime: '1h 38', rating: null, mood: null, added: '2026-03-22', note: '' },
  { id: 'f3',  type: 'film',  status: 'a_voir',  title: 'Les Plages de Fer',        year: 2014, dir: 'S. Fontaine',       runtime: '2h 11', rating: null, mood: null, added: '2026-04-02', note: '' },
  { id: 'f4',  type: 'film',  status: 'en_cours',title: 'Une Saison à Port-Libre', year: 2021, dir: 'J. Kovács',         runtime: '3h 02', rating: null, mood: 'solo', added: '2026-04-10', note: 'Pause à 1h40 \u2014 reprendre après dîner.' },
  { id: 'f5',  type: 'film',  status: 'termine', title: 'Oiseau de Papier',         year: 2017, dir: 'L. Nakamura',       runtime: '1h 29', rating: 4.5, mood: 'couple', added: '2026-01-08', note: 'Photographie. La scène du train.' },
  { id: 'f6',  type: 'film',  status: 'termine', title: 'Marée Basse',              year: 2012, dir: 'E. Cortázar',       runtime: '1h 44', rating: 5,   mood: 'solo',   added: '2025-12-19', note: 'Sans doute revu le plus cette année.' },
  { id: 'f7',  type: 'film',  status: 'termine', title: 'Dehors, les chiens',       year: 2009, dir: 'P. Hedström',       runtime: '1h 57', rating: 3,   mood: 'amis',   added: '2025-11-30', note: 'Plus tendre que je me souvenais.' },
  { id: 'f8',  type: 'film',  status: 'a_voir',  title: 'Le Tram 14',               year: 2024, dir: 'I. Dubois',         runtime: '1h 48', rating: null, mood: null, added: '2026-04-19', note: '' },

  // SÉRIES
  { id: 's1', type: 'serie', status: 'a_voir',  title: 'Havre Nord',               year: 2022, dir: '6 épisodes',        runtime: 'S1',   rating: null, mood: null, added: '2026-02-11', note: '' },
  { id: 's2', type: 'serie', status: 'en_cours',title: 'Les Corridors',            year: 2024, dir: '10 épisodes',       runtime: 'S2 E4',rating: null, mood: 'solo', added: '2026-03-02', note: 'Ralentissement au milieu de S2, reprendre calmement.' },
  { id: 's3', type: 'serie', status: 'en_cours',title: 'Minuit à Salonique',       year: 2020, dir: '8 épisodes',        runtime: 'S1 E6',rating: null, mood: 'couple', added: '2026-01-25', note: 'Épisode 6 ce soir.' },
  { id: 's4', type: 'serie', status: 'termine', title: 'Petits Incendies',         year: 2018, dir: '4 épisodes',        runtime: 'S1',   rating: 4,   mood: 'couple', added: '2025-10-04', note: 'Format court, bien tenu.' },
  { id: 's5', type: 'serie', status: 'termine', title: 'Boréal',                   year: 2016, dir: '12 épisodes',       runtime: 'S1–S2',rating: 3.5, mood: 'solo',   added: '2025-09-17', note: 'Long mais ça vaut le détour.' },
  { id: 's6', type: 'serie', status: 'a_voir',  title: 'Toutes les clés',          year: 2025, dir: '6 épisodes',        runtime: 'S1',   rating: null, mood: null, added: '2026-04-17', note: '' },

  // JEUX
  { id: 'j1', type: 'jeu',   status: 'a_voir',  title: 'Stellar Drift',            year: 2023, dir: 'Outland Studio',    runtime: '~20h', rating: null, mood: null, added: '2026-03-08', note: '' },
  { id: 'j2', type: 'jeu',   status: 'en_cours',title: 'Archipel',                 year: 2022, dir: 'Mira Games',        runtime: '34 / 60h', rating: null, mood: 'solo', added: '2026-02-20', note: 'Fin du chapitre 4, avant le désert.' },
  { id: 'j3', type: 'jeu',   status: 'en_cours',title: 'Dust & Violet',            year: 2021, dir: 'Petit Soleil',      runtime: '12 / 15h', rating: null, mood: 'solo', added: '2026-03-29', note: 'Deux boss restants.' },
  { id: 'j4', type: 'jeu',   status: 'termine', title: 'Helios',                   year: 2020, dir: 'Panoramic',         runtime: '28h',  rating: 5,   mood: 'solo',   added: '2025-08-02', note: 'La meilleure BO de l\u2019année.' },
  { id: 'j5', type: 'jeu',   status: 'termine', title: 'Lune de Papier',           year: 2019, dir: 'Atelier 14',        runtime: '9h',   rating: 4,   mood: 'amis',   added: '2025-07-12', note: 'Court, juste ce qu\u2019il faut.' },
  { id: 'j6', type: 'jeu',   status: 'a_voir',  title: 'Orage',                    year: 2025, dir: 'Noir Étoile',       runtime: '~40h', rating: null, mood: null, added: '2026-04-21', note: '' },

  // LIVRES
  { id: 'l1', type: 'livre', status: 'a_voir',  title: 'Le Jardin Oblique',        year: 2021, dir: 'C. Varga',          runtime: '312 p.', rating: null, mood: null, added: '2026-02-28', note: '' },
  { id: 'l2', type: 'livre', status: 'en_cours',title: 'Mémoires du Sel',          year: 2019, dir: 'R. Amrani',         runtime: 'p. 142 / 410', rating: null, mood: 'solo', added: '2026-03-11', note: 'Chapitre 7, lent mais beau.' },
  { id: 'l3', type: 'livre', status: 'en_cours',title: 'Anatomie d\u2019un Dimanche', year: 2024, dir: 'É. Laffite',     runtime: 'p. 88 / 240',  rating: null, mood: 'solo', added: '2026-04-05', note: 'Format court, un chapitre par soir.' },
  { id: 'l4', type: 'livre', status: 'termine', title: 'Les Pierres Bleues',       year: 2016, dir: 'F. Okonkwo',        runtime: '384 p.', rating: 4.5, mood: 'solo', added: '2025-11-20', note: 'La meilleure fin lue cette année.' },
  { id: 'l5', type: 'livre', status: 'termine', title: 'Signal Faible',            year: 2022, dir: 'A. Roux',           runtime: '220 p.', rating: 4,   mood: 'solo', added: '2026-01-12', note: 'Tendu jusqu\u2019au dernier chapitre.' },
  { id: 'l6', type: 'livre', status: 'a_voir',  title: 'Corbeaux d\u2019Avril',    year: 2025, dir: 'M. Takahashi',      runtime: '288 p.', rating: null, mood: null, added: '2026-04-22', note: '' },
];

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

  // A few composition variants; all share the color-field + typography ethos.
  let art = '';
  if (variant === 0) {
    // offset circle
    const cx = 60 + ((seed >> 5) % 180);
    const cy = 90 + ((seed >> 9) % 180);
    const r  = 80 + ((seed >> 11) % 60);
    art = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${accent}" opacity="0.9"/>`;
  } else if (variant === 1) {
    // diagonal band
    art = `<rect x="-40" y="${140 + ((seed>>7)%120)}" width="${w+80}" height="${40 + ((seed>>5)%40)}" fill="${accent}" transform="rotate(${ang/6} ${w/2} ${h/2})"/>`;
  } else if (variant === 2) {
    // stacked bars
    const g = [];
    for (let i = 0; i < 6; i++) {
      const y = 60 + i*40;
      const x = 20 + ((seed >> (i*3)) % 140);
      const bw = 40 + ((seed >> (i*2+4)) % 120);
      g.push(`<rect x="${x}" y="${y}" width="${bw}" height="6" fill="${accent}" opacity="${0.3 + (i%3)*0.25}"/>`);
    }
    art = g.join('');
  } else if (variant === 3) {
    // half-disc
    const cy = 200 + ((seed>>4)%120);
    art = `<circle cx="${w/2}" cy="${cy}" r="${140}" fill="${accent}" opacity="0.85"/><rect x="0" y="${cy}" width="${w}" height="${h-cy}" fill="${bottom}"/>`;
  } else {
    // triangle
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
