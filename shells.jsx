// Shells — MobileShell + DesktopShell
// The core layout chrome, separated from the app root for clarity.

function MobileShell({ t, items, counts, typeCounts, status, setStatus, type, setType, q, setQ, sort, setSort, filtered, layout, density, onOpen, onAdd, onSetStatus, onSetRating, mobileFilters, setMobileFilters, onToggleStats, tweaks }) {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', paddingBottom: 72 }}>
      <MobileTopBar t={t} onAdd={onAdd} onToggleStats={onToggleStats} mode={tweaks.theme} onToggleTheme={tweaks.onToggleTheme} />
      <div style={{ padding: '4px 16px 10px' }}>
        <SearchField value={q} onChange={setQ} placeholder="Rechercher un titre, un auteur…" t={t} />
      </div>
      <TypeChips t={t} type={type} setType={setType} counts={typeCounts} />
      <StatusTabs t={t} status={status} setStatus={setStatus} counts={counts} />
      <SortBar t={t} sort={sort} setSort={setSort} count={filtered.length} layout={layout} />
      <div style={{ padding: '4px 16px 24px' }}>
        <ResultGrid t={t} items={filtered} layout={layout} density={density} onOpen={onOpen} onSetStatus={onSetStatus} onSetRating={onSetRating} cols={layout==='mur' ? 3 : layout==='liste' ? 1 : 2} />
      </div>

      {/* Floating add button */}
      <button onClick={onAdd} style={{
        position: 'fixed', right: 20, bottom: 24, width: 56, height: 56, borderRadius: 28,
        background: t.accent, color: t.mode === 'dark' ? t.bg : '#fff',
        border: 'none', cursor: 'pointer', boxShadow: t.shadow,
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20,
      }}>
        <Icon name="plus" size={22} stroke={2} />
      </button>
    </div>
  );
}

