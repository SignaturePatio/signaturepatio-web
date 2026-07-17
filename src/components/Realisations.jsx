import { useState, useEffect } from 'react'

const PHOTOS = [
  { src: 'https://images.unsplash.com/photo-1716904519810-349244919824?auto=format&fit=crop&w=1100&h=560&q=72', label: 'PATIO MULTI-PALIERS', wide: true },
  { src: 'https://images.unsplash.com/photo-1574120583586-de8847ae992c?auto=format&fit=crop&w=640&h=640&q=72',  label: 'RAMPE VERRE' },
  { src: 'https://images.unsplash.com/photo-1674672670977-bcf517fc2376?auto=format&fit=crop&w=640&h=640&q=72',  label: 'PERGOLA' },
  { src: 'https://images.unsplash.com/photo-1613544723412-b331bda01e87?auto=format&fit=crop&w=640&h=640&q=72',  label: 'CONTOUR PISCINE' },
  { src: 'https://images.unsplash.com/photo-1613544723366-448490ac466b?auto=format&fit=crop&w=640&h=640&q=72',  label: 'PANNEAUX INTIMITÉ' },
]

function Lightbox({ photo, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(13,10,7,.92)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(16px,4vw,48px)',
        animation: 'fadeUp .18s ease both',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ position: 'relative', maxWidth: 1100, width: '100%' }}
      >
        <img
          src={photo.src.replace(/w=\d+/, 'w=1800').replace(/h=\d+/, 'h=1200').replace('q=72', 'q=88')}
          alt={photo.label}
          style={{ width: '100%', maxHeight: '82vh', objectFit: 'contain', borderRadius: 14, display: 'block' }}
        />
        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '.12em', color: '#9a8f7d' }}>
            {photo.label}
          </span>
          <button
            onClick={onClose}
            style={{ background: 'none', border: '1px solid #3a3024', color: '#b3a896', padding: '7px 14px', borderRadius: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, cursor: 'pointer', letterSpacing: '.06em' }}
          >
            FERMER ✕
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Realisations() {
  const [active, setActive] = useState(null)

  return (
    <section id="realisations" style={{ padding: 'clamp(56px,8vw,112px) clamp(18px,4vw,56px)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '.14em', color: '#e8632e', marginBottom: 14 }}>
          // 06 RÉALISATIONS
        </div>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 'clamp(32px,5vw,62px)', lineHeight: .98, letterSpacing: '-.02em', margin: '0 0 38px', maxWidth: '15ch' }}>
          Des projets qu'on est fiers de signer.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 12 }}>
          {PHOTOS.map(photo => (
            <div
              key={photo.label}
              onClick={() => setActive(photo)}
              style={{
                position: 'relative',
                gridColumn: photo.wide ? 'span 2' : undefined,
                aspectRatio: photo.wide ? '2/1' : '1/1',
                borderRadius: 16, overflow: 'hidden', border: '1px solid #2a2218',
                cursor: 'zoom-in',
              }}
            >
              <img loading="lazy" src={photo.src} alt={photo.label} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 55%,rgba(19,16,11,.7))', display: 'flex', alignItems: 'flex-end', padding: photo.wide ? 18 : 16 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '.1em', color: '#e8d9c6' }}>{photo.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {active && <Lightbox photo={active} onClose={() => setActive(null)} />}
    </section>
  )
}
