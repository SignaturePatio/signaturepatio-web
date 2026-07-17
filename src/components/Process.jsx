const STEPS = [
  { num: '01', title: 'Estimation',   desc: 'Un prix transparent en ligne, validé ensuite avec un conseiller.', accent: false },
  { num: '02', title: 'Conception',   desc: 'Plans, choix des matériaux et permis — on s\'occupe de tout.',     accent: false },
  { num: '03', title: 'Construction', desc: 'Une équipe dédiée, des délais tenus, un chantier propre.',         accent: false },
  { num: '04', title: 'Profite',      desc: 'On range tout. T\'as juste à inviter les voisins.',                accent: true  },
]

export default function Process() {
  return (
    <section style={{ padding: 'clamp(56px,8vw,112px) clamp(18px,4vw,56px)', background: '#f2ede3', color: '#1a1610' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 'clamp(30px,4.6vw,56px)', lineHeight: .98, letterSpacing: '-.02em', margin: '0 0 48px', maxWidth: '18ch' }}>
          Du croquis au premier café sur la terrasse.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 1, background: '#e4dccb', border: '1px solid #e4dccb', borderRadius: 18, overflow: 'hidden' }}>
          {STEPS.map(({ num, title, desc, accent }) => (
            <div key={num} style={{ background: '#f2ede3', padding: '28px 22px' }}>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 40, color: accent ? '#e8632e' : '#e0d7c5', lineHeight: 1 }}>{num}</div>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 21, margin: '14px 0 8px' }}>{title}</h3>
              <p style={{ margin: 0, color: '#6b6253', fontSize: 14.5, lineHeight: 1.55 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
