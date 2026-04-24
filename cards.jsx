// Cards — Grille / Liste / Mur variants
// Each consumes the same item and renders a different density.

function ResultGrid({ t, items, layout, density, onOpen, onSetStatus, onSetRating, cols }) {
  if (layout === 'liste') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: t.line, border: `1px solid ${t.line}`, borderRadius: 10, overflow: 'hidden' }}>
        {items.map(it => <ListRow key={it.id} item={it} t={t} onOpen={() => onOpen(it.id)} onSetStatus={onSetStatus} onSetRating={onSetRating} />)}
        {items.length === 0 && <EmptyState t={t} />}
      </div>
    );
  }
  if (layout === 'mur') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: density === 'compact' ? 4 : 8 }}>
        {items.map(it => <WallCard key={it.id} item={it} t={t} onOpen={() => onOpen(it.id)} />)}
        {items.length === 0 && <div style={{ gridColumn: '1/-1' }}><EmptyState t={t} /></div>}
      </div>
    );
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: density === 'compact' ? 10 : 16 }}>
      {items.map(it => <GridCard key={it.id} item={it} t={t} density={density} onOpen={() => onOpen(it.id)} onSetStatus={onSetStatus} onSetRating={onSetRating} />)}
      {items.length === 0 && <div style={{ gridColumn: '1/-1' }}><EmptyState t={t} /></div>}
    </div>
  );
}

function EmptyState({ t }) {
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center', color: t.inkFaint, fontSize: 13 }}>
      <div style={{ fontFamily: t.serif, fontStyle: 'italic', fontSize: 20, color: t.inkDim, marginBottom: 6 }}>Rien ici pour l'instant.</div>
      <div style={{ fontFamily: t.mono, fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase' }}>Ajoute un titre avec le bouton +</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// GridCard — poster + title + metadata
// ─────────────────────────────────────────────────────────────
function GridCard({ item, t, density, onOpen, onSetStatus, onSetRating }) {
  const compact = density === 'compact';
  return (
    <div onClick={onOpen} style={{ cursor: 'pointer', transition: 'transform .15s' }}
         onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
         onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
      <div style={{
        position: 'relative', aspectRatio: '2 / 3',
        borderRadius: 8, overflow: 'hidden',
        boxShadow: t.shadow,
        border: `1px solid ${t.line}`,
      }}>
        <Cover item={item} alt={item.title} />
        {item.status === 'en_cours' && <ProgressBar item={item} t={t} />}
        <div style={{ position: 'absolute', top: 8, left: 8 }}>
          <TypeChip type={item.type} t={t} />
        </div>
        {item.rating != null && (
          <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', padding: '3px 6px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 3, fontFamily: t.mono, fontSize: 10, color: '#fff' }}>
            <Icon name="star" size={9} color={t.yellow} />
            {item.rating.toFixed(1)}
          </div>
        )}
      </div>
      {!compact && (
        <div style={{ padding: '10px 2px 0' }}>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: t.ink, lineHeight: 1.35, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.title}</div>
          <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8, fontFamily: t.mono, fontSize: 9.5, color: t.inkFaint, letterSpacing: 0.5 }}>
            <span>{item.year}</span>
            <span>·</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.dir}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ProgressBar({ item, t }) {
  // Parse a pseudo progress from runtime ("12 / 15h", "p. 142 / 410", "S2 E4")
  const m = (item.runtime || '').match(/(\d+)\s*\/\s*(\d+)/);
  const ratio = m ? Math.min(1, parseInt(m[1]) / parseInt(m[2])) : 0.45;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: 'rgba(0,0,0,0.5)' }}>
      <div style={{ width: `${ratio*100}%`, height: '100%', background: t.yellow }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ListRow — editorial dense row
// ─────────────────────────────────────────────────────────────
function ListRow({ item, t, onOpen, onSetStatus, onSetRating }) {
  return (
    <div onClick={onOpen} style={{
      display: 'grid', gridTemplateColumns: '56px 1fr auto auto', alignItems: 'center', gap: 14,
      padding: '12px 14px', background: t.bgElev, cursor: 'pointer',
    }}>
      <div style={{ width: 56, aspectRatio: '2/3', borderRadius: 4, overflow: 'hidden', border: `1px solid ${t.line}` }}>
        <Cover item={item} alt="" />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <TypeChip type={item.type} t={t} />
          <StatusPill status={item.status} t={t} />
        </div>
        <div style={{ fontSize: 14, fontWeight: 500, color: t.ink, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
        <div style={{ fontFamily: t.mono, fontSize: 10, color: t.inkFaint, letterSpacing: 0.5, marginTop: 2 }}>
          {item.year} · {item.dir} · {item.runtime}
        </div>
      </div>
      <div style={{ minWidth: 90, textAlign: 'right' }}>
        {item.rating != null ? <StarRating value={item.rating} size={12} t={t} /> : <span style={{ fontFamily: t.mono, fontSize: 10, color: t.inkGhost, letterSpacing: 0.5, textTransform: 'uppercase' }}>Non noté</span>}
      </div>
      <Icon name="arrow" size={12} color={t.inkFaint} stroke={1.6} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// WallCard — poster only (Letterboxd-style wall)
// ─────────────────────────────────────────────────────────────
function WallCard({ item, t, onOpen }) {
  return (
    <div onClick={onOpen} style={{ cursor: 'pointer', aspectRatio: '2/3', borderRadius: 4, overflow: 'hidden', position: 'relative', border: `1px solid ${t.line}` }}>
      <Cover item={item} />
      {item.status === 'en_cours' && <ProgressBar item={item} t={t} />}
      {item.rating != null && (
        <div style={{ position: 'absolute', bottom: 4, right: 4, background: 'rgba(0,0,0,0.6)', padding: '2px 4px', borderRadius: 3, fontFamily: t.mono, fontSize: 9, color: '#fff' }}>
          ★ {item.rating.toFixed(1)}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { ResultGrid, GridCard, ListRow, WallCard, ProgressBar, EmptyState });
