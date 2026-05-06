// Interactive "How it works" — clickable nested layers showing Claude Code ecosystem

const LAYERS = [
  {
    id: "agents",
    name: "Agents",
    tag: "background",
    desc: "Forked subagents with their own context window. Verify, research, parallelize without crowding the main chat.",
    examples: ["verifier", "researcher", "reviewer"],
    color: "oklch(0.76 0.12 60)",
  },
  {
    id: "skills",
    name: "Skills",
    tag: "on-demand",
    desc: "Prompt-level expertise loaded when relevant. Skills scale — only the ones Claude thinks it needs hit the context.",
    examples: ["frontend-design", "read-pdf", "pptx-export"],
    color: "oklch(0.76 0.13 160)",
  },
  {
    id: "plugins",
    name: "Plugins / MCP",
    tag: "always-on",
    desc: "MCP servers and plugins that expose tools and resources. Claude can reach them for as long as they're mounted.",
    examples: ["context7", "playwright", "filesystem"],
    color: "oklch(0.72 0.18 320)",
  },
  {
    id: "hooks",
    name: "Hooks",
    tag: "interceptors",
    desc: "Shell-level interceptors that run before, during, or after Claude actions. Cheapest layer — deterministic, no tokens.",
    examples: ["pre-commit-lint", "post-edit-format", "block-rm-rf"],
    color: "oklch(0.72 0.12 20)",
  },
  {
    id: "core",
    name: "Claude Code",
    tag: "runtime",
    desc: "The agentic coding CLI itself. Reads and writes files, runs commands, uses tools.",
    examples: ["claude", "claude /plan", "claude --resume"],
    color: "oklch(0.85 0.01 250)",
  },
];

const TABS = ["Overview", "Token Savings", "Hooks", "Plugins & MCP", "Skills", "Agents"];

function HowItWorks() {
  const [tab, setTab] = React.useState("Overview");
  const [active, setActive] = React.useState(null);

  return (
    <section style={{ marginTop: 48, marginBottom: 32 }}>
      <div style={{ marginBottom: 4 }}>
        <h2 style={{
          fontFamily: "var(--display)",
          fontSize: 22, fontWeight: 600,
          letterSpacing: -0.4, color: "var(--text)",
          margin: 0,
        }}>How it works</h2>
        <p style={{
          fontFamily: "var(--prose)", fontSize: 13,
          color: "var(--text-dim)", margin: "4px 0 18px",
        }}>Each layer of the ecosystem optimizes your development workflow.</p>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "6px 12px",
            background: tab === t ? "oklch(from var(--accent) 0.22 0.08 h)" : "transparent",
            border: `1px solid ${tab === t ? "var(--accent)" : "var(--border)"}`,
            color: tab === t ? "var(--accent)" : "var(--text-dim)",
            borderRadius: 3,
            fontFamily: "var(--mono)", fontSize: 11,
            cursor: "pointer",
            transition: "all 120ms",
          }}>{t}</button>
        ))}
      </div>

      <div style={{
        position: "relative",
        padding: "32px 28px",
        background: "oklch(0.16 0.02 275)",
        border: "1px solid var(--border)",
        borderRadius: 6,
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(oklch(0.22 0.02 275) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
          opacity: 0.4,
          pointerEvents: "none",
        }}/>

        <div style={{
          display: "grid",
          gridTemplateColumns: active ? "minmax(360px, 1fr) 280px" : "1fr",
          gap: 28,
          alignItems: "center",
          position: "relative",
          transition: "grid-template-columns 240ms ease",
        }}>
          <NestedLayers layers={LAYERS} active={active} setActive={setActive}/>
          {active && <LayerPanel layer={LAYERS.find(l => l.id === active)}/>}
        </div>
      </div>

      <div style={{
        marginTop: 14, textAlign: "center",
        fontFamily: "var(--mono)", fontSize: 11,
        color: "var(--text-dim)",
      }}>
        {active
          ? <span>Click the active layer to collapse · click another to switch</span>
          : <span>Click any layer to see what it does · 4 layers amplify Claude Code</span>
        }
      </div>
    </section>
  );
}

