// All-tools index view — flat, dense, searchable

function AllToolsView({ query, onOpen }) {
  const filter = (tool) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return tool.name.toLowerCase().includes(q)
      || tool.desc.toLowerCase().includes(q)
      || (tool.tags || []).some(t => t.toLowerCase().includes(q));
  };

  const sections = CATEGORIES.map(cat => {
    const catData = DATA[cat];
    const tools = [];
    for (const [, groupTools] of Object.entries(catData.groups)) {
      for (const t of groupTools) if (filter(t)) tools.push(t);
    }
    return { cat, tools, total: catData.count };
  }).filter(s => s.tools.length > 0);

  const totalMatches = sections.reduce((s, x) => s + x.tools.length, 0);

  return (
    <div>
      {/* Hero header */}
      <div style={{
        paddingBottom: 20, marginBottom: 20,
        borderBottom: "2px solid var(--accent)",
        display: "flex", alignItems: "baseline", gap: 20, flexWrap: "wrap",
      }}>
        <h1 style={{
          fontFamily: "var(--display)", fontSize: 30,
          fontWeight: 600, letterSpacing: -0.7,
          margin: 0, color: "var(--text)",
          lineHeight: 1.1,
        }}>All tools</h1>
        <span style={{
          fontFamily: "var(--mono)", fontSize: 12,
          color: "var(--text-dim)",
        }}>{String(totalMatches).padStart(3, "0")} · across {sections.length} categories</span>
        <div style={{ flex: 1 }}/>
        <div style={{
          fontFamily: "var(--mono)", fontSize: 11,
          color: "var(--text-dim)",
        }}>
          {query ? <>filtered by "<span style={{ color: "var(--accent)" }}>{query}</span>"</> : "the full index"}
        </div>
      </div>

      {/* Category jump nav */}
      {!query && (
        <div style={{
          display: "flex", gap: 6, flexWrap: "wrap",
          marginBottom: 28,
        }}>
          {sections.map(s => (
            <a key={s.cat} href={`#cat-${s.cat.replace(/\s/g, "-")}`} style={{
              padding: "5px 10px",
              border: "1px solid var(--border)",
              borderRadius: 3,
              fontFamily: "var(--mono)", fontSize: 11,
              color: "var(--text-muted)",
              textDecoration: "none",
              background: "var(--surface)",
            }}>
              {s.cat} <span style={{ color: "var(--text-dim)", marginLeft: 4 }}>{String(s.tools.length).padStart(2, "0")}</span>
            </a>
          ))}
        </div>
      )}

      {sections.map(({ cat, tools, total }) => (
        <section key={cat} id={`cat-${cat.replace(/\s/g, "-")}`} style={{ marginBottom: 36 }}>
          <div style={{
            display: "flex", alignItems: "baseline", gap: 10,
            paddingBottom: 10, marginBottom: 12,
            borderBottom: "1px solid var(--border)",
          }}>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 10,
              color: "var(--text-dim)", letterSpacing: 1.4,
              textTransform: "uppercase",
            }}>category</div>
            <h2 style={{
              fontFamily: "var(--display)", fontSize: 16,
              fontWeight: 600, letterSpacing: -0.2,
              margin: 0, color: "var(--text)",
            }}>{cat}</h2>
            <span style={{
              fontFamily: "var(--mono)", fontSize: 11,
              color: "var(--text-dim)",
            }}>
              {String(tools.length).padStart(2, "0")}{query ? ` / ${String(total).padStart(2, "0")}` : ""}
            </span>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 8,
          }}>
            {tools.map((t, i) => <FlatCard key={i} tool={t} onClick={onOpen}/>)}
          </div>
        </section>
      ))}

      {sections.length === 0 && (
        <div style={{
          padding: 60, textAlign: "center",
          fontFamily: "var(--mono)", fontSize: 12,
          color: "var(--text-dim)",
        }}>
          No matches for "{query}"
        </div>
      )}
    </div>
  );
}

function FlatCard({ tool, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={() => onClick(tool)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "12px 14px 10px",
        background: hover ? "var(--surface-hi)" : "var(--surface)",
        border: `1px solid ${hover ? "var(--border-hi)" : "var(--border)"}`,
        borderRadius: 3,
        cursor: "pointer",
        transition: "background 120ms, border-color 120ms",
        display: "flex", flexDirection: "column", gap: 6,
        minHeight: 86,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6 }}>
        <div style={{
          fontFamily: "var(--display)", fontSize: 13, fontWeight: 600,
          color: "var(--text)", letterSpacing: -0.1, lineHeight: 1.2,
        }}>
          {tool.name}
        </div>
        <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
          {tool.badges.slice(0, 1).map((b, i) => <Badge key={i} kind={b}/>)}
        </div>
      </div>
      <div style={{
        fontFamily: "var(--prose)", fontSize: 12,
        color: "var(--text-dim)", lineHeight: 1.45,
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>
        {tool.desc}
      </div>
    </div>
  );
}

Object.assign(window, { AllToolsView, FlatCard });
