import { useState } from 'react';
import { DATA } from '../data';
import { Badge } from './Primitives';

const ACTIVE_BG = "oklch(from var(--accent) 0.22 0.05 h)";

function TerminalRow({ tool, onClick, isSelected }) {
  const [hover, setHover] = useState(false);
  const hi = hover || isSelected;
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="grid items-center cursor-pointer font-mono text-xs text-text px-2.5 py-2 gap-3 transition-colors"
      style={{
        gridTemplateColumns: "22px 180px 90px 1fr auto",
        background: hi ? ACTIVE_BG : "transparent",
        borderLeft: `2px solid ${hi ? "var(--accent)" : "transparent"}`,
        borderBottom: "1px solid oklch(0.20 0.01 250)",
      }}
    >
      <span style={{ color: hi ? "var(--accent)" : "var(--text-dim)" }}>
        {hi ? "›" : "·"}
      </span>
      <span className="font-medium" style={{ color: hi ? "var(--accent)" : "var(--text)" }}>
        {tool.name}
      </span>
      <span>
        {tool.badges?.[0] ? <Badge kind={tool.badges[0]} /> : <span className="text-text-dim">—</span>}
      </span>
      <span className="text-text-muted overflow-hidden text-ellipsis whitespace-nowrap">
        {tool.desc}
      </span>
      <span className="flex gap-1">
        {(tool.tags || []).slice(0, 2).map((t, i) => (
          <span key={i} className="text-text-dim text-[11px]">#{t}</span>
        ))}
      </span>
    </div>
  );
}

function TerminalGroup({ title, tools, activeCat, onOpen, selected }) {
  const enrich = (t) => onOpen({ ...t, category: activeCat, group: title });
  return (
    <div className="mb-5">
      <div className="font-mono text-[11px] tracking-wider uppercase pt-2.5 pb-1.5 flex items-center gap-2" style={{ color: "var(--accent)" }}>
        <span>▸ {title}</span>
        <span className="text-text-dim opacity-70">({String(tools.length).padStart(2, "0")})</span>
        <div className="flex-1 h-px bg-border" />
      </div>
      <div
        className="grid gap-3 px-2.5 py-1.5 text-[10px] text-text-dim tracking-wide uppercase border-b border-dashed border-border"
        style={{ gridTemplateColumns: "22px 180px 90px 1fr auto" }}
      >
        <span></span><span>name</span><span>type</span><span>description</span><span>tags</span>
      </div>
      {tools.map((t, i) => (
        <TerminalRow
          key={i}
          tool={t}
          onClick={() => enrich(t)}
          isSelected={selected && selected.name === t.name}
        />
      ))}
    </div>
  );
}

export default function TerminalView({ activeCat, query, onOpen, selectedTool }) {
  const catData = DATA[activeCat];
  if (!catData) return null;

  const filter = (tool) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return tool.name.toLowerCase().includes(q)
      || tool.desc?.toLowerCase().includes(q)
      || (tool.tags || []).some((t) => t.toLowerCase().includes(q));
  };

  const groups = Object.entries(catData.groups)
    .map(([title, tools]) => [title, tools.filter(filter)])
    .filter(([, tools]) => tools.length > 0);

  const total = groups.reduce((s, [, t]) => s + t.length, 0);

  return (
    <div className="font-mono text-[13px] text-text">
      <div className="flex items-center gap-2 pb-3.5 mb-4 text-[11px] text-text-dim border-b border-dashed border-border">
        <span style={{ color: "var(--accent)" }}>~/dotfiles</span>
        <span>/</span>
        <span className="text-text">{catData.slug}</span>
        <span className="ml-auto">{total} items</span>
      </div>

      <div className="font-mono text-[11px] text-text-dim mb-2 leading-snug overflow-hidden text-ellipsis whitespace-nowrap">
        {`┌─ ${activeCat.toUpperCase()} ${"─".repeat(Math.max(0, 60 - activeCat.length))}┐`}
      </div>
      <div className="flex items-baseline gap-3 pb-3.5">
        <h1
          className="text-[28px] font-semibold m-0 -tracking-[0.6px] text-text"
          style={{ fontFamily: "var(--display)" }}
        >
          {activeCat}
        </h1>
        <span className="font-mono text-xs" style={{ color: "var(--accent)" }}>
          {String(catData.count).padStart(2, "0")}
        </span>
      </div>

      {groups.map(([title, tools]) => (
        <TerminalGroup key={title} title={title} tools={tools} activeCat={activeCat} onOpen={onOpen} selected={selectedTool} />
      ))}

      {groups.length === 0 && (
        <div className="py-10 text-center text-text-dim">
          <span style={{ color: "var(--accent)" }}>grep:</span> no matches for "{query}"
        </div>
      )}
    </div>
  );
}
