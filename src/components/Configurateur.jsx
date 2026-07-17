import { useState, useRef, useCallback, useEffect } from 'react'

const ACCENT = '#e8632e'

const MATERIALS = [
  { id: 'composite',   name: 'Composite',      rate: 72 },
  { id: 'cedre',       name: 'Cèdre',          rate: 52 },
  { id: 'bois-traite', name: 'Bois traité',    rate: 38 },
  { id: 'aluminium',   name: 'Aluminium',      rate: 90 },
  { id: 'fibre',       name: 'Fibre de verre', rate: 98 },
]

const COLORS = {
  composite:    [['sea-salt','Sea Salt Grey','#b9b1a4'],['maritime','Maritime Gray','#71746f'],['cocoa','Dark Cocoa','#433329'],['teak','Dark Teak','#6e4a2d'],['coconut','Coconut Husk','#8c7155'],['oak','Natural White Oak','#c3a87d']],
  cedre:        [['naturel','Cèdre naturel','#c08a4f'],['miel','Teinte miel','#ad7438'],['gris','Gris perle','#9b8f7e']],
  'bois-traite':[['brun','Brun','#7a5a3a'],['naturel','Naturel','#b89a6a'],['gris','Gris','#8d8275']],
  aluminium:    [['charbon','Charbon','#3c3f43'],['noir','Noir','#262629'],['bronze','Bronze','#5d4b39'],['blanc','Blanc','#d6d2ca']],
  fibre:        [['gris','Gris','#8b8a86'],['sable','Sable','#c2b193'],['charbon','Charbon','#46443f']],
}

const RAILINGS = [
  { id: 'none',     name: 'Aucune',      rate: 0  },
  { id: 'alu-bois', name: 'Alu & bois',  rate: 46 },
  { id: 'alu',      name: 'Aluminium',   rate: 56 },
  { id: 'verre',    name: 'Verre',       rate: 74 },
  { id: 'spigot',   name: 'Verre/spigot',rate: 94 },
]

function matObj(s)   { return MATERIALS.find(m => m.id === s.material) || MATERIALS[0] }
function colorList(s){ return COLORS[s.material] || COLORS.composite }
function colorObj(s) { const l = colorList(s); return l.find(c => c[0] === s.color) || l[0] }
function railObj(s)  { return RAILINGS.find(r => r.id === s.railing) || RAILINGS[0] }

function pricing(s) {
  const area    = s.w * s.l
  const railLen = s.l + 2 * s.w
  const surface = area * matObj(s).rate
  const railing = (s.railing !== 'none' && s.h >= 2) ? railLen * railObj(s).rate : 0
  const stairs  = 0
  const panels  = s.panels * 385
  const lighting= s.lighting ? Math.max(railLen, 18) * 19 : 0
  const skirt   = s.skirt ? railLen * Math.max(s.h, 1) * 14 : 0
  const removal = s.removal ? 850 : 0
  const raw  = surface + railing + stairs + panels + lighting + skirt + removal
  const sub  = Math.max(raw, 3800)
  const tax  = sub * 0.14975
  const total= sub + tax
  return { area, railLen, surface, railing, stairs, panels, lighting, skirt, removal, sub, tax, total,
    low: total * 0.92, high: total * 1.08, minApplied: raw < 3800 }
}

function fmt(n) { return Math.round(n).toLocaleString('fr-CA') + ' $' }

// ── 3D scene ──────────────────────────────────────────────────────────────────

function Face({ w, h, transform, style }) {
  return (
    <div style={{
      position: 'absolute', left: '50%', top: '50%',
      width: w, height: h,
      transformOrigin: 'center center',
      transform,
      backfaceVisibility: 'hidden',
      ...style,
    }} />
  )
}

