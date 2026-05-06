// Detail drawer — shown on right when a tool card is clicked

function DetailDrawer({ tool, onClose }) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!tool) return null;

  const copyInstall = () => {
    navigator.clipboard?.writeText(tool.install);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const related = (tool.related || []).map(name =>
    ALL_TOOLS.find(t => t.name === name)
  ).filter(Boolean);

  return (
    <>
      {/* scrim */}
      <div onClick={onClose} style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(2px)",
        zIndex: 50,
        animation: "fadeIn 160ms ease-out",
      }}/>
      <aside style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: 480, maxWidth: "90vw",
        background: "var(--surface)",
        borderLeft: "1px solid var(--border-hi)",
        zIndex: 51,
        display: "flex", flexDirection: "column",
        animation: "slideIn 220ms cubic-bezier(0.2, 0.9, 0.3, 1)",
        boxShadow: "-30px 0 60px rgba(0,0,0,0.4)",
      }}>
        {/* header */}
        <div style={{
          padding: "20px 28px",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "flex-start", gap: 16,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 10,
              color: "var(--text-dim)", letterSpacing: 1.2,
              textTransform: "uppercase", marginBottom: 6,
            }}>
              {tool.category} · {tool.group}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h2 style={{
                fontFamily: "var(--display)",
                fontSize: 24, fontWeight: 600,
                letterSpacing: -0.5, margin: 0,
                color: "var(--text)",
              }}>{tool.name}</h2>
              {tool.badges.map((b, i) => <Badge key={i} kind={b}/>)}
              {(tool.tags || []).map((t, i) => <Tag key={i}>{t}</Tag>)}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent", border: "1px solid var(--border)",
              width: 28, height: 28, borderRadius: 3,
              color: "var(--text-dim)", cursor: "pointer",
              display: "grid", placeItems: "center",
            }}
          ><Icon.Close/></button>
        </div>

        {/* body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "22px 28px 32px" }}>
          <p style={{
            fontFamily: "var(--prose)", fontSize: 15, lineHeight: 1.55,
            color: "var(--text)", margin: "0 0 18px",
          }}>
            {tool.desc}
          </p>

          {tool.note && (
            <div style={{
              borderLeft: "2px solid var(--accent)",
              padding: "12px 16px",
              background: "oklch(from var(--accent) 0.22 0.04 h)",
              fontFamily: "var(--prose)", fontSize: 14,
              color: "var(--text-muted)",
              fontStyle: "italic", lineHeight: 1.55,
              marginBottom: 24,
              borderRadius: "0 3px 3px 0",
            }}>
              {tool.note}
            </div>
          )}

          <FieldLabel>Install</FieldLabel>
          <div style={{
            display: "flex", alignItems: "center",
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 3,
            marginBottom: 22,
          }}>
            <div style={{
              flex: 1, padding: "10px 14px",
              fontFamily: "var(--mono)", fontSize: 12,
              color: "var(--text)",
              overflowX: "auto", whiteSpace: "nowrap",
            }}>
              <span style={{ color: "var(--accent)" }}>$ </span>{tool.install}
            </div>
            <button onClick={copyInstall} style={{
              border: "none",
              borderLeft: "1px solid var(--border)",
              background: "transparent",
              padding: "10px 14px", cursor: "pointer",
              color: copied ? "oklch(0.82 0.14 150)" : "var(--text-dim)",
              display: "flex", alignItems: "center", gap: 6,
              fontFamily: "var(--mono)", fontSize: 11,
              transition: "color 150ms",
            }}>
              {copied ? <><Icon.Check/> copied</> : <><Icon.Copy/> copy</>}
            </button>
          </div>

          <FieldLabel>Website</FieldLabel>
          <a href="#" onClick={e => e.preventDefault()} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontFamily: "var(--mono)", fontSize: 12,
            color: "var(--accent)", textDecoration: "none",
            marginBottom: 22,
            borderBottom: "1px solid oklch(from var(--accent) l c h / 0.4)",
            paddingBottom: 1,
          }}>
            {tool.site} <Icon.Arrow/>
          </a>

          {related.length > 0 && (
            <>
              <FieldLabel>Related</FieldLabel>
              <div style={{ display: "grid", gap: 6, marginBottom: 22 }}>
                {related.map((r, i) => (
                  <div key={i} style={{
                    padding: "10px 12px",
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    borderRadius: 3,
                  }}>
                    <div style={{
                      fontFamily: "var(--display)", fontSize: 13,
                      fontWeight: 600, color: "var(--text)",
                      marginBottom: 3,
                    }}>{r.name}</div>
                    <div style={{
                      fontFamily: "var(--prose)", fontSize: 12,
                      color: "var(--text-dim)", lineHeight: 1.4,
                    }}>{r.desc}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          <FieldLabel>Metadata</FieldLabel>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 11,
            color: "var(--text-dim)",
            display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 16px",
          }}>
            <span>category</span><span style={{ color: "var(--text-muted)" }}>{tool.category.toLowerCase()}</span>
            <span>group</span><span style={{ color: "var(--text-muted)" }}>{tool.group.toLowerCase()}</span>
            <span>tags</span><span style={{ color: "var(--text-muted)" }}>[{(tool.tags || []).join(", ")}]</span>
            <span>badges</span><span style={{ color: "var(--text-muted)" }}>[{tool.badges.map(b => b.toLowerCase()).join(", ")}]</span>
          </div>
        </div>
      </aside>
    </>
  );
}

function FieldLabel({ children }) {
  return (
    <div style={{
      fontFamily: "var(--mono)", fontSize: 10,
      color: "var(--text-dim)", letterSpacing: 1.2,
      textTransform: "uppercase", marginBottom: 8,
    }}>{children}</div>
  );
}

Object.assign(window, { DetailDrawer });
