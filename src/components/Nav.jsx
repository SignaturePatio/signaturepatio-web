import { useState, useEffect } from 'react'

export default function Nav() {
  const [wide, setWide] = useState(window.innerWidth > 900)

  useEffect(() => {
    const handler = () => setWide(window.innerWidth > 900)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px clamp(18px,4vw,56px)',
      background: 'rgba(19,16,11,.72)', backdropFilter: 'blur(14px)',
      borderBottom: '1px solid #2a2218',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#e8632e', boxShadow: '0 0 14px #e8632e', display: 'inline-block' }} />
        <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 19, letterSpacing: '-.01em' }}>
          SIGNATURE PATIO
        </span>
      </div>

      {wide && (
        <div style={{ display: 'flex', gap: 28, alignItems: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '.02em' }}>
          <a href="#config" style={{ color: '#b3a896', textDecoration: 'none' }}>CONFIGURATEUR</a>
          <a href="#materiaux" style={{ color: '#b3a896', textDecoration: 'none' }}>MATÉRIAUX</a>
          <a href="#realisations" style={{ color: '#b3a896', textDecoration: 'none' }}>RÉALISATIONS</a>
          <a href="#contact" style={{ color: '#b3a896', textDecoration: 'none' }}>CONTACT</a>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {wide && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
            <a href="tel:5149242233" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 15, color: '#ece3d3', textDecoration: 'none', letterSpacing: '-.01em' }}>
              514 924-2233
            </a>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#7d735f', letterSpacing: '.06em' }}>
              RBQ 5876-4452-01
            </span>
          </div>
        )}
        <a href="#config" style={{
          background: '#e8632e', color: '#13100b',
          padding: '10px 18px', borderRadius: 8,
          fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700,
          textDecoration: 'none', letterSpacing: '.02em',
        }}>
          ESTIMER →
        </a>
      </div>
    </nav>
  )
}
