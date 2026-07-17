const MATS = [
  { price: '~72$/pi²', name: 'Composite',      desc: 'Zéro entretien, 25 ans de garantie. Le best-seller.',          stripe1: '#8c7155', stripe2: '#7c624a' },
  { price: '~52$/pi²', name: 'Cèdre',          desc: 'Beauté naturelle, résistance innée à la pourriture.',          stripe1: '#c08a4f', stripe2: '#ad7a3f' },
  { price: '~38$/pi²', name: 'Bois traité',    desc: "L'option abordable et robuste, été après été.",               stripe1: '#b89a6a', stripe2: '#a98c5e' },
  { price: '~90$/pi²', name: 'Aluminium',      desc: 'Léger, ignifuge, parfait pour les toits-terrasses.',          stripe1: '#52555a', stripe2: '#46484c' },
  { price: '~98$/pi²', name: 'Fibre de verre', desc: "Surface 100% étanche, idéale au-dessus d'un espace vécu.",   stripe1: '#bfae90', stripe2: '#b0a082' },
]

export default function Materiaux() {
  return (
    <section id="materiaux" style={{ padding: 'clamp(56px,8vw,112px) clamp(18px,4vw,56px)', background: '#f2ede3', color: '#1a1610' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 46 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '.14em', color: '#c2562a', marginBottom: 14 }}>
              // 05 MATÉRIAUX
            </div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 'clamp(32px,5vw,62px)', lineHeight: .98, letterSpacing: '-.02em', margin: 0, maxWidth: '16ch' }}>
              Le bon matériau pour ta cour.
            </h2>
          </div>
          <p style={{ maxWidth: '34ch', color: '#6b6253', fontSize: 16, lineHeight: 1.6, margin: 0 }}>
            Chaque essence a son caractère. On te guide vers le choix qui tient tête à l'hiver québécois.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
          {MATS.map(({ price, name, desc, stripe1, stripe2 }) => (
            <div key={name} style={{ background: '#fff', border: '1px solid #e4dccb', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ height: 130, background: `repeating-linear-gradient(90deg,${stripe1} 0 15px,${stripe2} 15px 17px)` }} />
              <div style={{ padding: 18 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#c2562a' }}>{price}</div>
                <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 20, margin: '5px 0 6px' }}>{name}</h3>
                <p style={{ margin: 0, color: '#6b6253', fontSize: 13.5, lineHeight: 1.5 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
