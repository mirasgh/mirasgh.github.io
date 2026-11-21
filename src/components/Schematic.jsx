import { useEffect, useMemo, useRef, useState } from 'react'

// Crank-rocker four-bar linkage (Grashof: s + l <= p + q)
const A = { x: 70, y: 130 }
const D = { x: 170, y: 130 }
const a = 34 // crank
const b = 110 // coupler
const c = 80 // rocker
const PO = { u: 0.55, v: -38 } // coupler point: fraction along BC + normal offset

function solve(th) {
  const B = { x: A.x + a * Math.cos(th), y: A.y - a * Math.sin(th) }
  const dx = D.x - B.x
  const dy = D.y - B.y
  const d = Math.hypot(dx, dy)
  const l = (b * b - c * c + d * d) / (2 * d)
  const h = Math.sqrt(Math.max(0, b * b - l * l))
  const mx = B.x + (l * dx) / d
  const my = B.y + (l * dy) / d
  const Cc = { x: mx + (h * dy) / d, y: my - (h * dx) / d } // upper branch
  const ux = (Cc.x - B.x) / b
  const uy = (Cc.y - B.y) / b
  const P = { x: B.x + ux * b * PO.u - uy * PO.v, y: B.y + uy * b * PO.u + ux * PO.v }
  return { B, C: Cc, P }
}

function useRaf(active) {
  const [t, setT] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    let raf = 0
    let visible = false
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(loop)
    })
    if (ref.current) io.observe(ref.current)
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    function loop(now) {
      raf = 0
      setT(now / 1000)
      if (visible && active && !reduce) raf = requestAnimationFrame(loop)
    }
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [active])
  return [t, ref]
}

export function FourBar() {
  const [t, ref] = useRaf(true)
  const trace = useMemo(() => {
    let d = ''
    for (let i = 0; i <= 180; i++) {
      const { P } = solve((i / 180) * Math.PI * 2)
      d += `${i ? 'L' : 'M'}${P.x.toFixed(1)} ${P.y.toFixed(1)}`
    }
    return d
  }, [])
  const th = t * 1.6
  const { B, C, P } = solve(th)
  const line = (p, q, w = 6) => (
    <g strokeLinecap="round">
      <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="rgb(var(--fg) / .85)" strokeWidth={w} />
      <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="rgb(var(--panel2))" strokeWidth={w - 3} />
    </g>
  )
  const pin = (p, fixed) => (
    <circle cx={p.x} cy={p.y} r={fixed ? 5 : 4} fill="rgb(var(--panel))" stroke={fixed ? 'rgb(var(--fg))' : 'rgb(var(--accent))'} strokeWidth="2" />
  )
  return (
    <svg ref={ref} viewBox="0 0 260 170" className="h-full w-full" aria-label="Animated four-bar linkage">
      <path d={trace} fill="none" stroke="rgb(var(--amber) / .7)" strokeWidth="1.5" strokeDasharray="3 3" />
      {[A, D].map((g, i) => (
        <g key={i}>
          <path d={`M${g.x - 10} ${g.y + 12} L${g.x} ${g.y} L${g.x + 10} ${g.y + 12} Z`} fill="none" stroke="rgb(var(--muted))" />
          <line x1={g.x - 14} y1={g.y + 12} x2={g.x + 14} y2={g.y + 12} stroke="rgb(var(--muted))" />
        </g>
      ))}
      {line(A, D, 2)}
      <polygon points={`${B.x},${B.y} ${C.x},${C.y} ${P.x},${P.y}`} fill="rgb(var(--accent) / .12)" stroke="rgb(var(--accent) / .6)" />
      {line(D, C)}
      {line(B, C)}
      {line(A, B)}
      {pin(A, true)}
      {pin(D, true)}
      {pin(B)}
      {pin(C)}
      <circle cx={P.x} cy={P.y} r="4" fill="rgb(var(--amber))" />
      <text x="8" y="160" fontSize="9" fill="rgb(var(--muted))">
        crank-rocker · a={a} b={b} c={c} d={D.x - A.x}
      </text>
    </svg>
  )
}

export function AgentFlow() {
  const nodes = [
    { id: 'in', x: 30, y: 85, label: 'SKILLS' },
    { id: 'ag', x: 110, y: 85, label: 'AGENT' },
    { id: 's', x: 180, y: 45, label: 'SEARCH' },
    { id: 'r', x: 180, y: 125, label: 'RANK' },
    { id: 'out', x: 235, y: 85, label: 'TOP-N' },
  ]
  const n = Object.fromEntries(nodes.map((x) => [x.id, x]))
  const edges = [
    ['in', 'ag'],
    ['ag', 's'],
    ['s', 'r'],
    ['r', 'ag'],
    ['r', 'out'],
  ]
  return (
    <svg viewBox="0 0 270 170" className="h-full w-full" aria-label="AI agent pipeline">
      {edges.map(([p, q], i) => (
        <line key={i} x1={n[p].x} y1={n[p].y} x2={n[q].x} y2={n[q].y} stroke="rgb(var(--accent) / .7)" strokeWidth="1.5" strokeDasharray="4 4">
          <animate attributeName="stroke-dashoffset" from="16" to="0" dur="0.8s" repeatCount="indefinite" />
        </line>
      ))}
      {nodes.map((x) => (
        <g key={x.id}>
          <rect x={x.x - 26} y={x.y - 11} width="52" height="22" fill="rgb(var(--panel))" stroke={x.id === 'ag' ? 'rgb(var(--amber))' : 'rgb(var(--accent))'} />
          <text x={x.x} y={x.y + 3.5} fontSize="9" textAnchor="middle" fill="rgb(var(--fg))">
            {x.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default function Schematic({ kind }) {
  return (
    <div className="grid-bg flex h-full w-full items-center justify-center bg-panel2 p-2">
      {kind === 'fourbar' ? <FourBar /> : <AgentFlow />}
    </div>
  )
}
