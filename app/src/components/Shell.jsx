import { DATA, CATEGORIES, ALL_TOOLS } from '../data';
import { Icon } from './Primitives';

const ACTIVE_BG = "oklch(from var(--accent) 0.22 0.05 h)";

export function Sidebar({ activeCat, setActiveCat, isOpen, onClose }) {
  const navItem = (key, label, right, isActive) => (
    <button
      key={key}
      onClick={() => { setActiveCat(key); onClose?.(); }}
      className="text-left flex items-center justify-between px-2.5 py-2 rounded-[3px] cursor-pointer transition-colors"
      style={{
        background: isActive ? ACTIVE_BG : "transparent",
        color: isActive ? "var(--accent)" : "var(--text)",
        fontFamily: "var(--display)",
        fontSize: 13,
        fontWeight: isActive ? 500 : 400,
        border: "none",
      }}
      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "var(--surface)"; }}
      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
    >
      <span>{label}</span>
      <span className="font-mono text-[11px] text-text-dim">{right}</span>
    </button>
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}
      <nav
        className={`flex flex-col gap-0.5 w-[220px] flex-shrink-0 border-r border-border bg-bg h-screen overflow-y-auto whitespace-nowrap py-6 px-4
          fixed md:sticky top-0 left-0 z-40 transform transition-transform duration-200
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="font-mono text-[10px] text-text-dim tracking-wider uppercase px-2.5 pb-3">
          Index
        </div>

        {navItem("__about", "About",
          <span className="font-mono text-[10px] text-text-dim tracking-wide">$whoami</span>,
          activeCat === "__about"
        )}
        {navItem("__all", "All tools", ALL_TOOLS.length, activeCat === "__all")}

        <div className="h-px bg-border mx-2.5 my-2" />

        {CATEGORIES.map((cat) => navItem(cat, cat, DATA[cat].count, activeCat === cat))}

        <div className="flex-1" />

        <div className="font-mono text-[10px] text-text-dim leading-relaxed p-2.5 border-t border-border mt-5">
          <div className="text-text-muted mb-1">dotfiles v2.1</div>
          <div>updated 2026-04-17</div>
          <div>maintained by @seba</div>
        </div>
      </nav>
    </>
  );
}

export function TopBar({ query, setQuery, view, setView, onMenuClick, showViewToggle = true }) {
  return (
    <header
      className="sticky top-0 z-20 flex items-center gap-5 px-8 py-3.5 border-b border-border"
      style={{ background: "oklch(from var(--bg) l c h / 0.85)", backdropFilter: "blur(12px)" }}
    >
      <button
        onClick={onMenuClick}
        className="md:hidden p-1.5 border border-border rounded-[3px] text-text-dim"
        aria-label="Open menu"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
      </button>

      <div className="flex items-center gap-2.5">
        <div className="w-2 h-2 rounded-full" style={{ background: "var(--accent)", boxShadow: "0 0 12px var(--accent)" }} />
        <span className="font-display text-[15px] font-semibold text-text -tracking-[0.2px]" style={{ fontFamily: "var(--display)" }}>
          dotfiles
        </span>
        <span className="hidden sm:inline font-mono text-[10px] text-text-dim tracking-wide">
          sebabreguel-setup.vercel.app
        </span>
      </div>

      <div className={`${showViewToggle ? "hidden sm:flex" : "hidden"} border border-border rounded-[3px] overflow-hidden ml-2`}>
        {["catalog", "terminal"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="px-3 py-1.5 font-mono text-[11px] tracking-wide cursor-pointer border-0"
            style={{
              background: view === v ? "oklch(from var(--accent) 0.22 0.06 h)" : "transparent",
              color: view === v ? "var(--accent)" : "var(--text-dim)",
            }}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-[3px] w-40 sm:w-[280px] text-text-dim">
        <Icon.Search />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools..."
          className="flex-1 bg-transparent border-0 outline-none text-[13px] text-text"
          style={{ fontFamily: "var(--prose)" }}
        />
        <span className="hidden sm:inline font-mono text-[10px] px-1.5 py-px border border-border rounded-sm text-text-dim">
          /
        </span>
      </div>
    </header>
  );
}

const TWEAK_SWATCHES = [
  { name: "indigo", val: "oklch(0.68 0.17 252)" },
  { name: "cyan",   val: "oklch(0.72 0.12 200)" },
  { name: "green",  val: "oklch(0.76 0.16 150)" },
  { name: "amber",  val: "oklch(0.80 0.14 70)" },
  { name: "coral",  val: "oklch(0.72 0.16 25)" },
  { name: "violet", val: "oklch(0.70 0.18 300)" },
  { name: "rose",   val: "oklch(0.72 0.17 350)" },
  { name: "white",  val: "oklch(0.90 0.01 250)" },
];

export function TweaksPanel({ accent, setAccent, onClose }) {
  return (
    <div
      className="fixed bottom-5 right-5 w-[260px] bg-surface border border-border-hi rounded p-4 z-50 font-mono"
      style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.4)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] tracking-wider text-text-dim uppercase">Tweaks</div>
        <button
          onClick={onClose}
          className="bg-transparent border border-border w-[22px] h-[22px] rounded-[3px] text-text-dim cursor-pointer grid place-items-center"
        >
          <Icon.Close />
        </button>
      </div>
      <div className="text-[11px] text-text-muted mb-2">Accent color</div>
      <div className="grid grid-cols-4 gap-1.5">
        {TWEAK_SWATCHES.map((s) => (
          <button
            key={s.name}
            onClick={() => setAccent(s.val)}
            title={s.name}
            className="aspect-square rounded-[3px] cursor-pointer p-0"
            style={{
              background: s.val,
              border: accent === s.val ? "2px solid var(--text)" : "1px solid var(--border)",
              boxShadow: accent === s.val ? `0 0 0 2px var(--bg), 0 0 0 3px ${s.val}` : "none",
            }}
          />
        ))}
      </div>
      <div className="text-[10px] text-text-dim mt-3 leading-snug">
        Click a swatch to change the accent used throughout the design.
      </div>
    </div>
  );
}
