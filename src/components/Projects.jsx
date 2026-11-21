import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useT } from '../i18n.jsx'
import { asset, categories, projects, ui } from '../data/content.js'
import { Reveal, SectionTitle, Tag } from './ui.jsx'
import Schematic from './Schematic.jsx'

function Thumb({ p }) {
  if (p.schematic) return <Schematic kind={p.schematic} />
  return (
    <img
      src={asset(p.images[0])}
      alt=""
      loading="lazy"
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  )
}

export default function Projects({ onOpen }) {
  const { tr } = useT()
  const [cat, setCat] = useState('all')
  const list = projects.filter((p) => cat === 'all' || p.cats.includes(cat))

  return (
    <section id="projects" className="scroll-mt-20 py-16">
      <SectionTitle index="02">{tr({ en: 'PROJECTS', fr: 'PROJETS' })}</SectionTitle>

      <Reveal className="mb-8 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm text-muted">$ filter --type</span>
        {categories.map((c) => (
          <Tag key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
            {tr(c.label)}
          </Tag>
        ))}
        <span className="ml-auto text-xs text-muted">
          {list.length}/{projects.length} {tr(ui.showing)}
        </span>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {list.map((p, i) => {
          const wide = p.featured && cat === 'all' && i === 0
          return (
          <Reveal key={p.id} delay={(i % 2) * 80} className={wide ? 'md:col-span-2' : ''}>
            <button
              onClick={() => onOpen(p.id)}
              className={`brackets group flex h-full w-full flex-col border border-line bg-panel text-left transition-colors hover:border-accent/60 ${
                wide ? 'md:flex-row' : ''
              }`}
            >
              <div
                className={`relative aspect-[16/9] w-full overflow-hidden border-b border-line bg-panel2 ${
                  wide ? 'md:aspect-auto md:min-h-[320px] md:w-1/2 md:border-b-0 md:border-r' : ''
                }`}
              >
                <Thumb p={p} />
                {p.featured && (
                  <span className="absolute left-2 top-2 bg-accent px-2 py-0.5 text-[10px] font-bold text-onaccent">FEATURED</span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex items-center justify-between gap-2 text-xs text-muted">
                  <span className="min-w-0 truncate">{tr(p.context)}</span>
                  <span className="shrink-0 border border-line px-2 py-0.5">{tr(p.year)}</span>
                </div>
                <h3 className="mb-2 text-lg font-bold leading-snug group-hover:text-accent">{tr(p.title)}</h3>
                <p className="mb-4 text-sm leading-relaxed text-muted">{tr(p.summary)}</p>
                {p.metrics && (
                  <div className="mb-4 flex flex-wrap gap-x-5 gap-y-1">
                    {p.metrics.slice(0, 3).map((m, j) => (
                      <div key={j} className="text-xs">
                        <span className="text-muted">{tr(m.k)}: </span>
                        <span className="text-accent">{tr(m.v)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-auto flex flex-wrap items-end gap-1.5">
                  {p.stack.slice(0, 5).map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                  <span className="ml-auto flex items-center gap-1 text-xs text-accent">
                    {tr(ui.details)} <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </button>
          </Reveal>
          )
        })}
      </div>
    </section>
  )
}
