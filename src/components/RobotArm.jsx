import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n.jsx'
import { ui } from '../data/content.js'
import { RotateCcw } from 'lucide-react'

// ---- Geometry (world units, y up, floor at y = 0) ----
const S = { x: 0, y: 78 } // shoulder
const L1 = 125
const L2 = 105
const G = 36 // wrist -> finger tips
const C = 22 // cube size
const FLOOR_SY = 300 // svg y of the floor
const sy = (y) => FLOOR_SY - y
const SLOTS = [-200, -150, -100, 100, 150, 200]
const COLORS = { red: '#ef4444', green: '#22c55e', blue: '#3b82f6' }

const initialCubes = () => [
  { id: 'red', x: -170, y: 0, vy: 0 },
  { id: 'green', x: -110, y: 0, vy: 0 },
  { id: 'blue', x: 160, y: 0, vy: 0 },
]

const angDiff = (a) => Math.atan2(Math.sin(a), Math.cos(a))

function clampTarget(x, y) {
  x = Math.max(-235, Math.min(235, x))
  y = Math.max(0, Math.min(270, y))
  if (Math.abs(x) < 44 && y < 95) y = 95 // keep out of the pedestal
  return { x, y }
}

// Inverse kinematics for the wrist point; picks the elbow-up solution.
function solveIK(tip) {
  let dx = tip.x - S.x
  let dy = tip.y + G - S.y
  let d = Math.hypot(dx, dy)
  const dMin = Math.abs(L1 - L2) + 5
  const dMax = L1 + L2 - 0.5
  if (d > dMax || d < dMin) {
    const k = (d > dMax ? dMax : dMin) / (d || 1)
    dx *= k
    dy *= k
    d = Math.hypot(dx, dy)
  }
  const c2 = Math.max(-1, Math.min(1, (d * d - L1 * L1 - L2 * L2) / (2 * L1 * L2)))
  let best = null
  for (const s of [1, -1]) {
    const t2 = s * Math.acos(c2)
    const t1 = Math.atan2(dy, dx) - Math.atan2(L2 * Math.sin(t2), L1 + L2 * Math.cos(t2))
    const ey = L1 * Math.sin(t1)
    if (!best || ey > best.ey) best = { t1, t2, ey }
  }
  return best
}

function fk(t1, t2) {
  const E = { x: S.x + L1 * Math.cos(t1), y: S.y + L1 * Math.sin(t1) }
  const W = { x: E.x + L2 * Math.cos(t1 + t2), y: E.y + L2 * Math.sin(t1 + t2) }
  return { E, W, tip: { x: W.x, y: W.y - G } }
}

function supportAt(cubes, x, self) {
  let s = 0
  for (const c of cubes) {
    if (c.id === self || c.held || c.falling) continue
    if (Math.abs(c.x - x) < C * 0.9) s = Math.max(s, c.y + C)
  }
  return s
}

function isTopFree(cubes, cube) {
  return !cubes.some((c) => c !== cube && !c.held && Math.abs(c.x - cube.x) < C * 0.9 && c.y > cube.y + 1)
}

