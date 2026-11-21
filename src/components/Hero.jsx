import { useEffect, useState } from 'react'
import { ArrowRight, Download, MapPin } from 'lucide-react'
import { useT } from '../i18n.jsx'
import { profile, stats, ui } from '../data/content.js'
import { Led, Reveal } from './ui.jsx'
import RobotArm from './RobotArm.jsx'

function Typed({ text, speed = 28 }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(0)
    const id = setInterval(() => setN((v) => (v >= text.length ? (clearInterval(id), v) : v + 1)), speed)
    return () => clearInterval(id)
  }, [text, speed])
  return (
    <>
      {text.slice(0, n)}
      <span className="ml-0.5 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] animate-blink bg-accent" />
    </>
  )
}

export default function Hero() {
  const { tr, lang } = useT()
  return (
    <section id="root" className="scroll-mt-20 pb-16 pt-8 sm:pt-12">
      <div className="grid grid-cols-1 items-center gap-10 xl:grid-cols-[1.05fr_1fr]">
        <div>
          <Reveal>
            <p className="mb-6 text-sm text-muted">
              <span className="text-accent">{profile.handle}@{profile.host}</span>:~$ whoami
            </p>
          </Reveal>

          <Reveal delay={80} className="border-l-4 border-accent pl-5 sm:pl-7">
            <div className="mb-6 flex flex-wrap items-center gap-5 sm:gap-6">
              <div className="relative h-32 w-32 shrink-0 overflow-hidden border-2 border-accent shadow-[0_0_24px_rgb(var(--accent)/.25)] sm:h-44 sm:w-44">
                <img src={profile.photo} alt={profile.name} className="h-full w-full object-cover object-top" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-accent/20 to-transparent animate-scan" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">{profile.name}</h1>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                  <MapPin size={12} /> {tr(profile.location)}
                </p>
              </div>
            </div>

            <p className="mb-2 text-lg text-accent sm:text-xl">{tr(profile.title)}</p>
            <p className="min-h-[3.5em] text-base leading-relaxed text-fg/90 sm:text-lg">
              <Typed key={lang} text={tr(profile.tagline)} />
            </p>
          </Reveal>

          <Reveal delay={160} className="mt-6 inline-flex items-center gap-2 border border-amber/50 bg-amber/10 px-3 py-1.5 text-xs text-amber">
            <Led color="amber" /> [ {tr(ui.status)}: {tr(profile.status)} ]
          </Reveal>

          <Reveal delay={220} className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" className="group flex items-center gap-2 bg-accent px-5 py-3 text-sm font-bold text-onaccent hover:brightness-110">
              {tr(ui.viewProjects)} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a href={tr(profile.cv)} download className="flex items-center gap-2 border border-accent px-5 py-3 text-sm text-accent hover:bg-accent/10">
              <Download size={16} /> CV.PDF
            </a>
            <a href="#contact" className="flex items-center gap-2 border border-line px-5 py-3 text-sm hover:border-fg">
              {tr(ui.contactMe)}
            </a>
          </Reveal>

          <Reveal delay={300} className="mt-10 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.value} className="bg-panel px-4 py-3">
                <div className="text-xl font-bold text-accent">{s.value}</div>
                <div className="text-[11px] leading-tight text-muted">{tr(s.label)}</div>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal delay={200}>
          <RobotArm />
        </Reveal>
      </div>

      <Reveal className="mt-14 border border-line bg-panel p-5 sm:p-7">
        <p className="mb-3 text-sm text-muted">
          <span className="text-accent">$</span> cat about.md
        </p>
        <p className="leading-relaxed">{tr(profile.about)}</p>
        <p className="mt-4 leading-relaxed text-amber">{tr(profile.seeking)}</p>
      </Reveal>
    </section>
  )
}
