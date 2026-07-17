export default function Hero() {
  return (
    <section style={{
      position: 'relative', minHeight: '86vh',
      display: 'flex', alignItems: 'center',
      padding: 'clamp(44px,7vw,96px) clamp(16px,4vw,56px)',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -160, right: '-8%', width: '72%', height: 640,
        background: 'radial-gradient(55% 60% at 60% 0%, rgba(232,99,46,.20), transparent 70%)',
        animation: 'glowpulse 6s ease-in-out infinite', pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative', maxWidth: 1240, margin: '0 auto', width: '100%',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
        gap: 'clamp(28px,4vw,56px)', alignItems: 'center',
      }}>
        <div style={{ animation: 'fadeUp .6s ease both' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '.14em', color: '#e8632e', marginBottom: 20 }}>
            // CONCEPTION &amp; CONSTRUCTION DE PATIOS · REPENTIGNY QC
          </div>
          <h1 style={{
            fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800,
            fontSize: 'clamp(40px,6.4vw,84px)', lineHeight: .94,
            letterSpacing: '-.025em', margin: 0,
          }}>
            Votre patio sur mesure,<br />
            <span style={{ color: '#e8632e' }}>conçu et bâti pour durer.</span>
          </h1>
          <p style={{ maxWidth: '46ch', color: '#b3a896', fontSize: 'clamp(16px,1.8vw,19px)', lineHeight: 1.6, margin: '24px 0 0' }}>
            Signature Patio conçoit et construit des terrasses sur mesure — composite, cèdre, aluminium — sur la Rive-Nord. Délais tenus, finition soignée, chantier propre.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 13, marginTop: 34 }}>
            <a href="#config" style={{
              background: '#e8632e', color: '#13100b',
              padding: '15px 26px', borderRadius: 10,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700,
              letterSpacing: '.02em', textDecoration: 'none',
            }}>ESTIMER MON PATIO →</a>
            <a href="#contact" style={{
              background: 'transparent', border: '1px solid #3a3024', color: '#ece3d3',
              padding: '15px 26px', borderRadius: 10,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700,
              letterSpacing: '.02em', textDecoration: 'none',
            }}>SOUMISSION GRATUITE</a>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 34, marginTop: 44 }}>
            {[
              { val: '+200', label: 'PATIOS LIVRÉS' },
              { val: '25 ANS', label: 'GARANTIE COMPOSITE' },
              { val: '4,9', star: true, label: 'SATISFACTION CLIENT' },
            ].map(({ val, star, label }) => (
              <div key={label}>
                <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 34, letterSpacing: '-.02em', display: 'flex', alignItems: 'center', gap: 5 }}>
                  {val}
                  {star && <span style={{ fontSize: 22, lineHeight: 1, color: '#e8632e', position: 'relative', top: 1 }}>★</span>}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#7d735f', letterSpacing: '.04em', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          position: 'relative', aspectRatio: '4/5', borderRadius: 20, overflow: 'hidden',
          border: '1px solid #2a2218', animation: 'fadeUp .7s .1s ease both', minHeight: 380,
        }}>
          <img
            loading="lazy"
            src="https://images.unsplash.com/photo-1714381633320-e5c3fd0f14db?auto=format&fit=crop&w=900&h=1120&q=72"
            alt="Patio Signature · Repentigny"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: 22, background: 'linear-gradient(180deg,transparent 45%,rgba(19,16,11,.6))' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '.1em', color: '#e8d9c6' }}>
              PATIO SIGNATURE · REPENTIGNY
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