export default function RobotArm() {
  const { tr } = useT()
  const svgRef = useRef(null)
  const wrapRef = useRef(null)
  const [, setFrame] = useState(0)
  const st = useRef(null)
  if (!st.current) {
    const ik = solveIK({ x: 120, y: 160 })
    st.current = {
      p: { x: 120, y: 160 }, // smoothed cartesian set-point
      target: { x: 120, y: 160 },
      t1: ik.t1,
      t2: ik.t2,
      grip: 1,
      gripTarget: 1,
      held: null,
      cubes: initialCubes(),
      auto: true,
      lastInput: 0,
      pending: null,
      queue: [],
      wait: 0,
    }
  }

  // ---- actions ----
  const act = (s, tip) => {
    if (s.held) {
      const c = s.cubes.find((c) => c.id === s.held)
      c.held = false
      c.falling = true
      c.vy = 0
      s.held = null
      s.gripTarget = 1
      return
    }
    const cand = s.cubes
      .filter((c) => !c.falling && isTopFree(s.cubes, c))
      .find((c) => Math.abs(tip.x - c.x) < 15 && tip.y > c.y - 6 && tip.y < c.y + C * 0.8)
    if (cand) {
      cand.held = true
      s.held = cand.id
      s.gripTarget = 0
    } else {
      s.gripTarget = s.gripTarget > 0.5 ? 0 : 1
    }
  }

  const planAuto = (s) => {
    const free = s.cubes.filter((c) => !c.held && !c.falling && isTopFree(s.cubes, c))
    if (!free.length) return
    const cube = free[Math.floor(Math.random() * free.length)]
    const slots = SLOTS.filter((x) => Math.abs(x - cube.x) > C * 1.5)
    const dest = slots[Math.floor(Math.random() * slots.length)]
    const land = supportAt(s.cubes, dest, cube.id)
    const hover = 150
    s.queue = [
      { x: cube.x, y: Math.max(hover, cube.y + C + 50) },
      { x: cube.x, y: cube.y + 3, action: 'grab' },
      { x: cube.x, y: Math.max(hover, cube.y + C + 60) },
      { x: dest, y: Math.max(hover, land + C + 60) },
      { x: dest, y: land + 2, action: 'release' },
      { x: dest, y: Math.max(hover, land + C + 50) },
    ]
  }

  // ---- main loop ----
  useEffect(() => {
    let raf = 0
    let visible = true
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(step)
    })
    if (wrapRef.current) io.observe(wrapRef.current)

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    function step(now) {
      raf = 0
      const s = st.current
      if (!s.auto && now - s.lastInput > 7000 && !s.held) s.auto = true

      const cur = fk(s.t1, s.t2)

      if (s.auto && !reduce) {
        if (s.wait > 0) s.wait--
        else {
          if (!s.queue.length) {
            planAuto(s)
            s.wpT = now
          }
          const wp = s.queue[0]
          if (wp) {
            s.target = clampTarget(wp.x, wp.y)
            const reached = Math.hypot(cur.tip.x - s.target.x, cur.tip.y - s.target.y) < 2.5
            if (reached || now - s.wpT > 4500) {
              if (wp.action) {
                act(s, cur.tip)
                s.wait = 14
              }
              s.queue.shift()
              s.wpT = now
            }
          }
        }
      } else if (s.pending) {
        const near = Math.hypot(cur.tip.x - s.target.x, cur.tip.y - s.target.y) < 4
        if (near || now - s.pending > 900) {
          act(s, cur.tip)
          s.pending = null
        }
      }

      // smooth cartesian set-point, then IK, then smooth joints
      const kp = s.auto ? 0.06 : 0.16
      s.p.x += (s.target.x - s.p.x) * kp
      s.p.y += (s.target.y - s.p.y) * kp
      const ik = solveIK(s.p)
      s.t1 += angDiff(ik.t1 - s.t1) * 0.35
      s.t2 += angDiff(ik.t2 - s.t2) * 0.35
      s.grip += (s.gripTarget - s.grip) * 0.2

      const { tip } = fk(s.t1, s.t2)
      for (const c of s.cubes) {
        if (c.held) {
          c.x = tip.x
          c.y = tip.y + 2
        } else if (c.falling) {
          c.vy -= 0.7
          c.y += c.vy
          const sup = supportAt(s.cubes, c.x, c.id)
          if (c.y <= sup) {
            c.y = sup
            c.vy = 0
            c.falling = false
          }
        }
      }

      setFrame((f) => (f + 1) % 1e6)
      if (visible) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [])

  // ---- input ----
  const toWorld = (e) => {
    const svg = svgRef.current
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const p = pt.matrixTransform(svg.getScreenCTM().inverse())
    return { x: p.x, y: FLOOR_SY - p.y }
  }
  const onMove = (e) => {
    if (e.pointerType === 'touch') return
    const s = st.current
    if (s.auto) {
      s.auto = false
      s.queue = []
      s.p = { ...fk(s.t1, s.t2).tip }
    }
    s.lastInput = performance.now()
    const w = toWorld(e)
    s.target = clampTarget(w.x, w.y)
  }
  const onClick = (e) => {
    const s = st.current
    if (s.auto) {
      s.auto = false
      s.queue = []
      s.p = { ...fk(s.t1, s.t2).tip }
    }
    const w = toWorld(e)
    s.lastInput = performance.now()
    s.target = clampTarget(w.x, w.y)
    s.pending = performance.now()
  }
  const toggleMode = () => {
    const s = st.current
    s.auto = !s.auto
    s.queue = []
    s.lastInput = performance.now()
    if (!s.auto) s.p = { ...fk(s.t1, s.t2).tip }
  }
  const reset = () => {
    const s = st.current
    s.cubes = initialCubes()
    s.held = null
    s.gripTarget = 1
    s.queue = []
  }

  // ---- render ----
  const s = st.current
  const { E, W, tip } = fk(s.t1, s.t2)
  const deg = (r) => ((r * 180) / Math.PI).toFixed(1)
  const t3 = -Math.PI / 2 - (s.t1 + s.t2)
  const heldCube = s.held ? s.cubes.find((c) => c.id === s.held) : null
  const gap = heldCube ? C / 2 + 1 + s.grip * 4 : 3 + s.grip * 14
  const fingerTop = W.y - 9

  const joint = (x, y, r) => (
    <g>
      <circle cx={x} cy={sy(y)} r={r} fill="rgb(var(--panel))" stroke="rgb(var(--accent))" strokeWidth="3" />
      <circle cx={x} cy={sy(y)} r={r * 0.32} fill="rgb(var(--accent))" />
    </g>
  )
  const link = (a, b, w) => (
    <g strokeLinecap="round">
      <line x1={a.x} y1={sy(a.y)} x2={b.x} y2={sy(b.y)} stroke="rgb(var(--fg) / .85)" strokeWidth={w} />
      <line x1={a.x} y1={sy(a.y)} x2={b.x} y2={sy(b.y)} stroke="rgb(var(--panel2))" strokeWidth={w - 6} />
      <line x1={a.x} y1={sy(a.y)} x2={b.x} y2={sy(b.y)} stroke="rgb(var(--accent) / .5)" strokeWidth="1.5" strokeDasharray="4 5" />
    </g>
  )

  return (
    <div ref={wrapRef} className="brackets border border-line bg-panel/80 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-line px-3 py-2 text-[11px] text-muted">
        <span className="truncate">
          <span className="text-accent">●</span> arm_controller.sim — 3-DOF · IK
        </span>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={toggleMode}
            className={`border px-2 py-0.5 transition-colors ${s.auto ? 'border-accent text-accent' : 'border-amber text-amber'}`}
            aria-label="Toggle auto / manual mode"
          >
            {s.auto ? tr(ui.armAuto) : tr(ui.armManual)}
          </button>
          <button onClick={reset} className="border border-line px-2 py-0.5 hover:border-accent hover:text-accent" aria-label="Reset cubes">
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox="-260 -20 520 340"
        className="block w-full cursor-crosshair select-none"
        style={{ touchAction: 'pan-y' }}
        onPointerMove={onMove}
        onClick={onClick}
        role="img"
        aria-label="Interactive robot arm simulation"
      >
        <defs>
          <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="rgb(var(--line))" strokeWidth="2" />
          </pattern>
        </defs>

        {/* workspace envelope */}
        <circle cx={S.x} cy={sy(S.y)} r={L1 + L2} fill="none" stroke="rgb(var(--accent) / .18)" strokeDasharray="3 6" />
        <circle cx={S.x} cy={sy(S.y)} r={L1 - L2 + 5} fill="none" stroke="rgb(var(--accent) / .12)" strokeDasharray="3 6" />

        {/* floor */}
        <rect x="-260" y={FLOOR_SY} width="520" height="20" fill="url(#hatch)" />
        <line x1="-260" y1={FLOOR_SY} x2="260" y2={FLOOR_SY} stroke="rgb(var(--muted))" strokeWidth="1.5" />
        {SLOTS.map((x) => (
          <line key={x} x1={x} y1={FLOOR_SY + 3} x2={x} y2={FLOOR_SY + 9} stroke="rgb(var(--muted) / .6)" />
        ))}

        {/* target crosshair */}
        {!s.auto && (
          <g stroke="rgb(var(--amber))" strokeWidth="1.2" opacity=".85">
            <circle cx={s.target.x} cy={sy(s.target.y)} r="7" fill="none" strokeDasharray="2 2" />
            <line x1={s.target.x - 12} y1={sy(s.target.y)} x2={s.target.x + 12} y2={sy(s.target.y)} />
            <line x1={s.target.x} y1={sy(s.target.y) - 12} x2={s.target.x} y2={sy(s.target.y) + 12} />
          </g>
        )}

        {/* cubes (not held) */}
        {s.cubes
          .filter((c) => !c.held)
          .map((c) => (
            <rect
              key={c.id}
              x={c.x - C / 2}
              y={sy(c.y + C)}
              width={C}
              height={C}
              fill={COLORS[c.id]}
              stroke="rgb(0 0 0 / .35)"
              strokeWidth="1.5"
              rx="2"
            />
          ))}

        {/* pedestal */}
        <path d={`M -40 ${FLOOR_SY} L -28 ${sy(56)} L 28 ${sy(56)} L 40 ${FLOOR_SY} Z`} fill="rgb(var(--panel2))" stroke="rgb(var(--fg) / .7)" strokeWidth="2" />
        <rect x="-22" y={sy(78)} width="44" height="24" fill="rgb(var(--panel2))" stroke="rgb(var(--fg) / .7)" strokeWidth="2" />
        <line x1="-18" y1={sy(28)} x2="18" y2={sy(28)} stroke="rgb(var(--accent) / .6)" strokeWidth="2" />

        {link(S, E, 18)}
        {link(E, W, 15)}

        {/* gripper */}
        <g>
          <rect x={W.x - gap - 5} y={sy(W.y) - 2} width={gap * 2 + 10} height="10" fill="rgb(var(--fg) / .85)" rx="2" />
          {heldCube && (
            <rect x={heldCube.x - C / 2} y={sy(heldCube.y + C)} width={C} height={C} fill={COLORS[heldCube.id]} stroke="rgb(0 0 0 / .35)" strokeWidth="1.5" rx="2" />
          )}
          {[-1, 1].map((side) => (
            <rect
              key={side}
              x={W.x + side * gap - (side < 0 ? 4 : 0)}
              y={sy(fingerTop)}
              width="4"
              height={fingerTop - tip.y}
              fill="rgb(var(--fg) / .85)"
              rx="1"
            />
          ))}
        </g>

        {joint(S.x, S.y, 14)}
        {joint(E.x, E.y, 12)}
        {joint(W.x, W.y, 9)}

        {/* labels */}
        <text x={S.x + 20} y={sy(S.y) + 4} fontSize="10" fill="rgb(var(--muted))">θ1</text>
        <text x={E.x + 16} y={sy(E.y) + 4} fontSize="10" fill="rgb(var(--muted))">θ2</text>
        <text x={W.x + 13} y={sy(W.y) + 4} fontSize="10" fill="rgb(var(--muted))">θ3</text>
      </svg>

      <div className="grid grid-cols-3 sm:grid-cols-6 border-t border-line text-[11px]">
        {[
          ['θ1', `${deg(s.t1)}°`],
          ['θ2', `${deg(s.t2)}°`],
          ['θ3', `${deg(angDiff(t3))}°`],
          ['X', `${(tip.x * 2).toFixed(0)} mm`],
          ['Y', `${(tip.y * 2).toFixed(0)} mm`],
          [tr(ui.payload), heldCube ? heldCube.id.toUpperCase() : tr(ui.none)],
        ].map(([k, v]) => (
          <div key={k} className="border-r border-b sm:border-b-0 border-line px-2 py-1.5 last:border-r-0">
            <div className="text-muted">{k}</div>
            <div className="text-accent tabular-nums">{v}</div>
          </div>
        ))}
      </div>
      <p className="px-3 py-2 text-[11px] text-muted border-t border-line">{tr(ui.armHint)}</p>
    </div>
  )
}
