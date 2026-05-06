// Shared primitives: badges, icons, typography helpers

function Badge({ kind, children }) {
  const map = {
    "Homebrew":    { fg: "oklch(0.75 0.03 250)", bg: "oklch(0.22 0.01 250)", bd: "oklch(0.32 0.015 250)" },
    "Marketplace": { fg: "oklch(0.75 0.03 250)", bg: "oklch(0.22 0.01 250)", bd: "oklch(0.32 0.015 250)" },
    "Freemium":    { fg: "oklch(0.82 0.14 150)", bg: "oklch(0.22 0.04 150)", bd: "oklch(0.32 0.05 150)" },
    "Free":        { fg: "oklch(0.82 0.14 150)", bg: "oklch(0.22 0.04 150)", bd: "oklch(0.32 0.05 150)" },
    "Paid":        { fg: "oklch(0.82 0.12 60)",  bg: "oklch(0.24 0.04 60)",  bd: "oklch(0.34 0.06 60)"  },
    "Premium":     { fg: "oklch(0.82 0.12 300)", bg: "oklch(0.24 0.04 300)", bd: "oklch(0.34 0.06 300)" },
    "Config":      { fg: "oklch(0.78 0.08 220)", bg: "oklch(0.22 0.03 220)", bd: "oklch(0.32 0.04 220)" },
    "Hook":        { fg: "oklch(0.82 0.10 20)",  bg: "oklch(0.22 0.03 20)",  bd: "oklch(0.32 0.04 20)"  },
    "Agent":       { fg: "oklch(0.82 0.12 280)", bg: "oklch(0.22 0.04 280)", bd: "oklch(0.32 0.06 280)" },
    "Skill":       { fg: "oklch(0.82 0.10 180)", bg: "oklch(0.22 0.03 180)", bd: "oklch(0.32 0.04 180)" },
  };
  const label = children || kind;
  const c = map[kind] || map["Homebrew"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 7px", borderRadius: 3,
      fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 0.3,
      color: c.fg, background: c.bg, border: `1px solid ${c.bd}`,
      lineHeight: 1.4,
    }}>{label}</span>
  );
}

function Tag({ children }) {
  return (
    <span style={{
      fontFamily: "var(--mono)", fontSize: 10,
      color: "var(--text-dim)",
      padding: "2px 6px", border: "1px solid var(--border)",
      borderRadius: 3, background: "transparent",
    }}>{children}</span>
  );
}

// Small iconography (SVG, stroked, 14px)
const Icon = {
  Search: (props) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>,
  Close: (props) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}><path d="M6 6l12 12M18 6l-12 12"/></svg>,
  Copy: (props) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>,
  Check: (props) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}><path d="m4 12 5 5L20 6"/></svg>,
  Arrow: (props) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}><path d="M7 17 17 7M9 7h8v8"/></svg>,
  Chevron: (props) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}><path d="m9 6 6 6-6 6"/></svg>,
  Sparkle: (props) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/></svg>,
};

// Count formatted small-caps mono
function Count({ n }) {
  return (
    <span style={{
      fontFamily: "var(--mono)", fontSize: 11,
      color: "var(--text-dim)", marginLeft: 8,
    }}>{String(n).padStart(2, "0")}</span>
  );
}

// Section label ("CATEGORY · 06" style)
function SectionLabel({ label, count, anchor }) {
  return (
    <div id={anchor} style={{
      display: "flex", alignItems: "center", gap: 12,
      paddingTop: 28, paddingBottom: 14,
      fontFamily: "var(--mono)", fontSize: 11,
      color: "var(--text-dim)", letterSpacing: 1.4,
      textTransform: "uppercase",
    }}>
      <span>{label}</span>
      <span style={{ color: "var(--text-dim)", opacity: 0.5 }}>·</span>
      <span>{String(count).padStart(2, "0")}</span>
      <div style={{ flex: 1, height: 1, background: "var(--border)", marginLeft: 4 }} />
    </div>
  );
}

Object.assign(window, { Badge, Tag, Icon, Count, SectionLabel });