function MobileTopBar({ t, onAdd, onToggleStats, mode, onToggleTheme }) {
  return (
    <div style={{ padding: '14px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: t.serif, fontStyle: 'italic', fontSize: 28, color: t.ink, letterSpacing: -0.5, lineHeight: 1 }}>Récréation</span>
        </div>
        <div style={{ marginTop: 4, fontFamily: t.mono, fontSize: 10, color: t.inkFaint, letterSpacing: 0.5 }}>ta bibliothèque, à revoir</div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <IconBtn name="sparkle" onClick={onToggleStats} t={t} />
        <IconBtn name={mode === 'dark' ? 'sun' : 'moon'} onClick={onToggleTheme} t={t} />
      </div>
    </div>
  );
}

function DesktopShell({ t, items, counts, typeCounts, status, setStatus, type, setType, q, setQ, sort, setSort, filtered, layout, density, onOpen, onAdd, onSetStatus, onSetRating, onToggleStats, showStats, tweaks }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ borderRight: `1px solid ${t.line}`, padding: '24px 18px', position: 'sticky', top: 0, height: '100vh', background: t.bgElev, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: t.serif, fontStyle: 'italic', fontSize: 30, letterSpacing: -0.5, color: t.ink, lineHeight: 1 }}>Récréation</div>
          <div style={{ marginTop: 6, fontFamily: t.mono, fontSize: 10, color: t.inkFaint, letterSpacing: 0.8, textTransform: 'uppercase' }}>ta bibliothèque</div>
        </div>

        <div style={{ fontFamily: t.mono, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: t.inkFaint, marginBottom: 8 }}>État</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 28 }}>
          {[{v:'a_voir',l:'À voir'},{v:'en_cours',l:'En cours'},{v:'termine',l:'Terminé'}].map(o => {
            const active = status === o.v;
            return (
              <button key={o.v} onClick={() => setStatus(o.v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                  border: 'none', borderRadius: 6,
                  background: active ? t.bgInset : 'transparent',
                  color: active ? t.ink : t.inkDim,
                  cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
                  fontWeight: active ? 600 : 500, textAlign: 'left',
                }}>
                <StatusDot status={o.v} t={t} />
                <span style={{ flex: 1 }}>{o.l}</span>
                <span style={{ fontFamily: t.mono, fontSize: 10, color: t.inkFaint }}>{counts[o.v]}</span>
              </button>
            );
          })}
        </div>

        <div style={{ fontFamily: t.mono, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: t.inkFaint, marginBottom: 8 }}>Catégorie</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            { v: 'all',   l: 'Tout',   ic: null },
            { v: 'film',  l: 'Films',  ic: 'film' },
            { v: 'serie', l: 'Séries', ic: 'serie' },
            { v: 'jeu',   l: 'Jeux',   ic: 'jeu' },
            { v: 'livre', l: 'Livres', ic: 'livre' },
          ].map(o => {
            const active = type === o.v;
            return (
              <button key={o.v} onClick={() => setType(o.v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                  border: 'none', borderRadius: 6,
                  background: active ? t.bgInset : 'transparent',
                  color: active ? t.ink : t.inkDim,
                  cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
                  fontWeight: active ? 600 : 500, textAlign: 'left',
                }}>
                <span style={{ width: 14, display: 'inline-flex' }}>{o.ic && <Icon name={o.ic} size={13} stroke={1.6} />}</span>
                <span style={{ flex: 1 }}>{o.l}</span>
                <span style={{ fontFamily: t.mono, fontSize: 10, color: t.inkFaint }}>{typeCounts[o.v]}</span>
              </button>
            );
          })}
        </div>

        <div style={{ flex: 1 }} />

        <button onClick={onToggleStats} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
          background: 'transparent', border: `1px solid ${t.line}`, borderRadius: 8,
          color: t.ink, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
          marginBottom: 8,
        }}>
          <Icon name="sparkle" size={13} stroke={1.6} />
          <span style={{ flex: 1, textAlign: 'left' }}>Statistiques</span>
          <Icon name="arrow" size={12} stroke={1.6} color={t.inkFaint} />
        </button>

        <button onClick={tweaks.onToggleTheme} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
          background: 'transparent', border: `1px solid ${t.line}`, borderRadius: 8,
          color: t.ink, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
        }}>
          <Icon name={t.mode === 'dark' ? 'sun' : 'moon'} size={13} stroke={1.6} />
          <span style={{ flex: 1, textAlign: 'left' }}>{t.mode === 'dark' ? 'Mode clair' : 'Mode sombre'}</span>
        </button>
      </aside>

      {/* Main */}
      <main style={{ padding: '28px 40px 60px', maxWidth: 1400 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <h1 style={{ margin: 0, fontFamily: t.serif, fontStyle: 'italic', fontSize: 36, letterSpacing: -0.6, color: t.ink, fontWeight: 400 }}>
                {type === 'all' ? 'Tout' : {film:'Films', serie:'Séries', jeu:'Jeux', livre:'Livres'}[type]}
              </h1>
              <span style={{ fontFamily: t.mono, fontSize: 11, color: t.inkFaint, letterSpacing: 1.2, textTransform: 'uppercase' }}>
                · {({a_voir:'à voir', en_cours:'en cours', termine:'terminé'})[status]} · {filtered.length}
              </span>
            </div>
          </div>
          <div style={{ width: 320 }}>
            <SearchField value={q} onChange={setQ} placeholder="Rechercher…" t={t} />
          </div>
          <button onClick={onAdd} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 16px', background: t.accent, color: t.mode === 'dark' ? t.bg : '#fff',
            border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
            fontFamily: 'inherit',
          }}>
            <Icon name="plus" size={13} stroke={2} />
            Ajouter
          </button>
        </div>

        <SortBar t={t} sort={sort} setSort={setSort} count={filtered.length} layout={layout} desktop />

        <ResultGrid t={t} items={filtered} layout={layout} density={density} onOpen={onOpen} onSetStatus={onSetStatus} onSetRating={onSetRating} cols={layout==='mur' ? 6 : layout==='liste' ? 1 : 4} />
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TypeChips, StatusTabs, SortBar
// ─────────────────────────────────────────────────────────────
function TypeChips({ t, type, setType, counts }) {
  const opts = [
    { value: 'all',   label: 'Tout',   count: counts.all },
    { value: 'film',  label: 'Films',  icon: 'film', count: counts.film },
    { value: 'serie', label: 'Séries', icon: 'serie', count: counts.serie },
    { value: 'jeu',   label: 'Jeux',   icon: 'jeu', count: counts.jeu },
    { value: 'livre', label: 'Livres', icon: 'livre', count: counts.livre },
  ];
  return (
    <div style={{ padding: '2px 12px 6px', display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
      {opts.map(o => {
        const active = type === o.value;
        return (
          <button key={o.value} onClick={() => setType(o.value)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', border: `1px solid ${active ? t.ink : t.line}`,
              background: active ? t.ink : 'transparent',
              color: active ? t.bg : t.inkDim,
              borderRadius: 999, fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
              fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0,
              minHeight: 36,
            }}>
            {o.icon && <Icon name={o.icon} size={12} stroke={1.6} />}
            {o.label}
            {o.count != null && <span style={{ fontFamily: t.mono, fontSize: 10, opacity: 0.6 }}>{o.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

function StatusTabs({ t, status, setStatus, counts }) {
  return (
    <div style={{ padding: '0 16px 8px', display: 'flex', gap: 0, borderBottom: `1px solid ${t.line}`, margin: '0 0 4px' }}>
      {[
        { v: 'a_voir',   l: 'À voir',   c: counts.a_voir },
        { v: 'en_cours', l: 'En cours', c: counts.en_cours },
        { v: 'termine',  l: 'Terminé',  c: counts.termine },
      ].map(o => {
        const active = status === o.v;
        return (
          <button key={o.v} onClick={() => setStatus(o.v)}
            style={{
              flex: 1, padding: '12px 8px', border: 'none',
              background: 'transparent',
              color: active ? t.ink : t.inkFaint,
              borderBottom: `2px solid ${active ? t.accent : 'transparent'}`,
              marginBottom: -1,
              fontSize: 13, fontWeight: active ? 600 : 500, cursor: 'pointer',
              fontFamily: 'inherit', minHeight: 44,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
            <StatusDot status={o.v} t={t} />
            {o.l}
            <span style={{ fontFamily: t.mono, fontSize: 10, opacity: 0.5 }}>{o.c}</span>
          </button>
        );
      })}
    </div>
  );
}

function SortBar({ t, sort, setSort, count, layout, desktop }) {
  const sorts = [
    { v: 'recent', l: 'Récents' },
    { v: 'title',  l: 'Titre' },
    { v: 'rating', l: 'Note' },
    { v: 'year',   l: 'Année' },
  ];
  return (
    <div style={{ padding: desktop ? '0 0 16px' : '8px 16px 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontFamily: t.mono, fontSize: 10, color: t.inkFaint, letterSpacing: 1, textTransform: 'uppercase' }}>Trier</span>
      <div style={{ display: 'flex', gap: 4 }}>
        {sorts.map(s => {
          const active = sort === s.v;
          return (
            <button key={s.v} onClick={() => setSort(s.v)}
              style={{
                border: 'none', background: active ? t.bgInset : 'transparent',
                color: active ? t.ink : t.inkDim,
                fontSize: 11.5, fontFamily: 'inherit', cursor: 'pointer',
                padding: '4px 10px', borderRadius: 4, fontWeight: active ? 600 : 500,
              }}>{s.l}</button>
          );
        })}
      </div>
      {desktop && <div style={{ flex: 1 }} />}
    </div>
  );
}

Object.assign(window, { MobileShell, DesktopShell, MobileTopBar, TypeChips, StatusTabs, SortBar });
