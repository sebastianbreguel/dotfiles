// App shell — top bar, left nav, main, tweaks

function Sidebar({ activeCat, setActiveCat }) {
  return (
    <nav style={{
      width: 220, flexShrink: 0,
      borderRight: "1px solid var(--border)",
      padding: "24px 16px",
      display: "flex", flexDirection: "column", gap: 2,
      background: "var(--bg)",
      height: "100vh",
      position: "sticky", top: 0,
      overflowY: "auto",
      whiteSpace: "nowrap",
    }}>
      <div style={{
        fontFamily: "var(--mono)", fontSize: 10,
        color: "var(--text-dim)", letterSpacing: 1.4,
        textTransform: "uppercase",
        padding: "0 10px 12px",
      }}>Index</div>

      <button
        onClick={() => setActiveCat("__about")}
        style={{
          textAlign: "left", padding: "8px 10px",
          background: activeCat === "__about" ? "oklch(from var(--accent) 0.22 0.05 h)" : "transparent",
          border: "none", borderRadius: 3, cursor: "pointer",
          color: activeCat === "__about" ? "var(--accent)" : "var(--text)",
          fontFamily: "var(--display)", fontSize: 13, fontWeight: 500,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 2,
        }}
      >
        <span>About</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-dim)", letterSpacing: 0.6 }}>
          $whoami
        </span>
      </button>

      <button
        onClick={() => setActiveCat("__all")}
        style={{
          textAlign: "left", padding: "8px 10px",
          background: activeCat === "__all" ? "oklch(from var(--accent) 0.22 0.05 h)" : "transparent",
          border: "none", borderRadius: 3, cursor: "pointer",
          color: activeCat === "__all" ? "var(--accent)" : "var(--text)",
          fontFamily: "var(--display)", fontSize: 13, fontWeight: 500,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <span>All tools</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-dim)" }}>
          {ALL_TOOLS.length}
        </span>
      </button>

      <div style={{ height: 1, background: "var(--border)", margin: "8px 10px 8px" }}/>

      {CATEGORIES.map(cat => {
        const isActive = activeCat === cat;
        return (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            style={{
              textAlign: "left", padding: "7px 10px",
              background: isActive ? "oklch(from var(--accent) 0.22 0.05 h)" : "transparent",
              border: "none", borderRadius: 3, cursor: "pointer",
              color: isActive ? "var(--accent)" : "var(--text)",
              fontFamily: "var(--display)", fontSize: 13,
              fontWeight: isActive ? 500 : 400,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              transition: "background 120ms",
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--surface)"; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
          >
            <span>{cat}</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-dim)" }}>
              {DATA[cat].count}
            </span>
          </button>
        );
      })}

      <div style={{ flex: 1 }}/>

      <div style={{
        fontFamily: "var(--mono)", fontSize: 10,
        color: "var(--text-dim)", lineHeight: 1.6,
        padding: 10, borderTop: "1px solid var(--border)",
        marginTop: 20,
      }}>
        <div style={{ color: "var(--text-muted)", marginBottom: 4 }}>dotfiles v2.1</div>
        <div>updated 2026-04-17</div>
        <div>maintained by @seba</div>
      </div>
    </nav>
  );
}

function TopBar({ query, setQuery, view, setView }) {
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 10,
      padding: "14px 32px",
      background: "oklch(from var(--bg) l c h / 0.85)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", gap: 20,
    }}>
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: "var(--accent)",
          boxShadow: "0 0 12px var(--accent)",
        }}/>
        <span style={{
          fontFamily: "var(--display)", fontSize: 15,
          fontWeight: 600, color: "var(--text)",
          letterSpacing: -0.2,
        }}>dotfiles</span>
        <span style={{
          fontFamily: "var(--mono)", fontSize: 10,
          color: "var(--text-dim)", letterSpacing: 0.6,
        }}>sebabreguel-setup.vercel.app</span>
      </div>

      {/* Segmented view toggle */}
      <div style={{
        display: "flex",
        border: "1px solid var(--border)", borderRadius: 3,
        overflow: "hidden", marginLeft: 8,
      }}>
        {["catalog", "terminal"].map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: "6px 12px",
            background: view === v ? "oklch(from var(--accent) 0.22 0.06 h)" : "transparent",
            border: "none",
            color: view === v ? "var(--accent)" : "var(--text-dim)",
            fontFamily: "var(--mono)", fontSize: 11, cursor: "pointer",
            letterSpacing: 0.4,
          }}>{v}</button>
        ))}
      </div>

      <div style={{ flex: 1 }}/>

      {/* Search */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "7px 12px",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 3,
        width: 280,
        color: "var(--text-dim)",
      }}>
        <Icon.Search/>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search tools..."
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            fontFamily: "var(--prose)", fontSize: 13, color: "var(--text)",
          }}
        />
        <span style={{
          fontFamily: "var(--mono)", fontSize: 10,
          padding: "1px 5px", border: "1px solid var(--border)",
          borderRadius: 2, color: "var(--text-dim)",
        }}>/</span>
      </div>
    </header>
  );
}

function TweaksPanel({ accent, setAccent, onClose }) {
  const swatches = [
    { name: "indigo",  val: "oklch(0.68 0.17 252)" },
    { name: "cyan",    val: "oklch(0.72 0.12 200)" },
    { name: "green",   val: "oklch(0.76 0.16 150)" },
    { name: "amber",   val: "oklch(0.80 0.14 70)" },
    { name: "coral",   val: "oklch(0.72 0.16 25)" },
    { name: "violet",  val: "oklch(0.70 0.18 300)" },
    { name: "rose",    val: "oklch(0.72 0.17 350)" },
    { name: "white",   val: "oklch(0.90 0.01 250)" },
  ];

  return (
    <div style={{
      position: "fixed", bottom: 20, right: 20,
      width: 260,
      background: "var(--surface)",
      border: "1px solid var(--border-hi)",
      borderRadius: 4,
      padding: 16,
      zIndex: 100,
      fontFamily: "var(--mono)",
      boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 12,
      }}>
        <div style={{
          fontSize: 10, letterSpacing: 1.4,
          color: "var(--text-dim)", textTransform: "uppercase",
        }}>Tweaks</div>
        <button onClick={onClose} style={{
          background: "transparent", border: "1px solid var(--border)",
          width: 22, height: 22, borderRadius: 3,
          color: "var(--text-dim)", cursor: "pointer",
          display: "grid", placeItems: "center",
        }}><Icon.Close/></button>
      </div>

      <div style={{
        fontSize: 11, color: "var(--text-muted)", marginBottom: 8,
      }}>Accent color</div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6,
      }}>
        {swatches.map(s => (
          <button key={s.name}
            onClick={() => setAccent(s.val)}
            title={s.name}
            style={{
              aspectRatio: "1",
              background: s.val,
              border: accent === s.val ? "2px solid var(--text)" : "1px solid var(--border)",
              borderRadius: 3,
              cursor: "pointer",
              padding: 0,
              boxShadow: accent === s.val ? `0 0 0 2px var(--bg), 0 0 0 3px ${s.val}` : "none",
            }}
          />
        ))}
      </div>

      <div style={{
        fontSize: 10, color: "var(--text-dim)", marginTop: 12,
        lineHeight: 1.5,
      }}>
        Click a swatch to change the accent used throughout the design.
      </div>
    </div>
  );
}

Object.assign(window, { Sidebar, TopBar, TweaksPanel });
