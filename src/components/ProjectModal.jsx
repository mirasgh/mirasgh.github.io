import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useT } from '../i18n.jsx'
import { asset, projects, ui } from '../data/content.js'
import { Tag } from './ui.jsx'
import Schematic from './Schematic.jsx'

export default function ProjectModal({ id, onClose }) {
  const { tr } = useT()
  const p = projects.find((x) => x.id === id)
  const [img, setImg] = useState(0)

  useEffect(() => {
    setImg(0)
  }, [id])

  useEffect(() => {
    if (!p) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [p, onClose])

  if (!p) return null
  const images = p.images || []

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-3 backdrop-blur-sm sm:p-8" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={tr(p.title)}
        className="brackets my-auto w-full max-w-4xl animate-fadeup border border-line bg-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <span className="flex gap-1.5">
            <span className="h-3 w-3 bg-danger" />
            <span className="h-3 w-3 bg-amber" />
            <span className="h-3 w-3 bg-accent" />
          </span>
          <span className="truncate text-sm text-muted">~/projects/{p.id}</span>
          <button onClick={onClose} className="ml-auto flex items-center gap-1 border border-line px-2 py-1 text-xs hover:border-accent hover:text-accent">
            <X size={14} /> {tr(ui.close)}
          </button>
        </div>

        <div className="bg-panel2">
          <div className="flex aspect-[16/9] max-h-[60vh] w-full items-center justify-center overflow-hidden">
            {images.length ? (
              <img src={asset(images[img])} alt={tr(p.title)} className="h-full w-full object-contain" />
            ) : (
              <Schematic kind={p.schematic} />
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto border-t border-line p-2">
              {images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setImg(i)}
                  className={`h-14 w-20 shrink-0 overflow-hidden border-2 ${i === img ? 'border-accent' : 'border-line opacity-60 hover:opacity-100'}`}
                  aria-label={`Image ${i + 1}`}
                >
                  <img src={asset(src)} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 sm:p-7">
          <div className="mb-1 text-xs text-muted">
            {tr(p.context)} · {tr(p.year)}
          </div>
          <h3 className="mb-3 text-xl font-bold sm:text-2xl">{tr(p.title)}</h3>
          <p className="mb-6 leading-relaxed text-muted">{tr(p.summary)}</p>

          {p.metrics && (
            <>
              <h4 className="mb-3 text-sm text-accent"># {tr(ui.results)}</h4>
              <div className="mb-6 grid gap-px border border-line bg-line" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
                {p.metrics.map((m, i) => (
                  <div key={i} className="bg-panel p-3">
                    <div className="text-lg font-bold text-accent">{tr(m.v)}</div>
                    <div className="text-xs text-muted">{tr(m.k)}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          <h4 className="mb-3 text-sm text-accent"># {tr(ui.whatIDid)}</h4>
          <ul className="mb-6 space-y-2">
            {tr(p.details).map((d, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed">
                <span className="text-accent">{String(i + 1).padStart(2, '0')}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>

          <h4 className="mb-3 text-sm text-accent"># {tr(ui.stack)}</h4>
          <div className="flex flex-wrap gap-1.5">
            {p.stack.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
