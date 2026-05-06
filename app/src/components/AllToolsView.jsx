import { useState } from 'react';
import { DATA, CATEGORIES } from '../data';
import { Badge } from './Primitives';

function FlatCard({ tool, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={() => onClick(tool)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="px-3.5 py-3 rounded-[3px] cursor-pointer flex flex-col gap-1.5 min-h-[86px] transition-colors"
      style={{
        background: hover ? "var(--surface-hi)" : "var(--surface)",
        border: `1px solid ${hover ? "var(--border-hi)" : "var(--border)"}`,
      }}
    >
      <div className="flex items-start justify-between gap-1.5">
        <div className="text-[13px] font-semibold text-text -tracking-[0.1px] leading-tight" style={{ fontFamily: "var(--display)" }}>
          {tool.name}
        </div>
        <div className="flex gap-0.5 flex-shrink-0">
          {(tool.badges || []).slice(0, 1).map((b, i) => <Badge key={i} kind={b} />)}
        </div>
      </div>
      <div
        className="text-xs text-text-dim leading-snug overflow-hidden"
        style={{
          fontFamily: "var(--prose)",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {tool.desc}
      </div>
    </div>
  );
}

export default function AllToolsView({ query, onOpen }) {
  const filter = (tool) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return tool.name.toLowerCase().includes(q)
      || tool.desc?.toLowerCase().includes(q)
      || (tool.tags || []).some((t) => t.toLowerCase().includes(q));
  };

  const sections = CATEGORIES.map((cat) => {
    const catData = DATA[cat];
    const tools = [];
    for (const [groupName, groupTools] of Object.entries(catData.groups)) {
      for (const t of groupTools) {
        if (filter(t)) tools.push({ ...t, category: cat, group: groupName });
      }
    }
    return { cat, tools, total: catData.count };
  }).filter((s) => s.tools.length > 0);

  const totalMatches = sections.reduce((s, x) => s + x.tools.length, 0);

  return (
    <div>
      <div
        className="flex items-baseline gap-5 flex-wrap pb-5 mb-5"
        style={{ borderBottom: "2px solid var(--accent)" }}
      >
        <h1
          className="text-3xl font-semibold -tracking-[0.7px] m-0 text-text leading-tight"
          style={{ fontFamily: "var(--display)" }}
        >
          All tools
        </h1>
        <span className="font-mono text-xs text-text-dim">
          {String(totalMatches).padStart(3, "0")} · across {sections.length} categories
        </span>
        <div className="flex-1" />
        <div className="font-mono text-[11px] text-text-dim">
          {query ? <>filtered by "<span style={{ color: "var(--accent)" }}>{query}</span>"</> : "the full index"}
        </div>
      </div>

      {!query && (
        <div className="flex gap-1.5 flex-wrap mb-7">
          {sections.map((s) => (
            <a
              key={s.cat}
              href={`#cat-${s.cat.replace(/\s/g, "-")}`}
              className="px-2.5 py-1 border border-border rounded-[3px] font-mono text-[11px] text-text-muted no-underline bg-surface"
            >
              {s.cat} <span className="text-text-dim ml-1">{String(s.tools.length).padStart(2, "0")}</span>
            </a>
          ))}
        </div>
      )}

      {sections.map(({ cat, tools, total }) => (
        <section key={cat} id={`cat-${cat.replace(/\s/g, "-")}`} className="mb-9">
          <div className="flex items-baseline gap-2.5 pb-2.5 mb-3 border-b border-border">
            <div className="font-mono text-[10px] text-text-dim tracking-wider uppercase">
              category
            </div>
            <h2
              className="text-base font-semibold -tracking-[0.2px] m-0 text-text"
              style={{ fontFamily: "var(--display)" }}
            >
              {cat}
            </h2>
            <span className="font-mono text-[11px] text-text-dim">
              {String(tools.length).padStart(2, "0")}{query ? ` / ${String(total).padStart(2, "0")}` : ""}
            </span>
          </div>
          <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            {tools.map((t, i) => <FlatCard key={i} tool={t} onClick={onOpen} />)}
          </div>
        </section>
      ))}

      {sections.length === 0 && (
        <div className="py-16 text-center font-mono text-xs text-text-dim">
          No matches for "{query}"
        </div>
      )}
    </div>
  );
}
