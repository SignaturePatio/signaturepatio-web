export default function Footer() {
  return (
    <footer style={{
      padding: '38px clamp(18px,4vw,56px)',
      borderTop: '1px solid #2a2218',
      display: 'flex', flexWrap: 'wrap', gap: 16,
      justifyContent: 'space-between', alignItems: 'center',
      fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#7d735f',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#e8632e', display: 'inline-block' }} />
        <span style={{ color: '#ece3d3', fontWeight: 700 }}>SIGNATURE PATIO</span>
      </div>
      <span>© 2026 — REPENTIGNY &amp; LA COURONNE NORD · TOUS DROITS RÉSERVÉS</span>
    </footer>
  )
}
