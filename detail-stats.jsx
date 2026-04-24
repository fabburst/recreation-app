// Detail overlay + Stats panel

function DetailOverlay({ t, item, onClose, onEdit, onDelete, onSetStatus, onSetRating, onEditNote }) {
  const [editingNote, setEditingNote] = React.useState(false);
  const [noteVal, setNoteVal] = React.useState(item.note || '');

  return (
    <Overlay t={t} onClose={onClose}>
      <div style={{
        background: t.bgElev, border: `1px solid ${t.line}`, borderRadius: 16,
        width: 'min(720px, calc(100vw - 32px))', maxHeight: 'calc(100vh - 60px)',
        overflow: 'auto', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ position: 'relative', padding: 0 }}>
          <div style={{ height: 180, position: 'relative', overflow: 'hidden' }}>
            <Cover item={item} alt="" style={{ filter: 'blur(20px) saturate(0.9)', transform: 'scale(1.2)' }} />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent, ${t.bgElev})` }} />
          </div>
          <button onClick={onClose} style={{
            position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: 16,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
            border: 'none', color: '#fff', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="close" size={14} stroke={1.8} />
          </button>
        </div>

        <div style={{ padding: '0 24px 24px', marginTop: -80, position: 'relative', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ width: 140, aspectRatio: '2/3', borderRadius: 10, overflow: 'hidden', border: `1px solid ${t.line}`, boxShadow: t.shadow, flexShrink: 0 }}>
            <Cover item={item} alt="" />
          </div>
          <div style={{ flex: 1, minWidth: 240, paddingTop: 72 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <TypeChip type={item.type} t={t} />
              <StatusPill status={item.status} t={t} />
            </div>
            <h2 style={{ margin: 0, fontFamily: t.serif, fontStyle: 'italic', fontSize: 32, letterSpacing: -0.5, color: t.ink, fontWeight: 400, lineHeight: 1.1 }}>{item.title}</h2>
            <div style={{ fontFamily: t.mono, fontSize: 11, color: t.inkFaint, letterSpacing: 0.6, marginTop: 8 }}>
              {[item.year, item.dir, item.runtime].filter(Boolean).join(' · ')}
            </div>
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <StarRating value={item.rating} onChange={onSetRating} size={20} t={t} />
              <span style={{ fontFamily: t.mono, fontSize: 11, color: t.inkDim }}>{item.rating != null ? item.rating.toFixed(1) + ' / 5' : 'Non noté'}</span>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 24px 20px' }}>
          <Label t={t}>État</Label>
          <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
            {[{v:'a_voir',l:'À voir'},{v:'en_cours',l:'En cours'},{v:'termine',l:'Terminé'}].map(o => {
              const active = item.status === o.v;
              return (
                <button key={o.v} onClick={() => onSetStatus(o.v)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, flex: 1,
                  padding: '10px 12px', border: `1px solid ${active ? t.ink : t.line}`,
                  background: active ? t.bgInset : 'transparent',
                  color: active ? t.ink : t.inkDim,
                  borderRadius: 8, fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
                  justifyContent: 'center', minHeight: 40,
                }}>
                  <StatusDot status={o.v} t={t} />{o.l}
                </button>
              );
            })}
          </div>

          <Label t={t}>Commentaire</Label>
          {editingNote ? (
            <div>
              <textarea value={noteVal} onChange={(e) => setNoteVal(e.target.value)} autoFocus
                style={{ ...inputStyle(t), minHeight: 100, resize: 'vertical', lineHeight: 1.5 }} />
              <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'flex-end' }}>
                <button onClick={() => { setEditingNote(false); setNoteVal(item.note || ''); }}
                  style={{ padding: '7px 14px', border: `1px solid ${t.line}`, background: 'transparent', color: t.ink, borderRadius: 6, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>Annuler</button>
                <button onClick={() => { onEditNote(noteVal); setEditingNote(false); }}
                  style={{ padding: '7px 14px', border: 'none', background: t.accent, color: t.mode === 'dark' ? t.bg : '#fff', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600 }}>Enregistrer</button>
              </div>
            </div>
          ) : (
            <div onClick={() => setEditingNote(true)} style={{
              padding: '14px 16px', background: t.bgInset, border: `1px dashed ${t.line}`, borderRadius: 8,
              color: item.note ? t.ink : t.inkFaint, fontSize: 13, lineHeight: 1.55, cursor: 'text', minHeight: 60,
              fontFamily: t.serif, fontStyle: item.note ? 'normal' : 'italic',
            }}>
              {item.note || 'Ajoute une note, un souvenir, une scène…'}
            </div>
          )}
        </div>

        <div style={{ padding: '14px 24px', borderTop: `1px solid ${t.line}`, display: 'flex', gap: 8, justifyContent: 'space-between', background: t.bgElev }}>
          <button onClick={onDelete} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '9px 14px', border: `1px solid ${t.line}`, background: 'transparent',
            color: t.red, borderRadius: 8, cursor: 'pointer', fontSize: 12.5, fontFamily: 'inherit', fontWeight: 500,
          }}>
            <Icon name="trash" size={12} stroke={1.6} />Supprimer
          </button>
          <button onClick={onEdit} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '9px 18px', border: 'none', background: t.accent,
            color: t.mode === 'dark' ? t.bg : '#fff', borderRadius: 8, cursor: 'pointer',
            fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit',
          }}>
            <Icon name="edit" size={12} stroke={1.8} />Modifier
          </button>
        </div>
      </div>
    </Overlay>
  );
}

// ─────────────────────────────────────────────────────────────
// Stats Panel
// ─────────────────────────────────────────────────────────────
function StatsPanel({ t, items, onClose }) {
  const s = computeStats(items);
  const months = React.useMemo(() => {
    const m = {};
    items.filter(i => i.status === 'termine' && i.added).forEach(i => {
      const k = i.added.slice(0, 7);
      m[k] = (m[k] || 0) + 1;
    });
    return Object.entries(m).sort().slice(-12);
  }, [items]);
  const max = Math.max(1, ...months.map(([,v]) => v));
  const total = items.length;
  const termine = items.filter(i=>i.status==='termine').length;
  const enCours = items.filter(i=>i.status==='en_cours').length;
  const aVoir = items.filter(i=>i.status==='a_voir').length;

  return (
    <Overlay t={t} onClose={onClose}>
      <div style={{
        background: t.bgElev, border: `1px solid ${t.line}`, borderRadius: 16,
        width: 'min(820px, calc(100vw - 32px))', maxHeight: 'calc(100vh - 60px)',
        overflow: 'auto',
      }}>
        <div style={{ padding: '22px 26px 18px', borderBottom: `1px solid ${t.line}`, display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: t.mono, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: t.inkFaint }}>Bilan</div>
            <div style={{ fontFamily: t.serif, fontStyle: 'italic', fontSize: 28, color: t.ink, letterSpacing: -0.4, marginTop: 2 }}>Ce que tu as consommé</div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', color: t.inkDim, cursor: 'pointer', width: 32, height: 32, borderRadius: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="close" size={14} stroke={1.8} />
          </button>
        </div>

        <div style={{ padding: 26, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          <StatTile t={t} big label="Terminé" value={termine} />
          <StatTile t={t} big label="En cours" value={enCours} valueColor={t.yellow} />
          <StatTile t={t} big label="À voir" value={aVoir} />
          <StatTile t={t} big label="Note moy." value={s.avg} valueColor={t.accent} />
        </div>

        <div style={{ padding: '0 26px 22px' }}>
          <Label t={t}>Répartition par catégorie</Label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {[
              { k: 'film',  l: 'Films',  c: t.accent },
              { k: 'serie', l: 'Séries', c: t.violet },
              { k: 'jeu',   l: 'Jeux',   c: t.teal },
              { k: 'livre', l: 'Livres', c: t.orange },
            ].map(o => (
              <div key={o.k} style={{ background: t.bgInset, borderRadius: 8, padding: 12, border: `1px solid ${t.line}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 3, background: o.c }} />
                  <span style={{ fontFamily: t.mono, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: t.inkFaint }}>{o.l}</span>
                </div>
                <div style={{ fontFamily: t.serif, fontSize: 30, color: t.ink, lineHeight: 1 }}>{s.byType[o.k]}</div>
              </div>
            ))}
          </div>
        </div>

        {months.length > 0 && (
          <div style={{ padding: '0 26px 22px' }}>
            <Label t={t}>Terminé — 12 derniers mois</Label>
            <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 100, padding: '8px 0', borderBottom: `1px solid ${t.line}` }}>
              {months.map(([k, v]) => (
                <div key={k} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: '100%', height: `${(v / max) * 80}px`, minHeight: 4,
                    background: t.accent, borderRadius: 2, opacity: 0.35 + (v/max) * 0.65,
                  }} title={`${k}: ${v}`} />
                  <div style={{ fontFamily: t.mono, fontSize: 8, color: t.inkFaint, letterSpacing: 0.4 }}>{k.slice(5)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {s.top.length > 0 && (
          <div style={{ padding: '0 26px 26px' }}>
            <Label t={t}>Tes coups de cœur</Label>
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto' }}>
              {s.top.map(it => (
                <div key={it.id} style={{ flex: '0 0 120px' }}>
                  <div style={{ aspectRatio: '2/3', borderRadius: 6, overflow: 'hidden', border: `1px solid ${t.line}` }}>
                    <Cover item={it} alt="" />
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11.5, fontWeight: 500, color: t.ink, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{it.title}</div>
                  <div style={{ fontFamily: t.mono, fontSize: 10, color: t.accent, marginTop: 3 }}>★ {it.rating.toFixed(1)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Overlay>
  );
}

function StatTile({ t, label, value, valueColor, big }) {
  return (
    <div style={{ background: t.bgInset, borderRadius: 10, padding: big ? '16px 16px' : '12px', border: `1px solid ${t.line}` }}>
      <div style={{ fontFamily: t.mono, fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', color: t.inkFaint, marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: t.serif, fontSize: big ? 36 : 26, color: valueColor || t.ink, lineHeight: 1, letterSpacing: -0.5 }}>{value}</div>
    </div>
  );
}

Object.assign(window, { DetailOverlay, StatsPanel, StatTile });
