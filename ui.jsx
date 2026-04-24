// Shared UI atoms for Récréation — Nord theme (dark + light).
// https://www.nordtheme.com/

// ─────────────────────────────────────────────────────────────
// Nord palette
// ─────────────────────────────────────────────────────────────
const NORD = {
  // Polar Night
  n0: '#2e3440', n1: '#3b4252', n2: '#434c5e', n3: '#4c566a',
  // Snow Storm
  n4: '#d8dee9', n5: '#e5e9f0', n6: '#eceff4',
  // Frost
  n7: '#8fbcbb', n8: '#88c0d0', n9: '#81a1c1', n10: '#5e81ac',
  // Aurora
  n11: '#bf616a', n12: '#d08770', n13: '#ebcb8b', n14: '#a3be8c', n15: '#b48ead',
};

// Theme resolver. Pass a string 'dark' | 'light'; returns tokens.
function theme(mode = 'dark') {
  const dark = mode === 'dark';
  return {
    mode,
    bg:       dark ? NORD.n0 : NORD.n6,
    bgElev:   dark ? NORD.n1 : NORD.n5,
    bgInset:  dark ? '#262b35' : '#f4f6fa',
    line:     dark ? 'rgba(216,222,233,0.08)' : 'rgba(46,52,64,0.10)',
    lineStr:  dark ? 'rgba(216,222,233,0.16)' : 'rgba(46,52,64,0.18)',
    ink:      dark ? NORD.n6 : NORD.n0,
    inkDim:   dark ? NORD.n4 : NORD.n2,
    inkFaint: dark ? 'rgba(216,222,233,0.55)' : 'rgba(59,66,82,0.55)',
    inkGhost: dark ? 'rgba(216,222,233,0.25)' : 'rgba(59,66,82,0.25)',
    accent:   NORD.n8,          // Frost — primary accent
    accent2:  NORD.n10,         // Frost — deep
    teal:     NORD.n7,
    yellow:   NORD.n13,         // en_cours
    green:    NORD.n14,         // termine
    red:      NORD.n11,
    violet:   NORD.n15,
    orange:   NORD.n12,
    surfaceHi:dark ? NORD.n2 : '#ffffff',
    shadow:   dark ? '0 4px 16px rgba(0,0,0,0.35)' : '0 4px 16px rgba(46,52,64,0.10)',
    sans:     "'Inter', -apple-system, 'Segoe UI', system-ui, sans-serif",
    serif:    "'Instrument Serif', Georgia, serif",
    mono:     "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  };
}

// Back-compat: default export is dark theme.
const RTK = theme('dark');

// ─────────────────────────────────────────────────────────────
// Status colors (tied to theme for consistency)
// ─────────────────────────────────────────────────────────────
function statusColor(mode, status) {
  const t = theme(mode);
  return ({
    a_voir:   t.inkFaint,
    en_cours: t.yellow,
    termine:  t.green,
  })[status];
}

// ─────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────
function Icon({ name, size = 16, stroke = 1.5, color = 'currentColor' }) {
  const paths = {
    search:   <><circle cx="7" cy="7" r="4.5"/><path d="M10.3 10.3L14 14"/></>,
    plus:     <><path d="M8 3v10M3 8h10"/></>,
    filter:   <><path d="M2 4h12M4 8h8M6 12h4"/></>,
    check:    <><path d="M3 8.5l3 3 7-7"/></>,
    play:     <><path d="M4 3l9 5-9 5z" fill={color} stroke="none"/></>,
    film:     <><rect x="2.5" y="3" width="11" height="10" rx="0.5"/><path d="M5 3v10M11 3v10M2.5 6h11M2.5 10h11"/></>,
    serie:    <><rect x="2" y="4" width="12" height="8" rx="1"/><path d="M6 14h4M8 12v2"/></>,
    jeu:      <><path d="M4 6h8a3 3 0 013 3v1a2 2 0 01-2 2 3 3 0 01-2.5-1.3L10 10H6l-.5.7A3 3 0 013 12a2 2 0 01-2-2V9a3 3 0 013-3z"/><path d="M5.5 8v2M4.5 9h2M10 9h0M11.5 9h0"/></>,
    livre:    <><path d="M3 2.5h6a2 2 0 012 2v9H5a2 2 0 01-2-2V2.5z"/><path d="M9 2.5h4v9a2 2 0 00-2 2H9V2.5z"/></>,
    star:     <><path d="M8 1.5l1.9 4 4.4.6-3.2 3.1.8 4.4L8 11.4 4.1 13.6l.8-4.4L1.7 6.1l4.4-.6z" fill={color} stroke="none"/></>,
    starO:    <><path d="M8 1.5l1.9 4 4.4.6-3.2 3.1.8 4.4L8 11.4 4.1 13.6l.8-4.4L1.7 6.1l4.4-.6z"/></>,
    clock:    <><circle cx="8" cy="8" r="6"/><path d="M8 4.5V8l2.5 1.5"/></>,
    arrow:    <><path d="M3 8h10M9 4l4 4-4 4"/></>,
    back:     <><path d="M13 8H3M7 4L3 8l4 4"/></>,
    more:     <><circle cx="4" cy="8" r="1" fill={color} stroke="none"/><circle cx="8" cy="8" r="1" fill={color} stroke="none"/><circle cx="12" cy="8" r="1" fill={color} stroke="none"/></>,
    grid:     <><rect x="2" y="2" width="5" height="5"/><rect x="9" y="2" width="5" height="5"/><rect x="2" y="9" width="5" height="5"/><rect x="9" y="9" width="5" height="5"/></>,
    list:     <><path d="M2 4h12M2 8h12M2 12h12"/></>,
    wall:     <><rect x="2" y="2" width="4" height="12"/><rect x="7" y="2" width="3" height="12"/><rect x="11" y="2" width="3" height="12"/></>,
    shuffle:  <><path d="M2 4h3l8 8h1M2 12h3l3-3M10 12h4M13 9l1 3-3 1M13 4h1M10 4l4 4"/></>,
    close:    <><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></>,
    edit:     <><path d="M3 13l2-1 7-7-1-1-7 7-1 2zM10 3l2 2"/></>,
    trash:    <><path d="M3.5 5h9M6 5V3.5h4V5M5 5l.7 8.5h4.6L11 5"/></>,
    sparkle:  <><path d="M8 2v4M8 10v4M2 8h4M10 8h4" strokeLinecap="round"/></>,
    heart:    <><path d="M8 13.5S2 10 2 6a3 3 0 015-2.2A3 3 0 0114 6c0 4-6 7.5-6 7.5z"/></>,
    sun:      <><circle cx="8" cy="8" r="3"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6L13 13M3 13l1.4-1.4M11.6 4.4L13 3"/></>,
    moon:     <><path d="M13 9.5A5.5 5.5 0 117 2c0 3.5 2.5 6 6 7.5z"/></>,
    mood_solo:  <><circle cx="8" cy="6" r="2.5"/><path d="M3.5 13c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4"/></>,
    mood_couple:<><circle cx="5.5" cy="6" r="2"/><circle cx="10.5" cy="6" r="2"/><path d="M5.5 13c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5"/></>,
    mood_amis:  <><circle cx="4" cy="5.5" r="1.8"/><circle cx="8" cy="4.5" r="1.8"/><circle cx="12" cy="5.5" r="1.8"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {paths[name] || null}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Star rating — half-steps
// ─────────────────────────────────────────────────────────────
function StarRating({ value, onChange, size = 14, color, gap = 2, inactive, t }) {
  const tk = t || RTK;
  const c1 = color || tk.yellow;
  const c0 = inactive || tk.inkGhost;
  const [hover, setHover] = React.useState(null);
  const v = hover != null ? hover : value;
  return (
    <div style={{ display: 'inline-flex', gap, alignItems: 'center', cursor: onChange ? 'pointer' : 'default' }}
         onMouseLeave={() => setHover(null)}>
      {[1,2,3,4,5].map((n) => {
        const full = v != null && v >= n;
        const half = v != null && v >= n - 0.5 && v < n;
        return (
          <div key={n} style={{ position: 'relative', width: size, height: size, lineHeight: 0 }}
               onMouseMove={onChange ? (e) => {
                 const r = e.currentTarget.getBoundingClientRect();
                 setHover(n - (e.clientX - r.left < r.width / 2 ? 0.5 : 0));
               } : null}
               onClick={onChange ? (e) => {
                 const r = e.currentTarget.getBoundingClientRect();
                 onChange(n - (e.clientX - r.left < r.width / 2 ? 0.5 : 0));
               } : null}>
            <Icon name="starO" size={size} color={c0} stroke={1.25} />
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', width: full ? '100%' : half ? '50%' : '0%' }}>
              <Icon name="star" size={size} color={c1} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Status dot + pill
// ─────────────────────────────────────────────────────────────
function StatusDot({ status, size = 6, t }) {
  const tk = t || RTK;
  const c = statusColor(tk.mode, status);
  return <span style={{ width: size, height: size, borderRadius: '50%', background: c, flexShrink: 0, boxShadow: status==='en_cours' ? `0 0 6px ${c}` : 'none' }} />;
}
function StatusPill({ status, t }) {
  const tk = t || RTK;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10, color: tk.inkDim, fontFamily: tk.mono, letterSpacing: 0.5, textTransform: 'uppercase' }}>
      <StatusDot status={status} t={tk} />
      {STATUS_LABEL[status]}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Search field
// ─────────────────────────────────────────────────────────────
function SearchField({ value, onChange, placeholder = 'Rechercher…', t }) {
  const tk = t || RTK;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: tk.bgInset, border: `1px solid ${tk.line}`,
      borderRadius: 10, padding: '10px 12px',
      fontFamily: tk.sans,
    }}>
      <Icon name="search" size={14} color={tk.inkFaint} stroke={1.5} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1, border: 'none', outline: 'none', background: 'transparent',
          color: tk.ink, fontSize: 13, fontFamily: 'inherit',
        }}
      />
      {value && (
        <button onClick={() => onChange('')}
          style={{ border: 'none', background: 'transparent', color: tk.inkFaint, cursor: 'pointer', padding: 0, display: 'flex' }}>
          <Icon name="close" size={12} stroke={1.8} />
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Type chip
// ─────────────────────────────────────────────────────────────
function TypeChip({ type, dim = false, t }) {
  const tk = t || RTK;
  return (
    <span style={{
      fontFamily: tk.mono, fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase',
      color: dim ? tk.inkFaint : tk.inkDim,
      border: `1px solid ${tk.line}`,
      background: `${tk.bg}cc`,
      backdropFilter: 'blur(6px)',
      borderRadius: 3, padding: '2px 5px', lineHeight: 1,
      display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>
      <Icon name={type} size={9} stroke={1.5} />
      {TYPE_LABEL[type]}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// App header
// ─────────────────────────────────────────────────────────────
function AppHeader({ title = 'Récréation', action = null, subtitle = null, t }) {
  const tk = t || RTK;
  return (
    <div style={{ padding: '12px 16px 10px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: tk.serif, fontStyle: 'italic', fontSize: 26, color: tk.ink, letterSpacing: -0.5, lineHeight: 1 }}>{title}</span>
          <span style={{ fontFamily: tk.mono, fontSize: 9, color: tk.inkFaint, letterSpacing: 1.2, textTransform: 'uppercase' }}>v.26</span>
        </div>
        {subtitle && <div style={{ marginTop: 4, fontFamily: tk.mono, fontSize: 10, color: tk.inkFaint, letterSpacing: 0.5 }}>{subtitle}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {action}
      </div>
    </div>
  );
}

// Phone status bar
function PhoneStatus({ dark = true, t }) {
  const tk = t || RTK;
  const c = tk.ink;
  return (
    <div style={{
      height: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', position: 'relative', fontFamily: tk.sans,
    }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: c, fontVariantNumeric: 'tabular-nums' }}>22:47</div>
      <div style={{ position: 'absolute', left: '50%', top: 10, transform: 'translateX(-50%)', width: 22, height: 22, borderRadius: '50%', background: '#000' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="14" height="10" viewBox="0 0 14 10"><path d="M7 9.5L0.6 3.1a9 9 0 0112.8 0L7 9.5z" fill={c} opacity="0.95"/></svg>
        <svg width="14" height="10" viewBox="0 0 14 10"><path d="M13 9.5V0.5L0.5 9.5h12.5z" fill={c}/></svg>
        <svg width="20" height="10" viewBox="0 0 20 10"><rect x="0.5" y="1" width="17" height="8" rx="1.5" fill="none" stroke={c} strokeWidth="1"/><rect x="2" y="2.5" width="12" height="5" rx="0.5" fill={c}/><rect x="18" y="3.5" width="1.2" height="3" fill={c}/></svg>
      </div>
    </div>
  );
}

// Pixel-style frame
function PixelFrame({ children, width = 412, height = 919, t }) {
  const tk = t || RTK;
  return (
    <div style={{
      width, height, borderRadius: 52, overflow: 'hidden',
      background: '#000',
      boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.06), 0 30px 80px rgba(0,0,0,0.4)',
      padding: 4, boxSizing: 'border-box',
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: 48, overflow: 'hidden',
        background: tk.bg, position: 'relative',
        display: 'flex', flexDirection: 'column',
      }}>
        <PhoneStatus t={tk} />
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {children}
        </div>
        <div style={{ height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 108, height: 4, borderRadius: 2, background: tk.ink, opacity: 0.6 }} />
        </div>
      </div>
    </div>
  );
}

// Generic icon button
function IconBtn({ name, onClick, t, active = false }) {
  const tk = t || RTK;
  return (
    <button onClick={onClick} style={{
      width: 34, height: 34, border: `1px solid ${active ? tk.ink : tk.line}`,
      background: active ? tk.ink : tk.bgInset,
      borderRadius: 17, color: active ? tk.bg : tk.ink, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon name={name} size={14} stroke={1.6} />
    </button>
  );
}

Object.assign(window, {
  NORD, theme, RTK, statusColor,
  Icon, StarRating, StatusDot, StatusPill,
  SearchField, TypeChip, AppHeader, PhoneStatus, PixelFrame, IconBtn,
});
