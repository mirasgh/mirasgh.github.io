import { useEffect, useRef } from 'react'

// Fades children in when they scroll into view.
export function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('in')
          io.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  )
}

export function SectionTitle({ children, index }) {
  return (
    <Reveal className="mb-8 flex items-baseline gap-3">
      <span className="text-accent text-2xl sm:text-3xl font-bold">#</span>
      <h2 className="text-2xl sm:text-3xl font-bold tracking-wide">{children}</h2>
      {index && <span className="ml-auto text-xs text-muted hidden sm:inline">[{index}]</span>}
    </Reveal>
  )
}

export function Tag({ children, active, onClick }) {
  const Comp = onClick ? 'button' : 'span'
  return (
    <Comp
      onClick={onClick}
      className={`inline-flex items-center border px-2 py-0.5 text-xs transition-colors ${
        active
          ? 'border-accent bg-accent text-onaccent'
          : 'border-line text-muted ' + (onClick ? 'hover:border-accent hover:text-accent' : '')
      }`}
    >
      {children}
    </Comp>
  )
}

export function Led({ on = true, color = 'accent' }) {
  const c = color === 'amber' ? 'bg-amber shadow-[0_0_8px_rgb(var(--amber))]' : 'bg-accent shadow-[0_0_8px_rgb(var(--accent))]'
  return <span className={`inline-block h-2 w-2 rounded-full ${on ? c : 'bg-line'}`} />
}
