import { useState } from 'react';
import { DATA } from '../data';
import { Badge, Tag, SectionLabel } from './Primitives';

function ToolCard({ tool, onClick, featured = false }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={() => onClick(tool)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`relative cursor-pointer rounded border flex flex-col overflow-hidden transition-colors active:scale-[0.99]
        ${featured ? "col-span-2 row-span-2 p-[22px] gap-2.5 min-h-[180px]" : "p-3.5 gap-1.5 min-h-[100px]"}`}
      style={{
        background: hover ? "var(--surface-hi)" : "var(--surface)",
        borderColor: hover ? "var(--border-hi)" : "var(--border)",
      }}
    >
      {featured && (
        <div className="absolute top-0 left-0 w-[3px] h-7" style={{ background: "var(--accent)" }} />
      )}
      <div className="flex items-start justify-between gap-2">
        <div
          className={`text-text leading-tight ${featured ? "text-[20px] -tracking-[0.3px]" : "text-sm -tracking-[0.1px]"}`}
          style={{ fontFamily: "var(--display)", fontWeight: 600 }}
        >
          {tool.name}
        </div>
        <div className="flex gap-1 flex-shrink-0">
          {(tool.badges || []).map((b, i) => <Badge key={i} kind={b} />)}
        </div>
      </div>

      <div
        className={`text-text-dim leading-relaxed ${featured ? "text-sm" : "text-xs flex-1"}`}
        style={{ fontFamily: "var(--prose)" }}
      >
        {tool.desc}
      </div>

      {featured && tool.note && (
        <div
          className="border-l-2 pl-3 text-[13px] italic text-text-muted leading-relaxed"
          style={{ borderColor: "var(--accent)", fontFamily: "var(--prose)" }}
        >
          {tool.note}
        </div>
      )}

      {featured && (tool.tags || []).length > 0 && (
        <div className="flex gap-1.5 flex-wrap mt-auto">
          {tool.tags.map((t, i) => <Tag key={i}>{t}</Tag>)}
        </div>
      )}

      {featured && tool.install && (
        <div className="mt-2 px-2.5 py-2 bg-bg border border-border rounded-[3px] font-mono text-[11px] text-text-muted whitespace-nowrap overflow-hidden text-ellipsis">
          <span style={{ color: "var(--accent)" }}>$</span> {tool.install}
        </div>
      )}
    </div>
  );
}

function CategoryHeader({ title, count }) {
  return (
    <div className="pt-1 mb-2">
      <div className="flex items-baseline gap-4 pb-4">
        <h1
          className="text-3xl font-semibold -tracking-[0.8px] text-text m-0 leading-tight"
          style={{ fontFamily: "var(--display)" }}
        >
          {title}
        </h1>
        <span className="font-mono text-xs text-text-dim">
          {String(count).padStart(2, "0")}
        </span>
      </div>
      <div className="h-0.5" style={{ background: "var(--accent)" }} />
    </div>
  );
}

function CategoryBlock({ title, tools, activeCat, onOpen }) {
  const enrich = (t) => onOpen({ ...t, category: activeCat, group: title });
  const featured = tools.find((t) => t.featured);
  const rest = tools.filter((t) => t !== featured);
  return (
    <section className="mb-8">
      <SectionLabel label={title} count={tools.length} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5" style={{ gridAutoFlow: "dense" }}>
        {featured && <ToolCard tool={featured} onClick={enrich} featured />}
        {rest.map((t, i) => <ToolCard key={i} tool={t} onClick={enrich} />)}
      </div>
    </section>
  );
}

export default function CatalogView({ activeCat, query, onOpen }) {
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

  return (
    <div>
      <CategoryHeader title={activeCat} count={catData.count} />
      {groups.map(([title, tools]) => (
        <CategoryBlock key={title} title={title} tools={tools} activeCat={activeCat} onOpen={onOpen} />
      ))}
      {groups.length === 0 && (
        <div className="py-16 text-center font-mono text-xs text-text-dim">
          No results for "{query}"
        </div>
      )}
    </div>
  );
}
