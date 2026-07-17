const ITEMS = ['COMPOSITE', 'CÈDRE', 'ALUMINIUM', 'FIBRE DE VERRE', 'PERGOLAS', 'RAMPES EN VERRE']

function MarqueeTrack() {
  return (
    <>
      {ITEMS.map((item, i) => (
        <span key={i} style={{ display: 'contents' }}>
          <span>{item}</span>
          <span style={{ color: '#e8632e' }}>✦</span>
        </span>
      ))}
    </>
  )
}

export default function Marquee() {
  return (
    <div style={{ borderTop: '1px solid #2a2218', borderBottom: '1px solid #2a2218', padding: '16px 0', overflow: 'hidden', background: '#161208' }}>
      <div className="marq" style={{
        display: 'flex', gap: 42, width: 'max-content',
        fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 26,
        color: '#3a3024', whiteSpace: 'nowrap',
      }}>
        <MarqueeTrack />
        <MarqueeTrack />
      </div>
    </div>
  )
}
