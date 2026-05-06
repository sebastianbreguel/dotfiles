// V1 Catalog — mixed density, featured + dense tiles per category

function ToolCard({ tool, onClick, featured = false }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={() => onClick(tool)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        gridColumn: featured ? "span 2" : "span 1",
        gridRow: featured ? "span 2" : "span 1",
        padding: featured ? "22px 22px 20px" : "14px 14px 12px",
        background: hover ? "var(--surface-hi)" : "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 4,
        cursor: "pointer",
        transition: "background 120ms, border-color 120ms, transform 120ms",
        borderColor: hover ? "var(--border-hi)" : "var(--border)",
        display: "flex", flexDirection: "column", gap: featured ? 10 : 6,
        minHeight: featured ? 180 : 100,
        overflow: "hidden",
      }}
    >
      {/* accent corner on featured */}
      {featured && (
        <div style={{
          position: "absolute", top: 0, left: 0, width: 3, height: 28,
          background: "var(--accent)",
        }}/>
      )}

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div style={{
          fontFamily: "var(--display)",
          fontWeight: 600,
          fontSize: featured ? 20 : 14,
          color: "var(--text)",
          letterSpacing: featured ? -0.3 : -0.1,
          lineHeight: 1.2,
        }}>
          {tool.name}
        </div>
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          {tool.badges.map((b, i) => <Badge key={i} kind={b}/>)}
        </div>
      </div>

      <div style={{
        fontFamily: featured ? "var(--prose)" : "var(--prose)",
        fontSize: featured ? 14 : 12,
        color: "var(--text-dim)",
        lineHeight: 1.5,
        flex: featured ? 0 : 1,
      }}>
        {tool.desc}
      </div>

      {featured && tool.note && (
        <div style={{
          borderLeft: "2px solid var(--accent)",
          paddingLeft: 12,
          fontFamily: "var(--prose)", fontSize: 13,
          color: "var(--text-muted)",
          fontStyle: "italic",
          lineHeight: 1.5,
        }}>
          {tool.note}
        </div>
      )}

      {featured && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: "auto" }}>
          {(tool.tags || []).map((t, i) => <Tag key={i}>{t}</Tag>)}
        </div>
      )}

      {/* install preview strip */}
      {featured && (
        <div style={{
          marginTop: 8,
          padding: "8px 10px",
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: 3,
          fontFamily: "var(--mono)", fontSize: 11,
          color: "var(--text-muted)",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          <span style={{ color: "var(--accent)" }}>$</span> {tool.install}
        </div>
      )}
    </div>
  );
}

function CategoryBlock({ title, tools, onOpen }) {
  // pick first featured or fallback none
  const featured = tools.find(t => t.featured);
  const rest = tools.filter(t => t !== featured);
  return (
    <section style={{ marginBottom: 32 }}>
      <SectionLabel label={title} count={tools.length}/>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 10,
        gridAutoFlow: "dense",
      }}>
        {featured && <ToolCard tool={featured} onClick={onOpen} featured/>}
        {rest.map((t, i) => <ToolCard key={i} tool={t} onClick={onOpen}/>)}
      </div>
    </section>
  );
}

function CatalogView({ activeCat, query, onOpen }) {
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

  return (
    <div>
      <CategoryHeader title={activeCat} count={catData.count}/>
      {groups.map(([title, tools]) => (
        <CategoryBlock key={title} title={title} tools={tools} onOpen={onOpen}/>
      ))}
      {groups.length === 0 && (
        <div style={{
          padding: 60, textAlign: "center",
          fontFamily: "var(--mono)", fontSize: 12,
          color: "var(--text-dim)",
        }}>
          No results for "{query}"
        </div>
      )}
    </div>
  );
}

function CategoryHeader({ title, count }) {
  return (
    <div style={{
      paddingTop: 4,
      marginBottom: 8,
    }}>
      <div style={{
        display: "flex", alignItems: "baseline", gap: 16,
        paddingBottom: 16,
      }}>
        <h1 style={{
          fontFamily: "var(--display)",
          fontSize: 30, fontWeight: 600,
          letterSpacing: -0.8,
          color: "var(--text)",
          margin: 0,
          lineHeight: 1.1,
        }}>{title}</h1>
        <span style={{
          fontFamily: "var(--mono)", fontSize: 12,
          color: "var(--text-dim)",
        }}>{String(count).padStart(2, "0")}</span>
      </div>
      <div style={{ height: 2, background: "var(--accent)" }}/>
    </div>
  );
}

Object.assign(window, { ToolCard, CategoryBlock, CatalogView, CategoryHeader });
