import { useState, useRef } from 'react'

// EmailJS — free tier, browser-only, no backend needed.
// Setup: https://www.emailjs.com
//   1. Create account → Add Email Service (Gmail) → note SERVICE_ID
//   2. Create Email Template with vars: {{prenom}}, {{nom}}, {{email}}, {{telephone}}, {{projet}}
//      Set "To Email" to signaturepatiorenovation@gmail.com → note TEMPLATE_ID
//   3. Go to Account → Public Key → note PUBLIC_KEY
// Then set the three constants below.
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY'

function Field({ label, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '.06em', color: '#9a8f7d' }}>
      {label}
      {children}
    </label>
  )
}

const inputStyle = {
  padding: '12px 13px',
  border: '1px solid #322a1e',
  borderRadius: 9,
  fontSize: 15,
  fontFamily: "'Hanken Grotesk', sans-serif",
  background: '#13100b',
  color: '#ece3d3',
  outline: 'none',
}

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const formRef = useRef(null)

  function handleFocus(e) { e.target.style.borderColor = '#e8632e' }
  function handleBlur(e)  { e.target.style.borderColor = '#322a1e' }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')

    const data = new FormData(formRef.current)
    const params = {
      prenom:    data.get('prenom'),
      nom:       data.get('nom'),
      email:     data.get('email'),
      telephone: data.get('telephone'),
      projet:    data.get('projet'),
    }

    try {
      const { default: emailjs } = await import('@emailjs/browser')
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params, { publicKey: EMAILJS_PUBLIC_KEY })
      setStatus('sent')
    } catch (err) {
      console.error('EmailJS error:', err)
      setStatus('error')
    }
  }

  return (
    <section id="contact" style={{ padding: 'clamp(56px,8vw,112px) clamp(18px,4vw,56px)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 48, alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '.14em', color: '#e8632e', marginBottom: 16 }}>
            // SOUMISSION GRATUITE
          </div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 'clamp(32px,5vw,60px)', lineHeight: .96, letterSpacing: '-.02em', margin: '0 0 20px' }}>
            À une étape de ton nouveau patio.
          </h2>
          <p style={{ color: '#b3a896', fontSize: 17, lineHeight: 1.6, margin: '0 0 30px', maxWidth: '40ch' }}>
            Laisse-nous tes coordonnées — un conseiller te rappelle dans les 24 h, sans engagement.
          </p>
          <a href="tel:5149242233" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 'clamp(26px,3.5vw,38px)', color: '#ece3d3', textDecoration: 'none', letterSpacing: '-.01em' }}>
            514 924-2233
          </a>
        </div>

        <form
          ref={formRef}
          style={{ background: '#1a160f', border: '1px solid #2a2218', borderRadius: 20, padding: 'clamp(22px,3vw,34px)', display: 'flex', flexDirection: 'column', gap: 13 }}
          onSubmit={handleSubmit}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
            <Field label="PRÉNOM">
              <input name="prenom" type="text" required style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </Field>
            <Field label="NOM">
              <input name="nom" type="text" required style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </Field>
          </div>
          <Field label="COURRIEL">
            <input name="email" type="email" required style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
          </Field>
          <Field label="TÉLÉPHONE">
            <input name="telephone" type="tel" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
          </Field>
          <Field label="TON PROJET">
            <textarea name="projet" rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={handleFocus} onBlur={handleBlur} />
          </Field>

          {status === 'sent' && (
            <div style={{ textAlign: 'center', padding: '15px', color: '#9bd6a0', fontSize: 14.5, fontWeight: 600 }}>
              ✓ Merci ! Un conseiller te contacte sous peu.
            </div>
          )}
          {status === 'error' && (
            <div style={{ textAlign: 'center', padding: '10px', color: '#e87c6e', fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>
              Erreur d'envoi. Veuillez appeler le 514 924-2233.
            </div>
          )}
          {status !== 'sent' && (
            <button type="submit" disabled={status === 'sending'} style={{
              marginTop: 5, background: status === 'sending' ? '#7a3a1e' : '#e8632e',
              color: '#13100b', border: 'none', padding: 15, borderRadius: 10,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, letterSpacing: '.04em',
              cursor: status === 'sending' ? 'wait' : 'pointer', transition: 'background .2s',
            }}>
              {status === 'sending' ? 'ENVOI EN COURS…' : 'DEMANDER MON RAPPEL →'}
            </button>
          )}
        </form>
      </div>
    </section>
  )
}
