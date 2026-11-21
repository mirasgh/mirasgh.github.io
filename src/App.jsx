import { useCallback, useEffect, useState } from 'react'
import { SquareTerminal } from 'lucide-react'
import { LangContext } from './i18n.jsx'
import { nav, ui } from './data/content.js'
import { Sidebar, TopBar } from './components/Chrome.jsx'
import Hero from './components/Hero.jsx'
import Projects from './components/Projects.jsx'
import ProjectModal from './components/ProjectModal.jsx'
import { Contact, Education, Experience, Footer, Leadership, Skills } from './components/Sections.jsx'
import TerminalMode from './components/TerminalMode.jsx'

const load = (k, d) => {
  try {
    return localStorage.getItem(k) || d
  } catch {
    return d
  }
}
const save = (k, v) => {
  try {
    localStorage.setItem(k, v)
  } catch {
    /* storage unavailable */
  }
}

export default function App() {
  const [lang, setLang] = useState(() => load('lang', navigator.language?.startsWith('fr') ? 'fr' : 'en'))
  const [theme, setTheme] = useState(() => load('theme', 'dark'))
  const [terminal, setTerminal] = useState(false)
  const [menu, setMenu] = useState(false)
  const [active, setActive] = useState('root')
  const [openId, setOpenId] = useState(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    save('theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = lang
    save('lang', lang)
  }, [lang])

  // Highlight the section currently in view
  useEffect(() => {
    if (terminal) return
    let raf = 0
    const update = () => {
      raf = 0
      const line = window.innerHeight * 0.4
      let current = nav[0].id
      for (const n of nav) {
        const el = document.getElementById(n.id)
        if (el && el.getBoundingClientRect().top <= line) current = n.id
      }
      // at the very bottom, the last section wins
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = nav[nav.length - 1].id
      setActive(current)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [terminal])

  // ` toggles terminal mode (when not typing in a field)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== '`') return
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      e.preventDefault()
      setTerminal((t) => !t)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])
  const closeModal = useCallback(() => setOpenId(null), [])

  return (
    <LangContext.Provider value={lang}>
      {terminal ? (
        <TerminalMode onExit={() => setTerminal(false)} setLang={setLang} onTheme={toggleTheme} />
      ) : (
        <div className="grid-bg min-h-screen">
          <Sidebar active={active} open={menu} onClose={() => setMenu(false)} onTerminal={() => setTerminal(true)} />
          <div className="lg:pl-72">
            <TopBar
              active={active}
              theme={theme}
              onTheme={toggleTheme}
              onLang={() => setLang((l) => (l === 'en' ? 'fr' : 'en'))}
              onMenu={() => setMenu(true)}
            />
            <main className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-12">
              <Hero />
              <Projects onOpen={setOpenId} />
              <Skills onOpen={setOpenId} />
              <Experience />
              <Leadership />
              <Education />
              <Contact />
              <Footer />
            </main>
          </div>

          <button
            onClick={() => setTerminal(true)}
            title={`${lang === 'fr' ? ui.openTerminal.fr : ui.openTerminal.en} (\`)`}
            aria-label={lang === 'fr' ? ui.openTerminal.fr : ui.openTerminal.en}
            className="fixed bottom-6 right-6 z-30 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-onaccent shadow-[0_0_30px_rgb(var(--accent)/.45)] transition-transform hover:scale-110"
          >
            <SquareTerminal size={28} />
          </button>

          <ProjectModal id={openId} onClose={closeModal} />
        </div>
      )}
    </LangContext.Provider>
  )
}
