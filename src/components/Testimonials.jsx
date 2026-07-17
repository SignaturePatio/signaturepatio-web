const REVIEWS = [
  { text: '« Travail impeccable, sans surprises et dans les délais. Je recommande. »', author: 'DENIZ — REPENTIGNY' },
  { text: '« Très satisfaits. Belle finition, équipe courtoise et pro. »',              author: 'ALEX — MASCOUCHE' },
  { text: '« Bon rapport qualité-prix, toujours dispo pour nos questions. »',           author: 'ERIC — TERREBONNE' },
]

function Card({ text, author }) {
  return (
    <div style={{ width: 360, background: '#1a160f', border: '1px solid #2a2218', borderRadius: 16, padding: 26, flexShrink: 0 }}>
      <div style={{ color: '#e8632e', fontSize: 15, marginBottom: 12 }}>★★★★★</div>
      <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 600, fontSize: 18, lineHeight: 1.4, margin: '0 0 16px', color: '#ece3d3' }}>
        {text}
      </p>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#9a8f7d' }}>{author}</span>
    </div>
  )
}

export default function Testimonials() {
  return (
    <section style={{ padding: 'clamp(48px,7vw,90px) 0', overflow: 'hidden' }}>
      <div className="marq" style={{ display: 'flex', gap: 16, width: 'max-content' }}>
        {[...REVIEWS, ...REVIEWS].map((r, i) => (
          <Card key={i} {...r} />
        ))}
      </div>
    </section>
  )
}
