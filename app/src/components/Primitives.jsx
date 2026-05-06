// Shared primitives: badges, tags, icons, section labels.

const BADGE_MAP = {
  Homebrew:    { fg: "oklch(0.75 0.03 250)", bg: "oklch(0.22 0.01 250)", bd: "oklch(0.32 0.015 250)" },
  Marketplace: { fg: "oklch(0.75 0.03 250)", bg: "oklch(0.22 0.01 250)", bd: "oklch(0.32 0.015 250)" },
  Freemium:    { fg: "oklch(0.82 0.14 150)", bg: "oklch(0.22 0.04 150)", bd: "oklch(0.32 0.05 150)" },
  Free:        { fg: "oklch(0.82 0.14 150)", bg: "oklch(0.22 0.04 150)", bd: "oklch(0.32 0.05 150)" },
  Paid:        { fg: "oklch(0.82 0.12 60)",  bg: "oklch(0.24 0.04 60)",  bd: "oklch(0.34 0.06 60)"  },
  Premium:     { fg: "oklch(0.82 0.12 300)", bg: "oklch(0.24 0.04 300)", bd: "oklch(0.34 0.06 300)" },
  Config:      { fg: "oklch(0.78 0.08 220)", bg: "oklch(0.22 0.03 220)", bd: "oklch(0.32 0.04 220)" },
  Hook:        { fg: "oklch(0.82 0.10 20)",  bg: "oklch(0.22 0.03 20)",  bd: "oklch(0.32 0.04 20)"  },
  Agent:       { fg: "oklch(0.82 0.12 280)", bg: "oklch(0.22 0.04 280)", bd: "oklch(0.32 0.06 280)" },
  Skill:       { fg: "oklch(0.82 0.10 180)", bg: "oklch(0.22 0.03 180)", bd: "oklch(0.32 0.04 180)" },
};

export function Badge({ kind, children }) {
  const c = BADGE_MAP[kind] || BADGE_MAP.Homebrew;
  return (
    <span
      className="inline-flex items-center font-mono text-[10px] tracking-wide leading-snug px-[7px] py-[2px] rounded-[3px] border"
      style={{ color: c.fg, background: c.bg, borderColor: c.bd }}
    >
      {children || kind}
    </span>
  );
}

export function Tag({ children }) {
  return (
    <span className="font-mono text-[10px] text-text-dim px-[6px] py-[2px] border border-border rounded-[3px] bg-transparent">
      {children}
    </span>
  );
}

export const Icon = {
  Search: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>,
  Close:  (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><path d="M6 6l12 12M18 6l-12 12"/></svg>,
  Copy:   (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>,
  Check:  (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="m4 12 5 5L20 6"/></svg>,
  Arrow:  (p) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><path d="M7 17 17 7M9 7h8v8"/></svg>,
  Chevron:(p) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="m9 6 6 6-6 6"/></svg>,
  Sparkle:(p) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/></svg>,
};

export function Count({ n }) {
  return (
    <span className="font-mono text-[11px] text-text-dim ml-2">
      {String(n).padStart(2, "0")}
    </span>
  );
}

export function SectionLabel({ label, count, anchor }) {
  return (
    <div
      id={anchor}
      className="flex items-center gap-3 pt-7 pb-3.5 font-mono text-[11px] text-text-dim tracking-wider uppercase"
    >
      <span>{label}</span>
      <span className="opacity-50">·</span>
      <span>{String(count).padStart(2, "0")}</span>
      <div className="flex-1 h-px bg-border ml-1" />
    </div>
  );
}
