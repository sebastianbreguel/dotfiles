import { useState } from 'react';

const LAYERS = [
  { id: "agents",  name: "Agents",        tag: "background",   desc: "Forked subagents with their own context window. Verify, research, parallelize without crowding the main chat.", examples: ["verifier", "researcher", "reviewer"], color: "oklch(0.76 0.12 60)" },
  { id: "skills",  name: "Skills",        tag: "on-demand",    desc: "Prompt-level expertise loaded when relevant. Skills scale — only the ones Claude thinks it needs hit the context.", examples: ["frontend-design", "read-pdf", "pptx-export"], color: "oklch(0.76 0.13 160)" },
  { id: "plugins", name: "Plugins / MCP", tag: "always-on",    desc: "MCP servers and plugins that expose tools and resources. Claude can reach them for as long as they're mounted.", examples: ["context7", "playwright", "filesystem"], color: "oklch(0.72 0.18 320)" },
  { id: "hooks",   name: "Hooks",         tag: "interceptors", desc: "Shell-level interceptors that run before, during, or after Claude actions. Cheapest layer — deterministic, no tokens.", examples: ["pre-commit-lint", "post-edit-format", "block-rm-rf"], color: "oklch(0.72 0.12 20)" },
  { id: "core",    name: "Claude Code",   tag: "runtime",      desc: "The agentic coding CLI itself. Reads and writes files, runs commands, uses tools.", examples: ["claude", "claude /plan", "claude --resume"], color: "oklch(0.85 0.01 250)" },
];

const TABS = ["Overview", "Token Savings", "Hooks", "Plugins & MCP", "Skills", "Agents"];

function NestedLayers({ layers, active, setActive }) {
  const onClick = (id, e) => { e.stopPropagation(); setActive(active === id ? null : id); };

  const renderLayer = (idx) => {
    if (idx >= layers.length) return null;
    const layer = layers[idx];
    const isCore = layer.id === "core";
    const isActive = active === layer.id;
    const dimmed = active && !isActive;

    return (
      <div
        onClick={(e) => onClick(layer.id, e)}
        className="relative cursor-pointer rounded grid place-items-center transition-all"
        style={{
          padding: isCore ? "14px 22px" : "22px 20px 16px",
          border: `1px solid ${isActive ? layer.color : `oklch(from ${layer.color} l c h / 0.55)`}`,
          background: isActive ? `oklch(from ${layer.color} 0.22 0.05 h / 0.6)` : "transparent",
          opacity: dimmed ? 0.4 : 1,
          boxShadow: isActive ? `0 0 0 2px oklch(from ${layer.color} l c h / 0.18)` : "none",
        }}
      >
        {!isCore && (
          <>
            <div
              className="absolute -top-2.5 left-3.5 px-2 font-mono text-[11px] tracking-wide"
              style={{ background: "oklch(0.16 0.02 275)", color: layer.color }}
            >
              {layer.name}
            </div>
            <div
              className="absolute -top-2.5 right-3.5 px-2 font-mono text-[10px] italic text-text-dim"
              style={{ background: "oklch(0.16 0.02 275)" }}
            >
              {layer.tag}
            </div>
          </>
        )}
        {isCore ? (
          <div
            className="px-5 py-2.5 rounded-[3px] font-mono text-[13px] tracking-wide"
            style={{
              background: `oklch(from ${layer.color} 0.24 0.02 h)`,
              border: `1px solid oklch(from ${layer.color} l c h / 0.5)`,
              color: layer.color,
            }}
          >
            {layer.name}
          </div>
        ) : (
          renderLayer(idx + 1)
        )}
      </div>
    );
  };

  return (
    <div className="grid place-items-center pt-2.5 px-1.5 pb-5 min-h-[360px]">
      {renderLayer(0)}
    </div>
  );
}

function LayerPanel({ layer }) {
  if (!layer) return null;
  return (
    <div
      className="px-[22px] py-5 bg-surface rounded relative z-10"
      style={{ border: `1px solid ${layer.color}`, animation: "fadeInUp 220ms ease-out" }}
    >
      <div className="font-mono text-[10px] tracking-wider uppercase mb-1.5" style={{ color: layer.color }}>
        Layer · {layer.tag}
      </div>
      <h3 className="text-xl font-semibold -tracking-[0.3px] text-text mb-2.5 m-0" style={{ fontFamily: "var(--display)" }}>
        {layer.name}
      </h3>
      <p className="text-[13px] leading-relaxed text-text-muted mb-3.5" style={{ fontFamily: "var(--prose)" }}>
        {layer.desc}
      </p>
      <div className="font-mono text-[10px] text-text-dim tracking-wider uppercase mb-1.5">Examples</div>
      <div className="flex flex-col gap-1">
        {layer.examples.map((ex, i) => (
          <div key={i} className="font-mono text-xs text-text px-2.5 py-1.5 bg-bg border border-border rounded-[3px]">
            <span style={{ color: layer.color }}>▸</span> {ex}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const [tab, setTab] = useState("Overview");
  const [active, setActive] = useState(null);

  return (
    <section className="mt-12 mb-8">
      <div className="mb-1">
        <h2 className="text-[22px] font-semibold -tracking-[0.4px] text-text m-0" style={{ fontFamily: "var(--display)" }}>
          How it works
        </h2>
        <p className="text-[13px] text-text-dim mt-1 mb-5" style={{ fontFamily: "var(--prose)" }}>
          Each layer of the ecosystem optimizes your development workflow.
        </p>
      </div>

      <div className="flex gap-1.5 mb-5 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-3 py-1.5 rounded-[3px] font-mono text-[11px] cursor-pointer transition-all"
            style={{
              background: tab === t ? "oklch(from var(--accent) 0.22 0.08 h)" : "transparent",
              border: `1px solid ${tab === t ? "var(--accent)" : "var(--border)"}`,
              color: tab === t ? "var(--accent)" : "var(--text-dim)",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="relative px-7 py-8 border border-border rounded-md overflow-hidden" style={{ background: "oklch(0.16 0.02 275)" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(oklch(0.22 0.02 275) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
            opacity: 0.4,
          }}
        />
        <div
          className="grid gap-7 items-center relative transition-all"
          style={{ gridTemplateColumns: active ? "minmax(360px, 1fr) 280px" : "1fr" }}
        >
          <NestedLayers layers={LAYERS} active={active} setActive={setActive} />
          {active && <LayerPanel layer={LAYERS.find((l) => l.id === active)} />}
        </div>
      </div>

      <div className="mt-3.5 text-center font-mono text-[11px] text-text-dim">
        {active
          ? "Click the active layer to collapse · click another to switch"
          : "Click any layer to see what it does · 4 layers amplify Claude Code"}
      </div>
    </section>
  );
}
