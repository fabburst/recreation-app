// Recreation app — full responsive web app.
// Mobile-first, with a desktop layout that kicks in at ≥ 900px.
// State persists to localStorage; Supabase adapter is stubbed in src/lib/supabase.js.

function useLocalStorage(key, initial) {
  const [v, setV] = React.useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; } catch { return initial; }
  });
  React.useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, setV];
}

function useBreakpoint() {
  const [w, setW] = React.useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1200));
  React.useEffect(() => {
    const r = () => setW(window.innerWidth);
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);
  return w >= 900 ? 'desktop' : 'mobile';
}

// ─────────────────────────────────────────────────────────────
// App root
// ─────────────────────────────────────────────────────────────
function App({ tweaks }) {
  const mode = tweaks.theme;
  const t = theme(mode);
  const bp = useBreakpoint();

  const [items, setItems] = useLocalStorage('rec.items', MEDIA);
  const [status, setStatus] = React.useState('a_voir');
  const [type, setType] = React.useState('all');
  const [q, setQ] = React.useState('');
  const [sort, setSort] = React.useState('recent');
  const [selected, setSelected] = React.useState(null); // item id for detail overlay
  const [composer, setComposer] = React.useState(null); // {mode:'add'|'edit', draft}
  const [showStats, setShowStats] = React.useState(false);
  const [mobileFilters, setMobileFilters] = React.useState(false);

  const layout = tweaks.layout; // grille | liste | mur
  const density = tweaks.density; // compact | comfortable

  const counts = React.useMemo(() => {
    const c = { a_voir: 0, en_cours: 0, termine: 0 };
    items.forEach(m => { c[m.status]++; });
    return c;
  }, [items]);

  const typeCounts = React.useMemo(() => {
    const c = { all: 0, film: 0, serie: 0, jeu: 0, livre: 0 };
    items.filter(m => m.status === status).forEach(m => { c.all++; c[m.type]++; });
    return c;
  }, [items, status]);

  const filtered = React.useMemo(() => {
    let xs = items.filter(m => m.status === status
      && (type === 'all' || m.type === type)
      && (!q || m.title.toLowerCase().includes(q.toLowerCase()) || (m.dir||'').toLowerCase().includes(q.toLowerCase())));
    xs = [...xs].sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title);
      if (sort === 'rating') return (b.rating||0) - (a.rating||0);
      if (sort === 'year')  return (b.year||0) - (a.year||0);
      return (b.added||'').localeCompare(a.added||'');
    });
    return xs;
  }, [items, status, type, q, sort]);

  const selItem = items.find(i => i.id === selected);

  const upsert = (draft) => {
    setItems(xs => {
      const ex = xs.find(i => i.id === draft.id);
      if (ex) return xs.map(i => i.id === draft.id ? { ...i, ...draft } : i);
      return [{ ...draft, id: draft.id || ('x' + Date.now()), added: new Date().toISOString().slice(0,10) }, ...xs];
    });
  };
  const removeItem = (id) => setItems(xs => xs.filter(i => i.id !== id));

  // Quick "progress item" action
  const setStatusOf = (id, s) => setItems(xs => xs.map(i => i.id === id ? { ...i, status: s } : i));
  const setRatingOf = (id, r) => setItems(xs => xs.map(i => i.id === id ? { ...i, rating: r } : i));

  return (
    <div style={{ minHeight: '100vh', background: t.bg, color: t.ink, fontFamily: t.sans }}>
      {bp === 'desktop'
        ? <DesktopShell
            t={t} items={items} counts={counts} typeCounts={typeCounts}
            status={status} setStatus={setStatus}
            type={type} setType={setType} q={q} setQ={setQ} sort={sort} setSort={setSort}
            filtered={filtered} layout={layout} density={density}
            onOpen={setSelected} onAdd={() => setComposer({ mode: 'add', draft: newDraft() })}
            onSetStatus={setStatusOf} onSetRating={setRatingOf}
            onToggleStats={() => setShowStats(s => !s)} showStats={showStats}
            tweaks={tweaks}
          />
        : <MobileShell
            t={t} items={items} counts={counts} typeCounts={typeCounts}
            status={status} setStatus={setStatus}
            type={type} setType={setType} q={q} setQ={setQ} sort={sort} setSort={setSort}
            filtered={filtered} layout={layout} density={density}
            onOpen={setSelected} onAdd={() => setComposer({ mode: 'add', draft: newDraft() })}
            onSetStatus={setStatusOf} onSetRating={setRatingOf}
            mobileFilters={mobileFilters} setMobileFilters={setMobileFilters}
            onToggleStats={() => setShowStats(s => !s)} showStats={showStats}
            tweaks={tweaks}
          />
      }

      {selItem && (
        <DetailOverlay t={t} item={selItem} onClose={() => setSelected(null)}
          onEdit={() => { setComposer({ mode: 'edit', draft: selItem }); setSelected(null); }}
          onDelete={() => { removeItem(selItem.id); setSelected(null); }}
          onSetStatus={(s) => setStatusOf(selItem.id, s)}
          onSetRating={(r) => setRatingOf(selItem.id, r)}
          onEditNote={(note) => upsert({ ...selItem, note })} />
      )}

      {composer && (
        <Composer t={t} draft={composer.draft} mode={composer.mode}
          onClose={() => setComposer(null)}
          onSave={(d) => { upsert(d); setComposer(null); }} />
      )}

      {showStats && <StatsPanel t={t} items={items} onClose={() => setShowStats(false)} />}
    </div>
  );
}

function newDraft() {
  return {
    id: '', title: '', type: 'film', status: 'a_voir',
    year: new Date().getFullYear(), dir: '', runtime: '',
    rating: null, mood: null, note: '',
  };
}

Object.assign(window, { App, useLocalStorage, useBreakpoint, newDraft });
