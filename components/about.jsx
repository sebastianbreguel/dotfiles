// About page — persona / first-person narrative

// Deterministic identicon — 5x5 symmetric grid from a hash of the seed string
function Identicon({ seed = "seba", size = 120, accent }) {
  // simple string hash
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // derive 25 cells (5x5), symmetric around x
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
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <rect width={size} height={size} fill="oklch(0.18 0.012 250)"/>
      {cells.map(({ r, c, on }, i) => {
        if (!on) return null;
        return (
          <g key={i}>
            <rect x={c * cell} y={r * cell} width={cell} height={cell} fill={color}/>
            {c < 2 && <rect x={(4 - c) * cell} y={r * cell} width={cell} height={cell} fill={color}/>}
          </g>
        );
      })}
    </svg>
  );
}

function AboutPage() {
  // Tool aggregation for the "daily drivers" strip
  const daily = ALL_TOOLS.filter(t => t.featured).slice(0, 6);

  return (
    <div style={{ maxWidth: 820 }}>
      {/* Header block */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: 28,
        alignItems: "center",
        paddingBottom: 28,
        marginBottom: 28,
        borderBottom: "2px solid var(--accent)",
      }}>
        <div style={{
          border: "1px solid var(--border)",
          borderRadius: 4,
          overflow: "hidden",
          flexShrink: 0,
        }}>
          <Identicon seed="sebabreguel" size={120}/>
        </div>

        <div>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 11,
            color: "var(--text-dim)", letterSpacing: 1.2,
            textTransform: "uppercase", marginBottom: 8,
          }}>
            About · maintainer
          </div>
          <h1 style={{
            fontFamily: "var(--display)", fontSize: 36,
            fontWeight: 600, letterSpacing: -0.8,
            margin: "0 0 8px", color: "var(--text)",
            lineHeight: 1.05,
          }}>
            Seba Breguel
          </h1>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 13,
            color: "var(--accent)",
          }}>
            software engineer · full-stack, leaning AI
          </div>
        </div>
      </div>

      {/* Bio */}
      <section style={{ marginBottom: 36 }}>
        <FieldLabel>Bio</FieldLabel>
        <p style={{
          fontFamily: "var(--prose)", fontSize: 17,
          lineHeight: 1.6, color: "var(--text)",
          margin: "0 0 14px",
          maxWidth: "60ch",
          textWrap: "pretty",
        }}>
          I build software that leans on AI as a collaborator rather than a
          crutch. Most days that means shipping product with
          <span style={{ color: "var(--accent)" }}> Claude Code</span> open
          in one pane, a terminal in another, and a running bet with myself
          over how small the diff can be.
        </p>
        <p style={{
          fontFamily: "var(--prose)", fontSize: 17,
          lineHeight: 1.6, color: "var(--text-muted)",
          margin: "0 0 14px",
          maxWidth: "60ch",
          textWrap: "pretty",
        }}>
          I care about tools that get out of the way, configs that travel
          across machines without drama, and the specific kind of joy that
          comes from a clean <code style={inlineCodeStyle}>git status</code>.
          This page is the long-form version of my <code style={inlineCodeStyle}>~/dotfiles</code>:
          what I reach for, and why.
        </p>
        <p style={{
          fontFamily: "var(--prose)", fontSize: 17,
          lineHeight: 1.6, color: "var(--text-muted)",
          margin: 0,
          maxWidth: "60ch",
          textWrap: "pretty",
        }}>
          Nothing here is permanent. Every tool on the list survived a
          two-week trial on my machine. Some made it years. Some got cut
          last weekend.
        </p>
      </section>

      {/* Daily drivers */}
      <section style={{ marginBottom: 36 }}>
        <FieldLabel>Daily drivers</FieldLabel>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 8,
        }}>
          {daily.map((t, i) => (
            <div key={i} style={{
              padding: "10px 12px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 3,
            }}>
              <div style={{
                fontFamily: "var(--display)", fontSize: 13,
                fontWeight: 600, color: "var(--text)",
              }}>{t.name}</div>
              <div style={{
                fontFamily: "var(--mono)", fontSize: 10,
                color: "var(--text-dim)", marginTop: 3,
              }}>{t.category.toLowerCase()}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Meta strip */}
      <section>
        <FieldLabel>Meta</FieldLabel>
        <div style={{
          fontFamily: "var(--mono)", fontSize: 12,
          color: "var(--text-muted)",
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "8px 24px",
          padding: "14px 16px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 3,
        }}>
          <span style={metaKey}>tools tracked</span>
          <span>{ALL_TOOLS.length}</span>
          <span style={metaKey}>last updated</span>
          <span>2026-04-17</span>
          <span style={metaKey}>machine</span>
          <span>macbook pro · m3 max · 36gb</span>
          <span style={metaKey}>shell</span>
          <span>zsh + zinit + starship</span>
          <span style={metaKey}>editor</span>
          <span>vs code + claude code (fallback: nvim)</span>
          <span style={metaKey}>source</span>
          <span><a href="#" onClick={e => e.preventDefault()} style={aboutLink}>github.com/sebabreguel/dotfiles ↗</a></span>
        </div>
      </section>
    </div>
  );
}

const inlineCodeStyle = {
  fontFamily: "var(--mono)",
  fontSize: "0.85em",
  padding: "2px 6px",
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 3,
  color: "var(--text)",
};

const metaKey = {
  color: "var(--text-dim)",
  letterSpacing: 0.4,
};

const aboutLink = {
  color: "var(--accent)",
  textDecoration: "none",
  borderBottom: "1px solid oklch(from var(--accent) l c h / 0.4)",
};

Object.assign(window, { AboutPage, Identicon });