// Concentric nested boxes — each layer wraps the next via padding
function NestedLayers({ layers, active, setActive }) {
  const onClick = (id, e) => {
    e.stopPropagation();
    setActive(active === id ? null : id);
  };

  // Recursive render
  const renderLayer = (idx) => {
    if (idx >= layers.length) return null;
    const layer = layers[idx];
    const isCore = layer.id === "core";
    const isActive = active === layer.id;
    const dimmed = active && !isActive;

    const pad = isCore ? "14px 22px" : "22px 20px 16px";

    return (
      <div
        onClick={(e) => onClick(layer.id, e)}
        style={{
          position: "relative",
          padding: pad,
          border: `1px solid ${isActive ? layer.color : `oklch(from ${layer.color} l c h / 0.55)`}`,
          background: isActive
            ? `oklch(from ${layer.color} 0.22 0.05 h / 0.6)`
            : "transparent",
          borderRadius: 4,
          cursor: "pointer",
          transition: "all 220ms cubic-bezier(0.2, 0.9, 0.3, 1)",
          opacity: dimmed ? 0.4 : 1,
          boxShadow: isActive
            ? `0 0 0 2px oklch(from ${layer.color} l c h / 0.18)`
            : "none",
          display: "grid", placeItems: "center",
        }}
      >
        {!isCore && (
          <div style={{
            position: "absolute", top: -9, left: 14,
            padding: "0 8px",
            background: "oklch(0.16 0.02 275)",
            fontFamily: "var(--mono)", fontSize: 11,
            color: layer.color, letterSpacing: 0.4,
          }}>
            {layer.name}
          </div>
        )}
        {!isCore && (
          <div style={{
            position: "absolute", top: -9, right: 14,
            padding: "0 8px",
            background: "oklch(0.16 0.02 275)",
            fontFamily: "var(--mono)", fontSize: 10,
            color: "var(--text-dim)", fontStyle: "italic",
          }}>
            {layer.tag}
          </div>
        )}
        {isCore ? (
          <div style={{
            padding: "10px 22px",
            background: `oklch(from ${layer.color} 0.24 0.02 h)`,
            border: `1px solid oklch(from ${layer.color} l c h / 0.5)`,
            borderRadius: 3,
            fontFamily: "var(--mono)", fontSize: 13,
            color: layer.color,
            letterSpacing: 0.2,
          }}>
            {layer.name}
          </div>
        ) : (
          renderLayer(idx + 1)
        )}
      </div>
    );
  };

  return (
    <div style={{
      display: "grid", placeItems: "center",
      padding: "10px 6px 20px",
      minHeight: 360,
    }}>
      {renderLayer(0)}
    </div>
  );
}

function LayerPanel({ layer }) {
  if (!layer) return null;
  return (
    <div style={{
      padding: "20px 22px",
      background: "var(--surface)",
      border: `1px solid ${layer.color}`,
      borderRadius: 4,
      animation: "fadeInUp 220ms ease-out",
      position: "relative", zIndex: 1,
    }}>
      <div style={{
        fontFamily: "var(--mono)", fontSize: 10,
        color: layer.color, letterSpacing: 1.2,
        textTransform: "uppercase", marginBottom: 6,
      }}>
        Layer · {layer.tag}
      </div>
      <h3 style={{
        fontFamily: "var(--display)", fontSize: 20,
        fontWeight: 600, letterSpacing: -0.3,
        color: "var(--text)", margin: "0 0 10px",
      }}>{layer.name}</h3>
      <p style={{
        fontFamily: "var(--prose)", fontSize: 13,
        lineHeight: 1.5, color: "var(--text-muted)",
        margin: "0 0 14px",
      }}>{layer.desc}</p>
      <div style={{
        fontFamily: "var(--mono)", fontSize: 10,
        color: "var(--text-dim)", letterSpacing: 1.2,
        textTransform: "uppercase", marginBottom: 6,
      }}>Examples</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {layer.examples.map((ex, i) => (
          <div key={i} style={{
            fontFamily: "var(--mono)", fontSize: 12,
            color: "var(--text)",
            padding: "6px 10px",
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 3,
          }}>
            <span style={{ color: layer.color }}>▸</span> {ex}
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { HowItWorks, LAYERS });
