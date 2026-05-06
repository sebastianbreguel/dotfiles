// V2 Terminal — single-pane, ASCII-chromed, every card looks like a listing row

function TerminalView({ activeCat, query, onOpen, selectedTool }) {
  const catData = DATA[activeCat];
  if (!catData) return null;

  const filter = (tool) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return tool.name.toLowerCase().includes(q)
      || tool.desc.toLowerCase().includes(q)
      || (tool.tags || []).some(t => t.toLowerCase().includes(q));
  };

  const groups = Object.entries(catData.groups)
    .map(([title, tools]) => [title, tools.filter(filter)])
    .filter(([, tools]) => tools.length > 0);

  const total = groups.reduce((s, [, t]) => s + t.length, 0);

  return (
    <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--text)" }}>
      {/* Path/status bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "2px 0 14px",
        fontSize: 11, color: "var(--text-dim)",
        borderBottom: "1px dashed var(--border)",
        marginBottom: 16,
      }}>
        <span style={{ color: "var(--accent)" }}>~/dotfiles</span>
        <span>/</span>
        <span style={{ color: "var(--text)" }}>{catData.slug}</span>
        <span style={{ marginLeft: "auto" }}>{total} items</span>
      </div>

      {/* Big header */}
      <div style={{
        fontFamily: "var(--mono)",
        fontSize: 11, color: "var(--text-dim)",
        margin: "0 0 8px", lineHeight: 1.3,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {`┌─ ${activeCat.toUpperCase()} ${"─".repeat(Math.max(0, 60 - activeCat.length))}┐`}
      </div>
      <div style={{
        display: "flex", alignItems: "baseline", gap: 12,
        padding: "0 0 14px",
      }}>
        <h1 style={{
          fontFamily: "var(--display)", fontSize: 28,
          fontWeight: 600, margin: 0,
          letterSpacing: -0.6, color: "var(--text)",
        }}>{activeCat}</h1>
        <span style={{ color: "var(--accent)", fontFamily: "var(--mono)", fontSize: 12 }}>
          {String(catData.count).padStart(2, "0")}
        </span>
      </div>

      {/* Group tables */}
      {groups.map(([title, tools]) => (
        <TerminalGroup key={title} title={title} tools={tools} onOpen={onOpen} selected={selectedTool}/>
      ))}

      {groups.length === 0 && (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text-dim)" }}>
          <span style={{ color: "var(--accent)" }}>grep:</span> no matches for "{query}"
        </div>
      )}
    </div>
  );
}

function TerminalGroup({ title, tools, onOpen, selected }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{
        fontFamily: "var(--mono)", fontSize: 11,
        color: "var(--accent)", letterSpacing: 1.4,
        textTransform: "uppercase",
        padding: "10px 0 6px",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span>▸ {title}</span>
        <span style={{ color: "var(--text-dim)", opacity: 0.7 }}>
          ({String(tools.length).padStart(2, "0")})
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--border)" }}/>
      </div>

      {/* column headers */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "22px 180px 90px 1fr auto",
        gap: 12,
        padding: "6px 10px",
        fontSize: 10, color: "var(--text-dim)",
        letterSpacing: 0.8,
        textTransform: "uppercase",
        borderBottom: "1px dashed var(--border)",
      }}>
        <span></span>
        <span>name</span>
        <span>type</span>
        <span>description</span>
        <span>tags</span>
      </div>

      {tools.map((t, i) => (
        <TerminalRow key={i} tool={t} onClick={() => onOpen(t)} isSelected={selected && selected.name === t.name}/>
      ))}
    </div>
  );
}

function TerminalRow({ tool, onClick, isSelected }) {
  const [hover, setHover] = React.useState(false);
  const hi = hover || isSelected;
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "22px 180px 90px 1fr auto",
        gap: 12,
        padding: "9px 10px",
        alignItems: "center",
        background: hi ? "oklch(from var(--accent) 0.22 0.05 h)" : "transparent",
        borderLeft: `2px solid ${hi ? "var(--accent)" : "transparent"}`,
        cursor: "pointer",
        fontFamily: "var(--mono)", fontSize: 12,
        color: "var(--text)",
        borderBottom: "1px solid oklch(0.20 0.01 250)",
        transition: "background 120ms, border-color 120ms",
      }}
    >
      <span style={{ color: hi ? "var(--accent)" : "var(--text-dim)" }}>
        {hi ? "›" : "·"}
      </span>
      <span style={{ color: hi ? "var(--accent)" : "var(--text)", fontWeight: 500 }}>
        {tool.name}
      </span>
      <span>
        {tool.badges[0] ? <Badge kind={tool.badges[0]}/> : <span style={{ color: "var(--text-dim)" }}>—</span>}
      </span>
      <span style={{
        color: "var(--text-muted)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}>{tool.desc}</span>
      <span style={{ display: "flex", gap: 4 }}>
        {(tool.tags || []).slice(0, 2).map((t, i) => (
          <span key={i} style={{ color: "var(--text-dim)", fontSize: 11 }}>#{t}</span>
        ))}
      </span>
    </div>
  );
}

Object.assign(window, { TerminalView, TerminalGroup, TerminalRow });
