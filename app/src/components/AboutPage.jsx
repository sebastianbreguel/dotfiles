import { ALL_TOOLS } from '../data';

function FieldLabel({ children }) {
  return (
    <div className="font-mono text-[10px] text-text-dim tracking-wider uppercase mb-2">
      {children}
    </div>
  );
}

function Identicon({ seed = "seba", size = 120, accent }) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const cells = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 3; c++) {
      const bit = (h >>> ((r * 3 + c) % 32)) & 1;
      cells.push({ r, c, on: bit === 1 });
    }
  }
  const cell = size / 5;
  const color = accent || "var(--accent)";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
      <rect width={size} height={size} fill="oklch(0.18 0.012 250)" />
      {cells.map(({ r, c, on }, i) => {
        if (!on) return null;
        return (
          <g key={i}>
            <rect x={c * cell} y={r * cell} width={cell} height={cell} fill={color} />
            {c < 2 && <rect x={(4 - c) * cell} y={r * cell} width={cell} height={cell} fill={color} />}
          </g>
        );
      })}
    </svg>
  );
}

const inlineCode = "font-mono text-[0.85em] px-1.5 py-px bg-surface border border-border rounded-[3px] text-text";

export default function AboutPage() {
  const daily = ALL_TOOLS.filter((t) => t.featured).slice(0, 6);

  return (
    <div className="max-w-[820px]">
      <div
        className="grid items-center gap-7 pb-7 mb-7"
        style={{ gridTemplateColumns: "auto 1fr", borderBottom: "2px solid var(--accent)" }}
      >
        <div className="border border-border rounded overflow-hidden flex-shrink-0">
          <Identicon seed="sebabreguel" size={120} />
        </div>
        <div>
          <div className="font-mono text-[11px] text-text-dim tracking-wider uppercase mb-2">
            About · maintainer
          </div>
          <h1
            className="text-4xl font-semibold -tracking-[0.8px] m-0 mb-2 text-text leading-[1.05]"
            style={{ fontFamily: "var(--display)" }}
          >
            Seba Breguel
          </h1>
          <div className="font-mono text-[13px]" style={{ color: "var(--accent)" }}>
            software engineer · full-stack, leaning AI
          </div>
        </div>
      </div>

      <section className="mb-9">
        <FieldLabel>Bio</FieldLabel>
        <p className="text-[17px] leading-relaxed text-text mb-3.5 max-w-[60ch] text-pretty" style={{ fontFamily: "var(--prose)" }}>
          I build software that leans on AI as a collaborator rather than a crutch. Most days that means shipping product with
          <span style={{ color: "var(--accent)" }}> Claude Code</span> open in one pane, a terminal in another, and a running bet with myself over how small the diff can be.
        </p>
        <p className="text-[17px] leading-relaxed text-text-muted mb-3.5 max-w-[60ch] text-pretty" style={{ fontFamily: "var(--prose)" }}>
          I care about tools that get out of the way, configs that travel across machines without drama, and the specific kind of joy that comes from a clean <code className={inlineCode}>git status</code>. This page is the long-form version of my <code className={inlineCode}>~/dotfiles</code>: what I reach for, and why.
        </p>
        <p className="text-[17px] leading-relaxed text-text-muted m-0 max-w-[60ch] text-pretty" style={{ fontFamily: "var(--prose)" }}>
          Nothing here is permanent. Every tool on the list survived a two-week trial on my machine. Some made it years. Some got cut last weekend.
        </p>
      </section>

      <section className="mb-9">
        <FieldLabel>Daily drivers</FieldLabel>
        <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
          {daily.map((t, i) => (
            <div key={i} className="px-3 py-2.5 bg-surface border border-border rounded-[3px]">
              <div className="text-[13px] font-semibold text-text" style={{ fontFamily: "var(--display)" }}>
                {t.name}
              </div>
              <div className="font-mono text-[10px] text-text-dim mt-[3px]">
                {t.category.toLowerCase()}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <FieldLabel>Meta</FieldLabel>
        <div
          className="font-mono text-xs text-text-muted grid bg-surface border border-border rounded-[3px] p-4"
          style={{ gridTemplateColumns: "auto 1fr", gap: "8px 24px" }}
        >
          <span className="text-text-dim tracking-wide">tools tracked</span><span>{ALL_TOOLS.length}</span>
          <span className="text-text-dim tracking-wide">last updated</span><span>2026-04-17</span>
          <span className="text-text-dim tracking-wide">machine</span><span>macbook pro · m3 max · 36gb</span>
          <span className="text-text-dim tracking-wide">shell</span><span>zsh + zinit + starship</span>
          <span className="text-text-dim tracking-wide">editor</span><span>vs code + claude code (fallback: nvim)</span>
          <span className="text-text-dim tracking-wide">source</span>
          <span>
            <a
              href="https://github.com/sebastianbreguel/dotfiles"
              target="_blank"
              rel="noreferrer"
              className="no-underline pb-px"
              style={{ color: "var(--accent)", borderBottom: "1px solid oklch(from var(--accent) l c h / 0.4)" }}
            >
              github.com/sebastianbreguel/dotfiles ↗
            </a>
          </span>
        </div>
      </section>
    </div>
  );
}
