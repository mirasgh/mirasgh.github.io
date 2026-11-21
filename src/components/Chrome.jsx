import { Briefcase, Code, Cpu, Download, Folder, GraduationCap, Languages, Mail, Menu, Moon, Sun, Terminal, Users, X } from 'lucide-react'
import { useT } from '../i18n.jsx'
import { nav, profile, ui } from '../data/content.js'
import { Led } from './ui.jsx'

const icons = {
  root: Folder,
  projects: Code,
  skills: Cpu,
  experience: Briefcase,
  leadership: Users,
  education: GraduationCap,
  contact: Mail,
}

export function Sidebar({ active, open, onClose, onTerminal }) {
  const { tr } = useT()
  return (
    <>
      <div className={`fixed inset-0 z-30 bg-black/50 lg:hidden ${open ? 'block' : 'hidden'}`} onClick={onClose} />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-line bg-panel px-6 py-8 transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-10 flex items-start justify-between">
          <a href="#root" onClick={onClose}>
            <div className="text-2xl font-extrabold tracking-wider text-accent">MIRAS_SYS</div>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted">
              <Led /> [ {tr(ui.status)}: ONLINE ]
            </div>
          </a>
          <button onClick={onClose} className="p-1 text-muted hover:text-fg lg:hidden" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {nav.map((n) => {
            const Icon = icons[n.id]
            const on = active === n.id
            return (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={onClose}
                className={`flex items-center gap-4 px-5 py-3.5 text-sm tracking-wide transition-colors ${
                  on ? 'bg-accent font-bold text-onaccent' : 'text-fg/80 hover:bg-panel2 hover:text-accent'
                }`}
              >
                <Icon size={18} />
                {tr(n.label)}
              </a>
            )
          })}
        </nav>

        <div className="mt-6 space-y-3">
          <button
            onClick={onTerminal}
            className="flex w-full items-center justify-center gap-2 border border-line py-3 text-xs text-muted hover:border-accent hover:text-accent"
          >
            <Terminal size={14} /> {tr(ui.termMode)}
          </button>
          <a href={tr(profile.cv)} download className="flex w-full items-center justify-center gap-2 border border-accent py-3.5 text-sm font-bold text-accent hover:bg-accent/10">
            <Download size={16} /> {tr(ui.downloadCv)}
          </a>
        </div>
      </aside>
    </>
  )
}

export function TopBar({ active, theme, onTheme, onLang, onMenu }) {
  const { tr, lang } = useT()
  const path = active === 'root' ? '~' : `~/${active}`
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-bg/85 px-4 backdrop-blur sm:px-8">
      <button onClick={onMenu} className="p-1 text-fg lg:hidden" aria-label="Open menu">
        <Menu size={22} />
      </button>
      <span className="hidden gap-1.5 sm:flex">
        <span className="h-3.5 w-3.5 bg-danger" />
        <span className="h-3.5 w-3.5 bg-amber" />
        <span className="h-3.5 w-3.5 bg-accent" />
      </span>
      <span className="min-w-0 truncate text-sm font-bold text-accent sm:ml-3 sm:text-lg">
        {profile.handle}@{profile.host}:<span className="text-fg">{path}</span>$
        <span className="ml-1 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] animate-blink bg-accent" />
      </span>
      <div className="ml-auto flex shrink-0 items-center gap-2">
        <button onClick={onTheme} className="flex items-center gap-2 border border-accent/60 px-2.5 py-1.5 text-xs text-accent hover:bg-accent/10 sm:px-3" aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          <span className="hidden sm:inline">{theme === 'dark' ? tr(ui.light) : tr(ui.dark)}</span>
        </button>
        <button onClick={onLang} className="flex items-center gap-2 border border-accent/60 px-2.5 py-1.5 text-xs text-accent hover:bg-accent/10 sm:px-3" aria-label="Switch language">
          <Languages size={14} /> {lang === 'en' ? 'FR' : 'EN'}
        </button>
        <a href={tr(profile.cv)} download className="hidden items-center gap-2 px-2 py-1.5 text-xs text-fg hover:text-accent md:flex">
          <Download size={14} /> CV.PDF
        </a>
      </div>
    </header>
  )
}
