import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import Materiaux from './components/Materiaux.jsx'
import Configurateur from './components/Configurateur.jsx'
import Realisations from './components/Realisations.jsx'
import Process from './components/Process.jsx'
import Testimonials from './components/Testimonials.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <div style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif", color: '#ece3d3', background: '#13100b', overflowX: 'hidden' }}>
      <Nav />
      <Hero />
      <Marquee />
      <Materiaux />
      <Configurateur />
      <Realisations />
      <Process />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  )
}