function Scene3D({ s, onMouseDown, onTouchStart }) {
  const colorHex = colorObj(s)[2]
  const scale    = Math.min(Math.max(290 / Math.max(s.w, s.l), 7), 24)
  const W = s.w * scale
  const D = s.l * scale
  const H = Math.max(s.h * scale * 0.8, 15)
  const railH  = Math.max(scale * 2.6, 30)
  const plankW = Math.max(scale * 0.55, 9)

  const deckTop = {
    backgroundColor: colorHex,
    backgroundImage: `repeating-linear-gradient(90deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) ${plankW - 1.5}px, rgba(0,0,0,.20) ${plankW - 1.5}px, rgba(0,0,0,.20) ${plankW}px), linear-gradient(160deg, rgba(255,255,255,.14), rgba(0,0,0,.05))`,
    boxShadow: 'inset 0 0 0 1.5px rgba(0,0,0,.18)',
  }
  const struct     = { background: '#2a2218', backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,.04) 0 1px, transparent 1px ${Math.max(scale * 1.4, 16)}px)`, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.3)' }
  const structDark = { background: '#1e1810' }

  let railStyle = null
  if (s.railing !== 'none' && s.h >= 2) {
    if (s.railing === 'verre' || s.railing === 'spigot') {
      railStyle = { background: 'rgba(150,172,182,.26)', borderTop: `3px solid ${s.railing === 'spigot' ? '#9aa0a6' : '#7a5a3a'}`, borderLeft: '1px solid rgba(255,255,255,.35)', borderRight: '1px solid rgba(255,255,255,.35)', boxShadow: 'inset 0 0 14px rgba(255,255,255,.22)' }
    } else if (s.railing === 'alu') {
      railStyle = { backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 7px, #2b2b2f 7px 10px)', borderTop: '4px solid #2b2b2f', borderBottom: '4px solid #2b2b2f' }
    } else {
      railStyle = { backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 7px, #2b2b2f 7px 10px)', borderTop: '5px solid #7a5a3a', borderBottom: '4px solid #2b2b2f' }
    }
  }
  const lift = -(H / 2 + railH / 2)

  const stairs = []
  if (s.steps > 0) {
    const ns     = s.steps
    const riser  = H / ns
    const tread  = Math.max(scale * 0.9, 11)
    const stairW = Math.min(W, Math.max(scale * 4, 58))
    const stepStyle = { backgroundColor: colorHex, backgroundImage: 'linear-gradient(160deg, rgba(255,255,255,.12), rgba(0,0,0,.06))', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.22)' }
    for (let i = 0; i < ns; i++) {
      const Y = (i + 1) * riser - H / 2
      const Z = D / 2 + (i + 0.5) * tread
      stairs.push(
        <Face key={`st${i}`} w={stairW} h={tread}     transform={`translate(-50%,-50%) translateY(${Y}px) translateZ(${Z}px) rotateX(90deg)`} style={stepStyle} />,
        <Face key={`sr${i}`} w={stairW} h={riser + 1} transform={`translate(-50%,-50%) translateY(${Y - riser / 2}px) translateZ(${Z + tread / 2}px)`} style={structDark} />,
      )
    }

  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 440 }}>
      <div style={{ position: 'absolute', left: '50%', top: '62%', width: W * 1.15, height: D * 0.66, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,0,0,.4), rgba(0,0,0,0) 70%)', filter: 'blur(3px)' }} />
      <div
        style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', perspective: 1300, cursor: 'grab', touchAction: 'none' }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <div style={{ position: 'relative', width: 1, height: 1, transformStyle: 'preserve-3d', transform: `rotateX(${s.rotX}deg) rotateZ(0deg) rotateY(${s.rotY}deg)`, transition: 'transform .08s linear' }}>
          <Face w={W} h={H} transform={`translate(-50%,-50%) translateZ(${D / 2}px)`} style={struct} />
          <Face w={W} h={H} transform={`translate(-50%,-50%) rotateY(180deg) translateZ(${D / 2}px)`} style={structDark} />
          <Face w={D} h={H} transform={`translate(-50%,-50%) rotateY(90deg) translateZ(${W / 2}px)`} style={struct} />
          <Face w={D} h={H} transform={`translate(-50%,-50%) rotateY(-90deg) translateZ(${W / 2}px)`} style={struct} />
          <Face w={W} h={D} transform={`translate(-50%,-50%) rotateX(90deg) translateZ(${H / 2}px)`} style={deckTop} />
          {railStyle && <>
            <Face w={W} h={railH} transform={`translate(-50%,-50%) translateZ(${D / 2}px) translateY(${lift}px)`} style={railStyle} />
            <Face w={D} h={railH} transform={`translate(-50%,-50%) rotateY(90deg) translateZ(${W / 2}px) translateY(${lift}px)`} style={railStyle} />
            <Face w={D} h={railH} transform={`translate(-50%,-50%) rotateY(-90deg) translateZ(${W / 2}px) translateY(${lift}px)`} style={railStyle} />
          </>}
          {stairs}
        </div>
      </div>
    </div>
  )
}

// ── Controls ──────────────────────────────────────────────────────────────────

function Label({ children }) {
  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', color: '#8a7d68', marginBottom: 9 }}>
      {children}
    </div>
  )
}

function SegGroup({ label, opts, current, onPick }) {
  return (
    <div style={{ marginBottom: 17 }}>
      <Label>{label}</Label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {opts.map(o => {
          const on = o.id === current
          return (
            <button key={o.id} onClick={() => onPick(o.id)} style={{
              flex: '1 1 auto', minWidth: 'fit-content', padding: '9px 12px', borderRadius: 9, cursor: 'pointer',
              border: `1px solid ${on ? ACCENT : '#322a1e'}`, background: on ? ACCENT : '#16120c',
              color: on ? '#13100b' : '#c9bda8', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, transition: 'all .14s',
            }}>{o.name}</button>
          )
        })}
      </div>
    </div>
  )
}

function SwatchRow({ s, onPick }) {
  const list = colorList(s)
  const cur  = colorObj(s)
  return (
    <div style={{ marginBottom: 17 }}>
      <Label>Couleur · {cur[1]}</Label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {list.map(c => {
          const on = c[0] === s.color
          return (
            <button key={c[0]} title={c[1]} onClick={() => onPick(c[0])} style={{
              width: 36, height: 36, borderRadius: 8, cursor: 'pointer', background: c[2],
              border: `2px solid ${on ? '#ece3d3' : 'transparent'}`,
              boxShadow: on ? `0 0 0 2px ${ACCENT}` : 'inset 0 0 0 1px rgba(0,0,0,.3)',
              transition: 'all .14s',
            }} />
          )
        })}
      </div>
    </div>
  )
}

function SliderRow({ label, value, min, max, step, display, onChange }) {
  return (
    <div style={{ marginBottom: 15 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', color: '#8a7d68' }}>{label}</span>
        <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 700, color: '#ece3d3' }}>{display(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(+e.target.value)} onInput={e => onChange(+e.target.value)} />
    </div>
  )
}

function ToggleRow({ label, on, onToggle }) {
  return (
    <button onClick={onToggle} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
      padding: '12px 14px', borderRadius: 10, cursor: 'pointer', marginBottom: 7,
      border: `1px solid ${on ? ACCENT : '#322a1e'}`, background: on ? 'rgba(232,99,46,.12)' : '#16120c',
      color: '#e0d6c4', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600,
    }}>
      <span>{label}</span>
      <span style={{ width: 38, height: 22, borderRadius: 999, background: on ? ACCENT : '#322a1e', position: 'relative', transition: 'all .15s', flexShrink: 0, marginLeft: 12 }}>
        <span style={{ position: 'absolute', top: 2.5, left: on ? 18 : 2.5, width: 17, height: 17, borderRadius: '50%', background: '#ece3d3', transition: 'left .15s' }} />
      </span>
    </button>
  )
}

// ── EmailJS config ────────────────────────────────────────────────────────────
// ── Quote modal ───────────────────────────────────────────────────────────────

function buildMailto({ form, quote, lineItems, config }) {
  const subject = `Soumission patio — ${form.prenom} ${form.nom} — ${fmt(quote.low)} à ${fmt(quote.high)}`

  const body = [
    '━━━ COORDONNÉES ━━━',
    `Nom        : ${form.prenom} ${form.nom}`,
    `Courriel   : ${form.email}`,
    `Téléphone  : ${form.telephone || '—'}`,
    '',
    '━━━ CONFIGURATION DU PATIO ━━━',
    `Dimensions : ${config.w} pi × ${config.l} pi × ${config.h} pi de hauteur`,
    `Surface    : ${quote.area} pi²`,
    `Matériau   : ${config.materialName}`,
    `Couleur    : ${config.colorName}`,
    `Rampe      : ${config.railingName}`,
    `Marches    : ${config.steps === 0 ? 'aucune' : config.steps}`,
    `Panneaux intimité : ${config.panels === 0 ? 'aucun' : config.panels}`,
    `Éclairage DEL : ${config.lighting ? 'Oui' : 'Non'}`,
    `Jupe de patio : ${config.skirt ? 'Oui' : 'Non'}`,
    `Retrait ancien patio : ${config.removal ? 'Oui' : 'Non'}`,
    '',
    '━━━ DÉTAIL DU PRIX ━━━',
    ...lineItems.map(([l, v]) => `${l.padEnd(30)} ${fmt(v)}`),
    '',
    `${'Sous-total'.padEnd(30)} ${fmt(quote.sub)}`,
    `${'Taxes TPS+TVQ (14,975%)'.padEnd(30)} ${fmt(quote.tax)}`,
    '',
    `ESTIMATION TOTALE (taxes incluses) : ${fmt(quote.low)} – ${fmt(quote.high)}`,
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'Tarifs Rive-Nord 2026 · Valide 30 jours · RBQ 5876-4452-01',
    'Signature Patio · 514 924-2233',
  ].join('\n')

  return `mailto:signaturepatiorenovation@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function QuoteModal({ quote, lineItems, config, onClose }) {
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', telephone: '' })

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const inp = {
    padding: '11px 13px', border: '1px solid #2a2218', borderRadius: 9,
    fontSize: 15, fontFamily: "'Hanken Grotesk', sans-serif",
    background: '#13100b', color: '#ece3d3', outline: 'none', width: '100%',
  }
  function focus(e) { e.target.style.borderColor = '#e8632e' }
  function blur(e)  { e.target.style.borderColor = '#2a2218' }
  function field(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })) }

  function send(e) {
    e.preventDefault()
    window.location.href = buildMailto({ form, quote, lineItems, config })
    onClose()
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(13,10,7,.88)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px,4vw,48px)', animation: 'fadeUp .18s ease both' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#1a160f', border: '1px solid #2a2218', borderRadius: 20, padding: 'clamp(24px,3vw,40px)', maxWidth: 520, width: '100%', boxShadow: '0 40px 100px -20px rgba(0,0,0,.7)' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '.12em', color: ACCENT, marginBottom: 6 }}>RECEVOIR MA SOUMISSION</div>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 22, color: '#ece3d3', lineHeight: 1.1 }}>
              {fmt(quote.low)} – {fmt(quote.high)}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#7d735f', marginTop: 4 }}>taxes incluses · valide 30 jours</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: '1px solid #2a2218', color: '#7d735f', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: 16, display: 'grid', placeItems: 'center', flexShrink: 0 }}>✕</button>
        </div>

        <div style={{ background: '#13100b', borderRadius: 12, padding: '12px 16px', marginBottom: 22 }}>
          {lineItems.map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,.04)' }}>
              <span style={{ color: '#7d735f' }}>{label}</span>
              <span style={{ color: '#c9bda8', fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{fmt(val)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0 0', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#4a4234' }}>
            <span>TAXES TPS+TVQ</span><span>{fmt(quote.tax)}</span>
          </div>
        </div>

        <form onSubmit={send} style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[['prenom','PRÉNOM','text',true],['nom','NOM','text',true]].map(([name, label, type, req]) => (
              <label key={name} style={{ display: 'flex', flexDirection: 'column', gap: 5, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.08em', color: '#7d735f' }}>
                {label}
                <input name={name} type={type} required={req} value={form[name]} onChange={field} onFocus={focus} onBlur={blur} style={inp} />
              </label>
            ))}
              </div>
              {[['email','COURRIEL','email',true],['telephone','TÉLÉPHONE','tel',false]].map(([name, label, type, req]) => (
                <label key={name} style={{ display: 'flex', flexDirection: 'column', gap: 5, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '.08em', color: '#7d735f' }}>
                  {label}
                  <input name={name} type={type} required={req} value={form[name]} onChange={field} onFocus={focus} onBlur={blur} style={inp} />
                </label>
              ))}

              <button type="submit" style={{
                marginTop: 4, background: ACCENT,
                color: '#13100b', border: 'none', padding: '14px', borderRadius: 10,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, letterSpacing: '.04em',
                cursor: 'pointer',
              }}>
                OUVRIR MON APPLICATION DE COURRIEL →
              </button>
              <p style={{ margin: 0, textAlign: 'center', fontSize: 11, color: '#4a4234', fontFamily: "'JetBrains Mono', monospace" }}>
                Votre courriel s'ouvrira pré-rempli · Sans engagement
              </p>
            </form>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Configurateur() {
  const [s, setS] = useState({
    w: 14, l: 16, h: 3,
    material: 'composite', color: 'oak',
    railing: 'alu-bois', steps: 4, panels: 0,
    lighting: false, skirt: false, removal: false,
    rotY: -32, rotX: -56,
  })
  const [showModal, setShowModal] = useState(false)
  const sRef = useRef(s)
  sRef.current = s

  function set(patch) { setS(prev => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) })) }

  const startDrag = useCallback(e => {
    const sx = e.touches ? e.touches[0].clientX : e.clientX
    const sy = e.touches ? e.touches[0].clientY : e.clientY
    const { rotY: srY, rotX: srX } = sRef.current
    const move = ev => {
      if (ev.touches) ev.preventDefault()
      const x = ev.touches ? ev.touches[0].clientX : ev.clientX
      const y = ev.touches ? ev.touches[0].clientY : ev.clientY
      setS(prev => ({ ...prev, rotY: srY + (x - sx) * 0.4, rotX: Math.max(-80, Math.min(-10, srX + (y - sy) * 0.3)) }))
    }
    const up = () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchmove', move)
      window.removeEventListener('touchend', up)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    window.addEventListener('touchmove', move, { passive: false })
    window.addEventListener('touchend', up)
  }, [])

  function pickMaterial(id) { set({ material: id, color: (COLORS[id] || COLORS.composite)[0][0] }) }

  const p = pricing(s)

  const lineItems = [
    ['Surface · ' + p.area + ' pi²', p.surface],
    p.railing  > 0 && ['Rampe · '          + p.railLen + ' pi lin.', p.railing],
    p.panels   > 0 && ['Panneaux intimité · ' + s.panels,             p.panels],
    p.lighting > 0 && ['Éclairage DEL',                               p.lighting],
    p.skirt    > 0 && ['Jupe de patio',                               p.skirt],
    p.removal  > 0 && ['Retrait ancien patio',                        p.removal],
  ].filter(Boolean)

  const config = {
    w: s.w, l: s.l, h: s.h,
    steps: s.steps, panels: s.panels,
    lighting: s.lighting, skirt: s.skirt, removal: s.removal,
    materialName: matObj(s).name,
    colorName:    colorObj(s)[1],
    railingName:  railObj(s).name,
  }

  return (
    <section id="config" style={{ position: 'relative', padding: 'clamp(56px,8vw,112px) clamp(16px,4vw,56px)', overflow: 'hidden', borderBottom: '1px solid #2a2218' }}>
      <div style={{ position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)', width: '120%', height: 520, background: 'radial-gradient(55% 60% at 50% 0%, rgba(232,99,46,.18), transparent 70%)', animation: 'glowpulse 6s ease-in-out infinite', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 'clamp(28px,4vw,46px)' }}>
          <div style={{ maxWidth: 760 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '.14em', color: ACCENT, marginBottom: 16 }}>
              // CONFIGURATEUR 3D — TEMPS RÉEL
            </div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 'clamp(34px,5.4vw,72px)', lineHeight: .95, letterSpacing: '-.025em', margin: 0 }}>
              Dessine ton patio. <span style={{ color: ACCENT }}>Vois le prix bouger.</span>
            </h2>
          </div>
          <p style={{ maxWidth: '36ch', color: '#b3a896', fontSize: 'clamp(15px,1.7vw,18px)', lineHeight: 1.55, margin: 0 }}>
            Ajuste les dimensions, le matériau et les rampes — la maquette 3D et l'estimation se mettent à jour à chaque geste. Aucun courriel requis.
          </p>
        </div>

        {/* Calculator widget */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(14px,2vw,24px)', background: '#1a160f', border: '1px solid #2a2218', borderRadius: 22, padding: 'clamp(14px,2.2vw,24px)', boxShadow: '0 40px 120px -50px rgba(232,99,46,.3)' }}>

          {/* 3D Preview */}
          <div style={{ flex: '1.1 1 380px', minWidth: 300, display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', flex: 1, minHeight: 440, borderRadius: 18, overflow: 'hidden', background: 'radial-gradient(120% 90% at 50% 16%, #2c2418 0%, #14100a 78%)', border: '1px solid #2a2218' }}>
              <Scene3D s={s} onMouseDown={startDrag} onTouchStart={startDrag} />
              <div style={{ position: 'absolute', top: 15, left: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '.1em', color: '#7d735f' }}>APERÇU 3D</div>
              <div style={{ position: 'absolute', top: 15, right: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '.06em', color: ACCENT }}>{s.w}×{s.l}×{s.h} pi</div>
              <div style={{ position: 'absolute', bottom: 13, left: '50%', transform: 'translateX(-50%)', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#7d735f', display: 'flex', gap: 7, alignItems: 'center' }}>
                <span>⟲</span><span>GLISSE POUR PIVOTER EN 3D</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ flex: '1 1 300px', minWidth: 280 }}>
            <SliderRow label="Largeur"      value={s.w}     min={6}  max={40} step={1}   display={v => v + ' pi'}              onChange={v => set({ w: v })} />
            <SliderRow label="Longueur"     value={s.l}     min={6}  max={40} step={1}   display={v => v + ' pi'}              onChange={v => set({ l: v })} />
            <SliderRow label="Hauteur du sol" value={s.h}   min={0}  max={12} step={0.5} display={v => v + ' pi'}              onChange={v => set({ h: v })} />
            <SegGroup  label="Matériau"     opts={MATERIALS} current={s.material} onPick={pickMaterial} />
            <SwatchRow s={s} onPick={c => set({ color: c })} />
            <SegGroup  label="Rampe"        opts={RAILINGS} current={s.railing}  onPick={v => set({ railing: v })} />
            <SliderRow label="Marches"      value={s.steps}  min={0} max={12} step={1} display={v => v === 0 ? 'aucune' : v}  onChange={v => set({ steps: v })} />
            <SliderRow label="Panneaux intimité" value={s.panels} min={0} max={8} step={1} display={v => v === 0 ? 'aucun' : v} onChange={v => set({ panels: v })} />
            <ToggleRow label="Éclairage DEL intégré"            on={s.lighting} onToggle={() => set({ lighting: !s.lighting })} />
            <ToggleRow label="Jupe de patio (fermer le dessous)" on={s.skirt}   onToggle={() => set({ skirt: !s.skirt })} />
            <ToggleRow label="Retirer l'ancien patio"           on={s.removal} onToggle={() => set({ removal: !s.removal })} />
          </div>

          {/* Summary */}
          <div style={{ flex: '1 1 100%', background: '#16120c', border: '1px solid #2a2218', borderRadius: 18, padding: 'clamp(18px,2.6vw,30px)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 26, alignItems: 'center' }}>
              <div>
                {lineItems.map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 13.5, borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                    <span style={{ color: '#9a8f7d' }}>{label}</span>
                    <span style={{ color: '#e0d6c4', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>{fmt(val)}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0 0', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#7d735f' }}>
                  <span>{p.minApplied ? 'CHARGE MINIMALE' : 'SOUS-TOTAL'}</span><span>{fmt(p.sub)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#7d735f' }}>
                  <span>TAXES TPS+TVQ</span><span>{fmt(p.tax)}</span>
                </div>
              </div>

              <div style={{ textAlign: 'center', background: 'radial-gradient(130% 130% at 50% 0%, rgba(232,99,46,.16), transparent)', borderRadius: 14, padding: 22, border: '1px solid #2a2218' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '.12em', color: ACCENT }}>ESTIMATION · TOUT INCLUS</div>
                <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(28px,4.6vw,44px)', fontWeight: 800, color: '#ece3d3', margin: '10px 0 3px', lineHeight: 1, letterSpacing: '-.02em' }}>
                  {fmt(p.low)} – {fmt(p.high)}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#7d735f', marginBottom: 16 }}>TAXES INCLUSES · VALIDE 30 JOURS</div>
                <button onClick={() => setShowModal(true)} style={{
                  background: ACCENT, color: '#13100b', border: 'none',
                  padding: '15px 24px', borderRadius: 10,
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, letterSpacing: '.03em',
                  cursor: 'pointer', width: '100%',
                }}>RECEVOIR CETTE SOUMISSION →</button>
                <div style={{ fontSize: 12, color: '#6e6450', marginTop: 10, lineHeight: 1.45 }}>Estimation indicative, validée ensuite par un conseiller.</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, letterSpacing: '.04em', color: '#7d735f', marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: '8px 22px' }}>
          <span>↳ TARIFS RIVE-NORD 2026, TOUT INCLUS</span><span>·</span><span>VALIDÉ PAR UN CONSEILLER</span><span>·</span><span>SOUMISSION VALIDE 30 JOURS</span>
        </div>
      </div>

      {showModal && <QuoteModal quote={p} lineItems={lineItems} config={config} onClose={() => setShowModal(false)} />}
    </section>
  )
}
