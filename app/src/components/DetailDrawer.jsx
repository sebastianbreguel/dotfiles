import { useEffect, useState } from 'react';
import { ALL_TOOLS } from '../data';
import { Badge, Tag, Icon } from './Primitives';

function FieldLabel({ children }) {
  return (
    <div className="font-mono text-[10px] text-text-dim tracking-wider uppercase mb-2">
      {children}
    </div>
  );
}

export default function DetailDrawer({ tool, onClose, onItemClick }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
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

  const related = (tool.related || [])
    .map((name) => ALL_TOOLS.find((t) => t.name === name))
    .filter(Boolean);

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50"
        style={{ backdropFilter: "blur(2px)", animation: "fadeIn 160ms ease-out" }}
      />
      <aside
        className="fixed top-0 right-0 bottom-0 w-[480px] max-w-[90vw] bg-surface border-l z-50 flex flex-col"
        style={{
          borderColor: "var(--border-hi)",
          animation: "slideIn 220ms cubic-bezier(0.2, 0.9, 0.3, 1)",
          boxShadow: "-30px 0 60px rgba(0,0,0,0.4)",
        }}
      >
        <div className="px-7 py-5 border-b border-border flex items-start gap-4">
          <div className="flex-1">
            <div className="font-mono text-[10px] text-text-dim tracking-wider uppercase mb-1.5">
              {tool.category} {tool.group ? `· ${tool.group}` : ""}
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2
                className="text-2xl font-semibold -tracking-[0.5px] m-0 text-text"
                style={{ fontFamily: "var(--display)" }}
              >
                {tool.name}
              </h2>
              {(tool.badges || []).map((b, i) => <Badge key={i} kind={b} />)}
              {(tool.tags || []).map((t, i) => <Tag key={i}>{t}</Tag>)}
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border border-border w-7 h-7 rounded-[3px] text-text-dim cursor-pointer grid place-items-center"
          >
            <Icon.Close />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 pt-5 pb-8">
          <p className="text-[15px] leading-relaxed text-text mb-5" style={{ fontFamily: "var(--prose)" }}>
            {tool.desc}
          </p>

          {tool.note && (
            <div
              className="border-l-2 px-4 py-3 text-sm italic text-text-muted leading-relaxed mb-6 rounded-r-[3px]"
              style={{ borderColor: "var(--accent)", background: "oklch(from var(--accent) 0.22 0.04 h)" }}
            >
              {tool.note}
            </div>
          )}

          {tool.install && (
            <>
              <FieldLabel>Install</FieldLabel>
              <div className="flex items-center bg-bg border border-border rounded-[3px] mb-5">
                <div className="flex-1 px-3.5 py-2.5 font-mono text-xs text-text overflow-x-auto whitespace-nowrap">
                  <span style={{ color: "var(--accent)" }}>$ </span>{tool.install}
                </div>
                <button
                  onClick={copyInstall}
                  className="border-0 border-l border-border bg-transparent px-3.5 py-2.5 cursor-pointer flex items-center gap-1.5 font-mono text-[11px] transition-colors"
                  style={{ color: copied ? "oklch(0.82 0.14 150)" : "var(--text-dim)" }}
                >
                  {copied ? <><Icon.Check /> copied</> : <><Icon.Copy /> copy</>}
                </button>
              </div>
            </>
          )}

          {tool.site && (
            <>
              <FieldLabel>Website</FieldLabel>
              <a
                href={`https://${tool.site}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs no-underline mb-5 pb-px"
                style={{
                  color: "var(--accent)",
                  borderBottom: "1px solid oklch(from var(--accent) l c h / 0.4)",
                }}
              >
                {tool.site} <Icon.Arrow />
              </a>
            </>
          )}

          {related.length > 0 && (
            <>
              <FieldLabel>Related</FieldLabel>
              <div className="grid gap-1.5 mb-5">
                {related.map((r, i) => (
                  <div
                    key={i}
                    onClick={() => onItemClick?.(r)}
                    className="px-3 py-2.5 bg-bg border border-border rounded-[3px] cursor-pointer hover:border-border-hi"
                  >
                    <div className="text-[13px] font-semibold text-text mb-0.5" style={{ fontFamily: "var(--display)" }}>
                      {r.name}
                    </div>
                    <div className="text-xs text-text-dim leading-snug" style={{ fontFamily: "var(--prose)" }}>
                      {r.desc}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <FieldLabel>Metadata</FieldLabel>
          <div
            className="font-mono text-[11px] text-text-dim grid"
            style={{ gridTemplateColumns: "auto 1fr", gap: "6px 16px" }}
          >
            <span>category</span><span className="text-text-muted">{(tool.category || "").toLowerCase()}</span>
            <span>group</span><span className="text-text-muted">{(tool.group || "").toLowerCase()}</span>
            <span>tags</span><span className="text-text-muted">[{(tool.tags || []).join(", ")}]</span>
            <span>badges</span><span className="text-text-muted">[{(tool.badges || []).map((b) => b.toLowerCase()).join(", ")}]</span>
          </div>
        </div>
      </aside>
    </>
  );
}
