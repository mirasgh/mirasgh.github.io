import { useCallback, useEffect, useRef, useState } from 'react'
import { LayoutDashboard, Languages } from 'lucide-react'
import { useT } from '../i18n.jsx'
import { education, experience, languages, leadership, profile, projects, skillAliases, skillGroups, ui } from '../data/content.js'

const SECTIONS = ['profile', 'projects', 'skills', 'experience', 'leadership', 'education', 'contact']
const SECTION_ALIASES = {
  about: 'profile', root: 'profile', profil: 'profile',
  projets: 'projects', competences: 'skills', 'compétences': 'skills',
  experiences: 'experience', 'expérience': 'experience', formation: 'education',
}
const COMMANDS = ['help', 'ls', 'cd', 'cat', 'whoami', 'grep', 'projects', 'skills', 'experience', 'leadership', 'education', 'contact', 'neofetch', 'simulate', 'sensors', 'cv', 'lang', 'theme', 'history', 'date', 'echo', 'clear', 'gui', 'exit']

let uid = 0

export default function TerminalMode({ onExit, setLang, onTheme }) {
  const { tr, lang } = useT()
  const [lines, setLines] = useState([])
  const [input, setInput] = useState('')
  const [hist, setHist] = useState([])
  const [hIdx, setHIdx] = useState(-1)
  const [cwd, setCwd] = useState('~')
  const [busy, setBusy] = useState(false)
  const inputRef = useRef(null)
  const endRef = useRef(null)
  const timers = useRef([])
  const booted = useRef(false)
  const runRef = useRef(null)

  const push = useCallback((node) => setLines((l) => [...l, { id: ++uid, node }]), [])

  const Prompt = ({ dir }) => (
    <span className="shrink-0 text-accent">
      {profile.handle}@{profile.host}:{dir}$
    </span>
  )
  const Cmd = ({ c, children }) => (
    <button onClick={() => runRef.current(c)} className="text-accent underline decoration-accent/30 underline-offset-4 hover:bg-accent/15">
      {children ?? c}
    </button>
  )
  const H = ({ children }) => <div className="mb-2 mt-1 font-bold text-amber"># {children}</div>

  // ---------- section renderers ----------
  const out = {
    whoami: () => (
      <div className="my-3 border-l-4 border-accent py-2 pl-5 sm:pl-8">
        <div className="mb-3 text-3xl font-extrabold sm:text-5xl">{profile.name}</div>
        <p className="max-w-4xl text-base leading-relaxed sm:text-lg">
          {tr(profile.title)}: <span className="text-accent">{tr({ en: 'robotics, embedded systems & vision', fr: 'robotique, systèmes embarqués & vision' })}</span>.{' '}
          {tr({ en: 'Pure terminal shell active. Type', fr: 'Shell terminal pur actif. Tapez' })} <Cmd c="help" /> {tr({ en: 'or', fr: 'ou' })}{' '}
          <span className="text-accent">cd &lt;section&gt;</span> {tr({ en: 'to explore.', fr: 'pour explorer.' })}
        </p>
      </div>
    ),
    help: () => {
      const rows = [
        ['ls', { en: 'list sections', fr: 'lister les sections' }],
        ['cd <section>', { en: 'open a section (profile, projects, skills…)', fr: 'ouvrir une section (profile, projects, skills…)' }],
        ['cat <project>', { en: 'project details, e.g. cat ur5-vision', fr: 'détails d’un projet, ex. cat ur5-vision' }],
        ['grep <skill>', { en: 'find projects using a skill, e.g. grep stm32', fr: 'projets utilisant une compétence, ex. grep stm32' }],
        ['whoami', { en: 'short introduction', fr: 'présentation courte' }],
        ['simulate', { en: 'replay the UR5 vision pick & place pipeline', fr: 'rejouer le pipeline pick & place vision UR5' }],
        ['neofetch', { en: 'system info, engineer edition', fr: 'infos système, version ingénieur' }],
        ['sensors', { en: 'read the workshop sensors', fr: 'lire les capteurs de l’atelier' }],
        ['cv', { en: 'download my CV (PDF)', fr: 'télécharger mon CV (PDF)' }],
        ['lang en|fr', { en: 'switch language', fr: 'changer de langue' }],
        ['theme', { en: 'toggle light / dark', fr: 'basculer clair / sombre' }],
        ['history · clear · date · echo', { en: 'shell utilities', fr: 'utilitaires du shell' }],
        ['gui', { en: 'back to the graphical interface', fr: 'retour à l’interface graphique' }],
      ]
      return (
        <div className="my-2">
          <H>{tr({ en: 'AVAILABLE COMMANDS', fr: 'COMMANDES DISPONIBLES' })}</H>
          <div className="grid gap-x-8 gap-y-1 sm:grid-cols-[auto_1fr]">
            {rows.map(([c, d]) => (
              <div key={c} className="contents">
                <span className="text-accent">{c}</span>
                <span className="mb-1 text-muted sm:mb-0">{tr(d)}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">Tab = {tr({ en: 'autocomplete', fr: 'autocomplétion' })} · ↑ ↓ = {tr({ en: 'history', fr: 'historique' })} · Ctrl+L = clear</p>
        </div>
      )
    },
    ls: (here) =>
      here === '~/projects' ? (
        <div className="my-2 flex flex-wrap gap-x-8 gap-y-1">
          {projects.map((p) => (
            <Cmd key={p.id} c={`cat ${p.id}`}>{p.id}</Cmd>
          ))}
        </div>
      ) : (
        <div className="my-2 flex flex-wrap gap-x-10 gap-y-2">
          {SECTIONS.map((s) => (
            <Cmd key={s} c={`cd ${s}`}>.{s}/</Cmd>
          ))}
          <Cmd c="cv">CV.pdf</Cmd>
        </div>
      ),
    profile: () => (
      <div className="my-2 max-w-4xl">
        <H>PROFILE</H>
        <p className="mb-3 leading-relaxed">{tr(profile.about)}</p>
        <p className="mb-3 text-amber">» {tr(profile.seeking)}</p>
        <p className="text-muted">
          location: {tr(profile.location)} · email: <a className="text-accent" href={`mailto:${profile.email}`}>{profile.email}</a>
        </p>
      </div>
    ),
    projects: () => (
      <div className="my-2">
        <H>PROJECTS ({projects.length})</H>
        <div className="space-y-1">
          {projects.map((p, i) => (
            <div key={p.id} className="flex flex-col sm:flex-row sm:gap-4">
              <span className="text-muted">[{String(i + 1).padStart(2, '0')}]</span>
              <span className="sm:w-56 sm:shrink-0">
                <Cmd c={`cat ${p.id}`}>{p.id}</Cmd>
              </span>
              <span>
                {tr(p.title)} <span className="text-muted">({tr(p.year)})</span>
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">→ cat &lt;id&gt; {tr({ en: 'for details', fr: 'pour les détails' })}</p>
      </div>
    ),
    cat: (id) => {
      const p = projects.find((x) => x.id === id)
      if (!p) return <span className="text-danger">cat: {id || '?'}: {tr({ en: 'no such project. Try', fr: 'projet introuvable. Essayez' })} <Cmd c="ls">cd projects</Cmd></span>
      return (
        <div className="my-2 max-w-4xl">
          <div className="text-xl font-bold">{tr(p.title)}</div>
          <div className="mb-3 text-muted">{tr(p.context)} · {tr(p.year)}</div>
          <p className="mb-3 leading-relaxed">{tr(p.summary)}</p>
          <ul className="mb-3 space-y-1">
            {tr(p.details).map((d, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-accent">-</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
          {p.metrics && (
            <div className="mb-2 flex flex-wrap gap-x-6">
              {p.metrics.map((m, i) => (
                <span key={i}>
                  <span className="text-muted">{tr(m.k)}=</span>
                  <span className="text-amber">{tr(m.v)}</span>
                </span>
              ))}
            </div>
          )}
          <div className="text-muted">
            stack: <span className="text-accent">{p.stack.join(' · ')}</span>
          </div>
        </div>
      )
    },
    skills: () => (
      <div className="my-2">
        <H>SKILLS</H>
        <div className="space-y-2">
          {skillGroups.map((g) => (
            <div key={g.id}>
              <span className="text-accent">▸ {tr(g.title)}</span>
              <div className="pl-4 text-fg/90">{g.items.join(' · ')}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">→ grep &lt;skill&gt; {tr({ en: 'to see where a skill was used', fr: 'pour voir où une compétence a servi' })}</p>
      </div>
    ),
    grep: (term) => {
      if (!term) return <span className="text-danger">grep: {tr({ en: 'usage: grep <skill>', fr: 'usage : grep <compétence>' })}</span>
      const t = term.toLowerCase()
      const ids = new Set()
      Object.entries(skillAliases).forEach(([k, v]) => k.toLowerCase().includes(t) && v.forEach((id) => ids.add(id)))
      projects.forEach((p) => p.stack.some((s) => s.toLowerCase().includes(t)) && ids.add(p.id))
      const found = projects.filter((p) => ids.has(p.id))
      if (!found.length) return <span className="text-muted">grep: {tr({ en: 'no match for', fr: 'aucun résultat pour' })} "{term}"</span>
      return (
        <div className="my-2 space-y-1">
          {found.map((p) => (
            <div key={p.id}>
              <span className="text-muted">./projects/</span>
              <Cmd c={`cat ${p.id}`}>{p.id}</Cmd>
              <span className="text-muted"> : {tr(p.title)}</span>
            </div>
          ))}
        </div>
      )
    },
    experience: () => (
      <div className="my-2">
        <H>EXPERIENCE</H>
        {experience.map((e, i) => (
          <div key={i} className="mb-2">
            <div>
              <span className="font-bold">{tr(e.role)}</span> @ <span className="text-accent">{e.org}</span>{' '}
              <span className="text-muted">· {tr(e.place)} · {tr(e.date)}</span>
            </div>
            {tr(e.points).map((p, j) => (
              <div key={j} className="pl-4">- {p}</div>
            ))}
          </div>
        ))}
      </div>
    ),
    leadership: () => (
      <div className="my-2">
        <H>LEADERSHIP</H>
        {leadership.map((l, i) => (
          <div key={i} className="mb-2">
            <span className="font-bold">{tr(l.role)}</span> · <span className="text-accent">{l.org}</span> <span className="text-muted">({tr(l.date)})</span>
            <div className="pl-4 text-muted">{tr(l.desc)}</div>
          </div>
        ))}
      </div>
    ),
    education: () => (
      <div className="my-2">
        <H>{tr({ en: 'ACADEMIC_RECORDS', fr: 'PARCOURS_ACADÉMIQUE' })}</H>
        {education.map((e, i) => (
          <div key={i} className="mb-2">
            <span className="text-amber">[{tr(e.date)}]</span> <span className="font-bold">{tr(e.school)}</span>
            <div className="pl-4 text-muted">{tr(e.degree)}</div>
          </div>
        ))}
        <H>{tr(ui.languages)}</H>
        {languages.map((l) => (
          <div key={l.name.en} className="flex gap-3">
            <span className="w-24 text-accent">{tr(l.name)}</span>
            <span className="text-accent">{'█'.repeat(Math.round(l.value / 10))}<span className="text-line">{'░'.repeat(10 - Math.round(l.value / 10))}</span></span>
            <span className="text-muted">{tr(l.level)}</span>
          </div>
        ))}
      </div>
    ),
    contact: () => (
      <div className="my-2 space-y-1">
        <H>CONTACT</H>
        <div><span className="inline-block w-24 text-muted">email</span><a className="text-accent underline underline-offset-4" href={`mailto:${profile.email}`}>{profile.email}</a></div>
        <div><span className="inline-block w-24 text-muted">phone</span><a className="text-accent" href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a></div>
        <div className="break-all"><span className="inline-block w-24 text-muted">linkedin</span><a className="text-accent underline underline-offset-4" href={profile.linkedin} target="_blank" rel="noreferrer">{profile.linkedinLabel}</a></div>
        <div><span className="inline-block w-24 text-muted">location</span>{tr(profile.location)}</div>
      </div>
    ),
    neofetch: () => (
      <div className="my-2 flex flex-col gap-6 sm:flex-row">
        <pre className="text-accent leading-tight">{String.raw`
        ___
       [___]==o
        | |
     ___/ /
    (o)__/
     ||
   __||__
  |______|
 /________\ `}</pre>
        <div className="space-y-0.5">
          <div><span className="font-bold text-accent">{profile.handle}@{profile.host}</span></div>
          <div className="text-muted">-----------------------</div>
          {[
            ['OS', tr({ en: 'Mechatronics Engineering · ENISo', fr: 'Ingénierie mécatronique · ENISo' })],
            ['Host', tr(profile.location)],
            ['Kernel', 'SOLIDWORKS + STM32 + Python'],
            ['Uptime', tr({ en: 'engineering since 2021', fr: 'ingénierie depuis 2021' })],
            ['Packages', `${projects.length} projects · ${skillGroups.reduce((a, g) => a + g.items.length, 0)} skills`],
            ['Shell', 'miras-sh 1.0'],
            ['CPU', 'STM32 · Raspberry Pi 4'],
            ['Languages', 'AR · FR · EN · DE'],
            ['Status', tr(profile.status)],
          ].map(([k, v]) => (
            <div key={k}>
              <span className="text-accent">{k}</span>: {v}
            </div>
          ))}
          <div className="flex pt-2">
            {['bg-danger', 'bg-amber', 'bg-accent', 'bg-fg', 'bg-muted', 'bg-line'].map((c) => (
              <span key={c} className={`h-4 w-6 ${c}`} />
            ))}
          </div>
        </div>
      </div>
    ),
    sensors: () => {
      const bar = (v) => '█'.repeat(Math.round(v * 12)).padEnd(12, '░')
      const r = (a, b) => a + Math.random() * (b - a)
      const rows = [
        ['servo_1.temp', r(0.3, 0.5), `${r(36, 44).toFixed(1)} °C`],
        ['servo_2.temp', r(0.3, 0.5), `${r(36, 44).toFixed(1)} °C`],
        ['gripper.force', r(0.4, 0.7), `${r(80, 130).toFixed(0)} N`],
        ['pneu.pressure', r(0.55, 0.7), `${r(5.6, 6.2).toFixed(2)} bar`],
        ['spindle.speed', r(0.5, 0.7), `${r(1400, 1700).toFixed(0)} rpm`],
        ['tool.wear', r(0.2, 0.6), `${r(40, 160).toFixed(0)} min`],
        ['coffee.level', r(0.05, 0.2), 'LOW ⚠'],
      ]
      return (
        <div className="my-2">
          {rows.map(([k, v, txt]) => (
            <div key={k} className="flex gap-3 whitespace-pre">
              <span className="w-36 text-muted">{k}</span>
              <span className={k === 'coffee.level' ? 'text-amber' : 'text-accent'}>[{bar(v)}]</span>
              <span>{txt}</span>
            </div>
          ))}
        </div>
      )
    },
  }

  const simulate = () => {
    const log = [
      ['CAM', 'frame 640×480 acquired from overhead camera'],
      ['CV ', 'HSV segmentation → 3 blobs'],
      ['CV ', 'green  cube  px(295,168) → world( 0.45, -0.15, 0.025) m'],
      ['CV ', 'blue   cube  px(367,239) → world( 0.30, -0.00, 0.025) m'],
      ['CV ', 'red    cube  px(318,334) → world( 0.40,  0.20, 0.025) m'],
      ['WS ', 'cartesian reach ✓ · joint limits ±170° ✓ · elbow-up ✓ · clearance ✓'],
      ['IK ', 'green → solution accepted (tip < 5 mm, tilt < 3°)'],
      ['MOV', 'joint-space interpolation @ 0.8 rad/s … approach 0.25 m'],
      ['GRP', 'RG2 close → payload: green'],
      ['MOV', 'place → ( 0.00, 0.50, 0.025) ✓'],
      ['IK ', 'blue → solution accepted'],
      ['GRP', 'RG2 close → payload: blue'],
      ['MOV', 'place → (-0.15, 0.50, 0.025) ✓'],
      ['IK ', 'red → solution accepted'],
      ['GRP', 'RG2 close → payload: red'],
      ['MOV', 'place → ( 0.15, 0.50, 0.025) ✓'],
      ['OK ', tr({ en: '3/3 cubes sorted by colour. Back to HOME (0.30, 0.00, 0.40).', fr: '3/3 cubes triés par couleur. Retour HOME (0.30, 0.00, 0.40).' })],
    ]
    setBusy(true)
    push(<div className="text-muted">» UR5 + RG2 · CoppeliaSim · vision_detect.py + pick_and_place.py</div>)
    log.forEach(([tag, msg], i) => {
      timers.current.push(
        setTimeout(() => {
          push(
            <div>
              <span className={tag === 'OK ' ? 'text-accent' : 'text-amber'}>[{tag}]</span> {msg}
            </div>,
          )
          if (i === log.length - 1) {
            push(<div className="text-muted">→ <Cmd c="cat ur5-vision" /></div>)
            setBusy(false)
          }
        }, 180 * (i + 1)),
      )
    })
  }

  const download = () => {
    const a = document.createElement('a')
    a.href = tr(profile.cv)
    a.download = ''
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const resolveSection = (arg) => {
    const a = (arg || '').toLowerCase().replace(/^\.+/, '').replace(/^~\//, '').replace(/\/+$/, '')
    return SECTIONS.includes(a) ? a : SECTION_ALIASES[a]
  }

  // ---------- command dispatcher ----------
  const run = (raw) => {
    const line = raw.trim()
    const dirNow = cwd
    push(
      <div className="mt-3 flex flex-wrap gap-x-2">
        <Prompt dir={dirNow} />
        <span>{line}</span>
      </div>,
    )
    if (!line) return
    setHist((h) => [...h, line])
    setHIdx(-1)
    const [cmd, ...rest] = line.split(/\s+/)
    const arg = rest.join(' ')
    const c = cmd.toLowerCase()

    if (c === 'help' || c === 'man' || c === '?') return push(out.help())
    if (c === 'ls' || c === 'dir' || c === 'll') return push(out.ls(dirNow))
    if (c === 'whoami') return push(out.whoami())
    if (c === 'clear' || c === 'cls') return setLines([])
    if (c === 'gui' || c === 'exit' || c === 'quit') return onExit()
    if (c === 'cv' || c === 'download') {
      download()
      return push(<span className="text-accent">↓ CV.pdf</span>)
    }
    if (c === 'cat' || c === 'open') {
      if (/^cv(\.pdf)?$/i.test(arg)) {
        download()
        return push(<span className="text-accent">↓ CV.pdf</span>)
      }
      const sec = resolveSection(arg)
      if (sec && out[sec]) return push(out[sec]())
      return push(out.cat(arg.replace(/^\.?\/?(projects\/)?/, '')))
    }
    if (c === 'cd') {
      if (!arg || arg === '~' || arg === '..' || arg === '/' || arg === '~/') {
        setCwd('~')
        return
      }
      const sec = resolveSection(arg)
      if (!sec) return push(<span className="text-danger">cd: {arg}: {tr({ en: 'no such directory', fr: 'dossier introuvable' })}</span>)
      setCwd(`~/${sec}`)
      return push(out[sec]())
    }
    if (out[c] && SECTIONS.includes(c)) {
      setCwd(`~/${c}`)
      return push(out[c]())
    }
    if (c === 'grep') return push(out.grep(arg))
    if (c === 'neofetch') return push(out.neofetch())
    if (c === 'sensors') return push(out.sensors())
    if (c === 'simulate' || (c === 'run' && /arm|robot|sim/.test(arg))) return simulate()
    if (c === 'lang') {
      const v = arg.toLowerCase()
      const next = v === 'fr' || v === 'en' ? v : lang === 'en' ? 'fr' : 'en'
      setLang(next)
      return push(<span className="text-accent">lang → {next.toUpperCase()}</span>)
    }
    if (c === 'theme') {
      onTheme()
      return push(<span className="text-accent">theme toggled</span>)
    }
    if (c === 'history') return push(<div>{[...hist, line].map((h, i) => <div key={i}><span className="text-muted">{String(i + 1).padStart(4)}</span>  {h}</div>)}</div>)
    if (c === 'date') return push(<span>{new Date().toString()}</span>)
    if (c === 'echo') return push(<span>{arg}</span>)
    if (c === 'pwd') return push(<span>/home/{profile.handle}/{dirNow.replace(/^~\/?/, '')}</span>)
    if (c === 'sudo') return push(<span className="text-amber">[sudo] {tr({ en: 'permission denied. Root access is granted with a PFE offer → ', fr: 'permission refusée. L’accès root s’obtient avec une offre de PFE → ' })}<Cmd c="contact" /></span>)
    if (c === 'rm') return push(<span className="text-danger">rm: {tr({ en: 'safety interlock engaged. Emergency stop triggered. 🛑', fr: 'verrouillage de sécurité actif. Arrêt d’urgence déclenché. 🛑' })}</span>)
    if (c === 'hire' || c === 'ping') return push(<span className="text-accent">pong ← <a className="underline" href={`mailto:${profile.email}`}>{profile.email}</a></span>)
    return push(
      <span className="text-danger">
        {cmd}: command not found. {tr({ en: 'Type', fr: 'Tapez' })} <Cmd c="help" />
      </span>,
    )
  }
  runRef.current = run

  // ---------- boot ----------
  useEffect(() => {
    if (booted.current) return
    booted.current = true
    runRef.current('ls -a')
    runRef.current('whoami')
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [lines])

  useEffect(() => {
    if (!busy) inputRef.current?.focus()
  }, [busy])

  useEffect(() => {
    inputRef.current?.focus()
    const t = timers.current
    return () => t.forEach(clearTimeout)
  }, [])

  // ---------- keyboard ----------
  const complete = () => {
    const parts = input.split(/\s+/)
    if (parts.length <= 1) {
      const m = COMMANDS.filter((c) => c.startsWith(parts[0].toLowerCase()))
      if (m.length === 1) setInput(m[0] + ' ')
      else if (m.length > 1) push(<div className="text-muted">{m.join('   ')}</div>)
      return
    }
    const [cmd, ...r] = parts
    const a = r.join(' ').toLowerCase()
    let pool = []
    if (cmd === 'cd') pool = SECTIONS
    else if (cmd === 'cat' || cmd === 'open') pool = projects.map((p) => p.id)
    else if (cmd === 'lang') pool = ['en', 'fr']
    else if (cmd === 'grep') pool = Object.keys(skillAliases)
    const m = pool.filter((p) => p.toLowerCase().startsWith(a))
    if (m.length === 1) setInput(`${cmd} ${m[0]}`)
    else if (m.length > 1) push(<div className="text-muted">{m.join('   ')}</div>)
  }

  const onKey = (e) => {
    if (e.key === 'Enter') {
      if (busy) return
      run(input)
      setInput('')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      complete()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!hist.length) return
      const i = hIdx < 0 ? hist.length - 1 : Math.max(0, hIdx - 1)
      setHIdx(i)
      setInput(hist[i])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (hIdx < 0) return
      const i = hIdx + 1
      if (i >= hist.length) {
        setHIdx(-1)
        setInput('')
      } else {
        setHIdx(i)
        setInput(hist[i])
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    } else if (e.key === 'c' && e.ctrlKey && !window.getSelection()?.toString()) {
      push(
        <div className="mt-3 flex gap-2">
          <Prompt dir={cwd} />
          <span>{input}^C</span>
        </div>,
      )
      setInput('')
    }
  }

  const focus = () => {
    if (!window.getSelection()?.toString()) inputRef.current?.focus()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg text-[13px] sm:text-[15px]">
      <header className="flex h-16 shrink-0 items-center gap-3 border-b border-line px-4 sm:px-8">
        <span className="hidden gap-1.5 sm:flex">
          <span className="h-3.5 w-3.5 bg-danger" />
          <span className="h-3.5 w-3.5 bg-amber" />
          <span className="h-3.5 w-3.5 bg-accent" />
        </span>
        <span className="min-w-0 truncate font-bold text-accent sm:ml-3">
          [ {tr(ui.termMode)} ] {profile.handle}@{profile.host}
        </span>
        <div className="ml-auto flex shrink-0 gap-2">
          <button onClick={() => setLang(lang === 'en' ? 'fr' : 'en')} className="flex items-center gap-2 border border-line px-3 py-1.5 text-xs text-accent hover:border-accent">
            <Languages size={14} /> {lang === 'en' ? 'FR' : 'EN'}
          </button>
          <button onClick={onExit} className="flex items-center gap-2 bg-accent px-3 py-1.5 text-xs font-bold text-onaccent hover:brightness-110 sm:px-4">
            <LayoutDashboard size={14} /> <span className="hidden sm:inline">{tr(ui.exitGui)}</span>
            <span className="sm:hidden">GUI</span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-10 pt-4 sm:px-10" onClick={focus}>
        {lines.map((l) => (
          <div key={l.id}>{l.node}</div>
        ))}
        <div className="mt-3 flex items-center gap-2" ref={endRef}>
          <Prompt dir={cwd} />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            disabled={busy}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Terminal input"
            placeholder={tr({ en: 'type command: cd projects | grep stm32 | simulate | help | gui', fr: 'commande : cd projects | grep stm32 | simulate | help | gui' })}
            className="min-w-0 flex-1 bg-transparent text-fg caret-accent outline-none placeholder:text-muted/60"
          />
        </div>
      </div>
    </div>
  )
}
