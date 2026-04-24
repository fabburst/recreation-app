// Composer — flux search-first avec détection IA du type.
// Phase 1 : recherche IA (type auto-détecté). Phase 2 : formulaire pré-rempli.

function Composer({ t, draft: initial, mode, onClose, onSave }) {
  // 'search' | 'detail'
  const [phase, setPhase] = React.useState(mode === 'edit' ? 'detail' : 'search');
  const [draft, setDraft] = React.useState(initial);
  const [query, setQuery] = React.useState(initial.title || '');
  const [suggestions, setSuggestions] = React.useState([]);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');
  const debounceRef = React.useRef(null);

  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  // Recherche IA — sans hint de type (détection auto)
  React.useEffect(() => {
    if (phase !== 'search') return;
    if (query.trim().length < 3) { setSuggestions([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setBusy(true); setErr('');
      try {
        const res = await aiSearch(query);
        setSuggestions(res || []);
      } catch {
        setErr("Recherche IA indisponible");
        setSuggestions([]);
      } finally { setBusy(false); }
    }, 450);
    return () => clearTimeout(debounceRef.current);
  }, [query, phase]);

  const pick = (s) => {
    setDraft(d => ({ ...d, title: s.title, year: s.year, dir: s.dir, runtime: s.runtime, type: s.type || d.type }));
    setQuery(s.title);
    setSuggestions([]);
    setPhase('detail');
  };

  const skipToManual = () => {
    if (query.trim()) setDraft(d => ({ ...d, title: query.trim() }));
    setPhase('detail');
  };

  const canSave = (draft.title || '').trim().length > 0;
  const TYPE_ICON = { film: '▸', serie: '▦', jeu: '◆', livre: '❒' };
  const TYPE_NAME = { film: 'Film', serie: 'Série', jeu: 'Jeu', livre: 'Livre' };

  return (
    <Overlay t={t} onClose={onClose}>
      <div style={{
        background: t.bgElev, border: `1px solid ${t.line}`, borderRadius: 16,
        width: 'min(560px, calc(100vw - 32px))', maxHeight: 'calc(100vh - 60px)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ padding: '18px 22px 14px', borderBottom: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: t.mono, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: t.inkFaint }}>
              {mode === 'edit' ? 'Modifier' : phase === 'search' ? 'Ajouter un titre' : 'Détails'}
            </div>
            <div style={{ fontFamily: t.serif, fontStyle: 'italic', fontSize: 22, color: t.ink, letterSpacing: -0.3, marginTop: 2 }}>
              {mode === 'edit' ? draft.title || 'Sans titre' : phase === 'search' ? 'Recherche IA' : draft.title || 'Nouveau titre'}
            </div>
          </div>
          {phase === 'detail' && mode !== 'edit' && (
            <button onClick={() => setPhase('search')} style={{ border: `1px solid ${t.line}`, background: 'transparent', color: t.inkDim, cursor: 'pointer', padding: '5px 10px', borderRadius: 8, fontSize: 11, fontFamily: t.mono }}>
              ← retour
            </button>
          )}
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', color: t.inkDim, cursor: 'pointer', width: 32, height: 32, borderRadius: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="close" size={14} stroke={1.8} />
          </button>
        </div>

        <div style={{ padding: '18px 22px', overflow: 'auto', flex: 1 }}>

          {/* ── PHASE SEARCH ── */}
          {phase === 'search' && (
            <>
              <div style={{ position: 'relative' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: t.bgInset, border: `1px solid ${t.lineStr}`, borderRadius: 10,
                  padding: '14px 16px',
                }}>
                  <Icon name="sparkle" size={16} color={t.accent} stroke={1.8} />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Film, série, jeu, livre… Gemini détecte le type."
                    style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', color: t.ink, fontSize: 15, fontFamily: 'inherit' }}
                    onKeyDown={(e) => e.key === 'Enter' && query.trim().length >= 3 && skipToManual()}
                  />
                  {busy && <Spinner t={t} />}
                </div>

                {suggestions.length > 0 && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                    background: t.surfaceHi || t.bgElev, border: `1px solid ${t.lineStr}`, borderRadius: 10,
                    boxShadow: t.shadow, zIndex: 10, overflow: 'hidden', maxHeight: 320, overflowY: 'auto',
                  }}>
                    {suggestions.map((s, i) => (
                      <button key={i} onClick={() => pick(s)} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        width: '100%', padding: '12px 16px', background: 'transparent',
                        border: 'none', borderBottom: i < suggestions.length - 1 ? `1px solid ${t.line}` : 'none',
                        color: t.ink, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = t.bgInset}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        {/* Type badge */}
                        <div style={{
                          width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                          background: `${t.accent}22`, border: `1px solid ${t.accent}44`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: t.mono, fontSize: 13, color: t.accent,
                        }}>
                          {TYPE_ICON[s.type] || '·'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: t.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</div>
                          <div style={{ fontFamily: t.mono, fontSize: 10, color: t.inkFaint, letterSpacing: 0.5, marginTop: 2 }}>
                            {TYPE_NAME[s.type] || s.type} · {[s.year, s.dir, s.runtime].filter(Boolean).join(' · ')}
                          </div>
                        </div>
                        <Icon name="arrow" size={12} color={t.inkFaint} stroke={1.6} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {err && <div style={{ marginTop: 8, fontFamily: t.mono, fontSize: 10, color: t.red || '#f87171' }}>{err}</div>}
              {!busy && query.length >= 3 && suggestions.length === 0 && !err && (
                <div style={{ marginTop: 8, fontFamily: t.mono, fontSize: 10, color: t.inkFaint }}>Aucun résultat — tu peux remplir manuellement.</div>
              )}

              {query.trim().length > 0 && (
                <button onClick={skipToManual} style={{
                  marginTop: 14, width: '100%', padding: '11px', border: `1px dashed ${t.line}`,
                  background: 'transparent', color: t.inkDim, borderRadius: 8,
                  cursor: 'pointer', fontSize: 12.5, fontFamily: 'inherit',
                }}>
                  Remplir manuellement →
                </button>
              )}
            </>
          )}

          {/* ── PHASE DETAIL ── */}
          {phase === 'detail' && (
            <>
              {/* Type selector */}
              <Label t={t}>Catégorie</Label>
              <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                {[
                  { v: 'film',  l: 'Film',  ic: 'film' },
                  { v: 'serie', l: 'Série', ic: 'serie' },
                  { v: 'jeu',   l: 'Jeu',   ic: 'jeu' },
                  { v: 'livre', l: 'Livre', ic: 'livre' },
                ].map(o => {
                  const active = draft.type === o.v;
                  return (
                    <button key={o.v} onClick={() => set('type', o.v)} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '8px 14px', border: `1px solid ${active ? t.accent : t.line}`,
                      background: active ? `${t.accent}22` : 'transparent',
                      color: active ? t.ink : t.inkDim,
                      borderRadius: 999, fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
                    }}>
                      <Icon name={o.ic} size={12} stroke={1.6} />{o.l}
                    </button>
                  );
                })}
              </div>

              <Field t={t} label="Titre">
                <input value={draft.title || ''} onChange={(e) => set('title', e.target.value)} style={inputStyle(t)} autoFocus={mode !== 'edit'} />
              </Field>
              <div style={{ height: 12 }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <Field t={t} label="Année">
                  <input type="number" value={draft.year || ''} onChange={(e) => set('year', parseInt(e.target.value) || null)} style={inputStyle(t)} />
                </Field>
                <Field t={t} label={draft.type === 'livre' ? 'Auteur' : draft.type === 'jeu' ? 'Studio' : 'Réalisateur'}>
                  <input value={draft.dir || ''} onChange={(e) => set('dir', e.target.value)} style={inputStyle(t)} />
                </Field>
              </div>

              <Field t={t} label={draft.type === 'livre' ? 'Pages / progression' : draft.type === 'jeu' ? 'Durée estimée' : 'Durée / épisodes'}>
                <input value={draft.runtime || ''} onChange={(e) => set('runtime', e.target.value)} style={inputStyle(t)} placeholder={draft.type === 'livre' ? '288 p.' : draft.type === 'jeu' ? '~20h' : '1h 48'} />
              </Field>

              <div style={{ height: 16 }} />

              <Label t={t}>État</Label>
              <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                {[{v:'a_voir',l:'À voir'},{v:'en_cours',l:'En cours'},{v:'termine',l:'Terminé'}].map(o => {
                  const active = draft.status === o.v;
                  return (
                    <button key={o.v} onClick={() => set('status', o.v)} style={{
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

              <Label t={t}>Note</Label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <StarRating value={draft.rating} onChange={(r) => set('rating', r)} size={22} t={t} />
                {draft.rating != null && (
                  <>
                    <span style={{ fontFamily: t.mono, fontSize: 11, color: t.inkDim }}>{draft.rating.toFixed(1)} / 5</span>
                    <button onClick={() => set('rating', null)} style={{ border: 'none', background: 'transparent', color: t.inkFaint, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>effacer</button>
                  </>
                )}
              </div>

              <Label t={t}>Contexte</Label>
              <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                {[{v:null,l:'—',ic:null},{v:'solo',l:'Solo',ic:'mood_solo'},{v:'couple',l:'À deux',ic:'mood_couple'},{v:'amis',l:'Amis',ic:'mood_amis'}].map(o => {
                  const active = draft.mood === o.v;
                  return (
                    <button key={String(o.v)} onClick={() => set('mood', o.v)} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6, flex: 1,
                      padding: '10px 10px', border: `1px solid ${active ? t.ink : t.line}`,
                      background: active ? t.bgInset : 'transparent',
                      color: active ? t.ink : t.inkDim,
                      borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
                      justifyContent: 'center', minHeight: 38,
                    }}>
                      {o.ic && <Icon name={o.ic} size={13} stroke={1.5} />}{o.l}
                    </button>
                  );
                })}
              </div>

              <Label t={t}>Commentaire</Label>
              <textarea value={draft.note || ''} onChange={(e) => set('note', e.target.value)}
                placeholder="Ce qu'il faut retenir, une scène, une ambiance…"
                style={{ ...inputStyle(t), minHeight: 80, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }} />
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 22px', borderTop: `1px solid ${t.line}`, display: 'flex', gap: 10, justifyContent: 'flex-end', background: t.bgElev }}>
          <button onClick={onClose} style={{
            padding: '10px 18px', border: `1px solid ${t.line}`, background: 'transparent',
            color: t.ink, borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: 500,
          }}>Annuler</button>
          {phase === 'detail' && (
            <button onClick={() => canSave && onSave(draft)} disabled={!canSave} style={{
              padding: '10px 22px', border: 'none',
              background: canSave ? t.accent : t.bgInset,
              color: canSave ? (t.mode === 'dark' ? t.bg : '#fff') : t.inkGhost,
              borderRadius: 8, cursor: canSave ? 'pointer' : 'not-allowed',
              fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
            }}>{mode === 'edit' ? 'Enregistrer' : 'Ajouter'}</button>
          )}
        </div>
      </div>
    </Overlay>
  );
}

function Label({ t, children }) {
  return <div style={{ fontFamily: t.mono, fontSize: 10, color: t.inkFaint, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 }}>{children}</div>;
}
function Field({ t, label, children }) {
  return (
    <div>
      <Label t={t}>{label}</Label>
      {children}
    </div>
  );
}
function inputStyle(t) {
  return {
    width: '100%', boxSizing: 'border-box',
    background: t.bgInset, border: `1px solid ${t.line}`, borderRadius: 8,
    padding: '10px 12px', color: t.ink, fontSize: 13, outline: 'none',
    fontFamily: t.sans,
  };
}
function Spinner({ t }) {
  return (
    <div style={{ width: 14, height: 14, border: `2px solid ${t.line}`, borderTopColor: t.accent, borderRadius: '50%', animation: 'rec-spin 0.7s linear infinite' }} />
  );
}

async function aiSearch(query) {
  const r = await fetch('/api/ai-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!r.ok) throw new Error('api error');
  return r.json();
}

function Overlay({ t, onClose, children, align = 'center' }) {
  React.useEffect(() => {
    const k = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
      zIndex: 100, display: 'flex', alignItems: align, justifyContent: 'center',
      padding: '24px 16px',
      animation: 'rec-fade .15s ease',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{ display: 'contents' }}>{children}</div>
    </div>
  );
}

Object.assign(window, { Composer, aiSearch, Overlay, Label, Field, inputStyle, Spinner });
