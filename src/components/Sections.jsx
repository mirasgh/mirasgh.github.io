import { useState } from 'react'
import { Briefcase, Check, Copy, Download, Linkedin, Mail, MapPin, Phone, Users } from 'lucide-react'
import { useT } from '../i18n.jsx'
import { education, experience, languages, leadership, profile, projects, skillAliases, skillGroups, ui } from '../data/content.js'
import { Led, Reveal, SectionTitle, Tag } from './ui.jsx'

export function Skills({ onOpen }) {
  const { tr } = useT()
  const [sel, setSel] = useState(null)
  const used = sel ? (skillAliases[sel] || []).map((id) => projects.find((p) => p.id === id)).filter(Boolean) : []

  return (
    <section id="skills" className="scroll-mt-20 py-16">
      <SectionTitle index="03">{tr({ en: 'SKILLS', fr: 'COMPÉTENCES' })}</SectionTitle>
      <Reveal className="mb-6 text-sm text-muted">{tr(ui.skillHint)}</Reveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {skillGroups.map((g, i) => (
          <Reveal key={g.id} delay={(i % 3) * 60} className="brackets border border-line bg-panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wide">{tr(g.title)}</h3>
              <span className="flex gap-1">
                <Led />
                <Led on={g.items.includes(sel)} color="amber" />
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((s) => (
                <Tag key={s} active={sel === s} onClick={() => setSel(sel === s ? null : s)}>
                  {s}
                </Tag>
              ))}
            </div>
          </Reveal>
        ))}
      </div>

      <div className={`mt-4 overflow-hidden border border-line bg-panel2 transition-all ${sel ? 'max-h-96 p-5 opacity-100' : 'max-h-0 border-transparent p-0 opacity-0'}`} aria-live="polite">
        {sel && (
          <>
            <p className="mb-3 text-sm">
              <span className="text-accent">$</span> grep -r "{sel}" ~/projects <span className="text-muted">→ {tr(ui.usedIn)}</span>
            </p>
            {used.length ? (
              <div className="flex flex-wrap gap-2">
                {used.map((p) => (
                  <button key={p.id} onClick={() => onOpen(p.id)} className="border border-accent/50 px-3 py-1.5 text-left text-sm text-accent hover:bg-accent/10">
                    ./{p.id} <span className="text-muted">· {tr(p.title)}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">{tr(ui.noProject)}</p>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export function Experience() {
  const { tr } = useT()
  return (
    <section id="experience" className="scroll-mt-20 py-16">
      <SectionTitle index="04">{tr({ en: 'EXPERIENCE', fr: 'EXPÉRIENCE' })}</SectionTitle>
      <div className="relative border-l-2 border-line pl-6 sm:pl-8">
        {experience.map((e, i) => (
          <Reveal key={i} className="relative mb-6">
            <span className="absolute -left-[33px] top-6 flex h-4 w-4 items-center justify-center border-2 border-accent bg-bg sm:-left-[41px]">
              <span className="h-1.5 w-1.5 bg-accent" />
            </span>
            <div className="brackets border border-line bg-panel p-5 sm:p-6">
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold">
                    <Briefcase size={18} className="text-accent" /> {tr(e.role)}
                  </h3>
                  <p className="text-accent">{e.org}</p>
                  <p className="text-xs text-muted">{tr(e.place)}</p>
                </div>
                <span className="bg-accent/15 px-3 py-1 text-sm text-accent">{tr(e.date)}</span>
              </div>
              <ul className="space-y-1.5">
                {tr(e.points).map((pt, j) => (
                  <li key={j} className="flex gap-2 text-sm leading-relaxed text-muted">
                    <span className="text-accent">-</span> {pt}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function Leadership() {
  const { tr } = useT()
  return (
    <section id="leadership" className="scroll-mt-20 py-16">
      <SectionTitle index="05">LEADERSHIP</SectionTitle>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {leadership.map((l, i) => (
          <Reveal key={i} delay={i * 80} className="brackets border border-line bg-panel p-5 sm:p-6">
            <div className="mb-3 flex items-start justify-between gap-3">
              <Users className="text-accent" size={22} />
              <span className="border border-line px-2 py-0.5 text-xs text-muted">{tr(l.date)}</span>
            </div>
            <h3 className="text-lg font-bold">{tr(l.role)}</h3>
            <p className="mb-2 text-accent">{l.org}</p>
            <p className="text-sm leading-relaxed text-muted">{tr(l.desc)}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function Education() {
  const { tr } = useT()
  return (
    <section id="education" className="scroll-mt-20 py-16">
      <SectionTitle index="06">{tr({ en: 'ACADEMIC_RECORDS', fr: 'PARCOURS_ACADÉMIQUE' })}</SectionTitle>
      <div className="space-y-4">
        {education.map((e, i) => (
          <Reveal key={i} delay={i * 80} className="flex flex-col gap-3 border border-line bg-panel p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h3 className="text-lg font-bold sm:text-xl">{tr(e.school)}</h3>
              <p className="text-accent">{tr(e.degree)}</p>
            </div>
            <div className="flex items-center gap-2">
              {e.current && <span className="text-[10px] text-amber">{tr(ui.current)}</span>}
              <span className={`shrink-0 px-4 py-2 text-sm ${e.current ? 'bg-accent text-onaccent' : 'border border-line text-muted'}`}>{tr(e.date)}</span>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10">
        <h3 className="mb-4 text-sm text-accent"># {tr(ui.languages)}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {languages.map((l) => (
            <div key={l.name.en} className="border border-line bg-panel p-4">
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-bold">{tr(l.name)}</span>
                <span className="text-muted">{tr(l.level)}</span>
              </div>
              <div className="flex gap-1" aria-hidden>
                {Array.from({ length: 10 }).map((_, k) => (
                  <span key={k} className={`h-2 flex-1 ${k < Math.round(l.value / 10) ? 'bg-accent' : 'bg-line'}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

export function Contact() {
  const { tr } = useT()
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }
  const rows = [
    { icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone, label: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}` },
    { icon: Linkedin, label: profile.linkedinLabel, href: profile.linkedin },
    { icon: MapPin, label: tr(profile.location) },
  ]
  return (
    <section id="contact" className="scroll-mt-20 py-16">
      <SectionTitle index="07">CONTACT</SectionTitle>
      <Reveal className="brackets grid gap-8 border border-line bg-panel p-6 sm:p-8 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 text-2xl font-bold">{tr(ui.contactTitle)}</h3>
          <p className="mb-6 leading-relaxed text-muted">{tr(ui.contactText)}</p>
          <div className="flex flex-wrap gap-3">
            <a href={`mailto:${profile.email}`} className="flex items-center gap-2 bg-accent px-5 py-3 text-sm font-bold text-onaccent hover:brightness-110">
              <Mail size={16} /> EMAIL
            </a>
            <button onClick={copy} className="flex items-center gap-2 border border-line px-4 py-3 text-sm hover:border-accent hover:text-accent" aria-label={tr(ui.copyEmail)}>
              {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? tr(ui.copied) : tr(ui.copyEmail)}
            </button>
            <a href={tr(profile.cv)} download className="flex items-center gap-2 border border-line px-4 py-3 text-sm hover:border-accent hover:text-accent">
              <Download size={16} /> CV.PDF
            </a>
          </div>
        </div>
        <ul className="space-y-1 self-center">
          {rows.map(({ icon: Icon, label, href }) => (
            <li key={label}>
              {href ? (
                <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="flex items-center gap-3 break-all border border-transparent px-3 py-2.5 text-sm hover:border-line hover:text-accent">
                  <Icon size={18} className="shrink-0 text-accent" /> {label}
                </a>
              ) : (
                <span className="flex items-center gap-3 px-3 py-2.5 text-sm">
                  <Icon size={18} className="shrink-0 text-accent" /> {label}
                </span>
              )}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}

export function Footer() {
  const { tr } = useT()
  return (
    <footer className="mt-8 flex flex-col gap-4 border-t border-line pb-28 pt-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
      <span>
        [SYSTEM_READY] © {new Date().getFullYear()} ENG_MIRAS GHRISSI. {tr(ui.rights)}.
      </span>
      <div className="flex gap-5">
        <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 hover:text-accent">
          <Mail size={14} /> EMAIL
        </a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-accent">
          <Linkedin size={14} /> LINKEDIN
        </a>
      </div>
    </footer>
  )
}
