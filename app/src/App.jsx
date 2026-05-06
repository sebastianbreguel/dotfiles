import { useState, useEffect } from 'react';
import { CATEGORIES } from './data';
import { Sidebar, TopBar, TweaksPanel } from './components/Shell';
import CatalogView from './components/CatalogView';
import TerminalView from './components/TerminalView';
import DetailDrawer from './components/DetailDrawer';
import HowItWorks from './components/HowItWorks';
import AboutPage from './components/AboutPage';
import AllToolsView from './components/AllToolsView';

const DEFAULT_ACCENT = "oklch(0.68 0.17 252)";

export default function App() {
  const [activeCat, setActiveCat] = useState(() => localStorage.getItem("df-cat") || CATEGORIES[0]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState(() => localStorage.getItem("df-view") || "catalog");
  const [accent, setAccent] = useState(() => localStorage.getItem("df-accent") || DEFAULT_ACCENT);
  const [tweaksOn, setTweaksOn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { localStorage.setItem("df-cat", activeCat); }, [activeCat]);
  useEffect(() => { localStorage.setItem("df-view", view); }, [view]);
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
    localStorage.setItem("df-accent", accent);
  }, [accent]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && e.target.tagName !== "INPUT") {
        e.preventDefault();
        document.querySelector('input[placeholder="Search tools..."]')?.focus();
      }
      if (e.key === "Escape" && tweaksOn) setTweaksOn(false);
      if ((e.key === "t" || e.key === "T") && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        setTweaksOn((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tweaksOn]);

  const effectiveCat = activeCat === "__all" ? CATEGORIES[0] : activeCat;
  const isClaudeCode = activeCat === "Claude Code";

  return (
    <div className="flex min-h-screen bg-bg text-text">
      <Sidebar
        activeCat={activeCat}
        setActiveCat={setActiveCat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          query={query}
          setQuery={setQuery}
          view={view}
          setView={setView}
          onMenuClick={() => setSidebarOpen(true)}
          showViewToggle={activeCat !== "__about" && activeCat !== "__all"}
        />
        <main
          className={`flex-1 w-full max-w-[1400px] ${view === "catalog" ? "px-6 md:px-11 pt-8 pb-20" : "px-5 md:px-10 pt-7 pb-20"}`}
        >
          {activeCat === "__about" ? (
            <AboutPage />
          ) : activeCat === "__all" ? (
            <AllToolsView query={query} onOpen={setSelected} />
          ) : view === "catalog" ? (
            <>
              <CatalogView activeCat={effectiveCat} query={query} onOpen={setSelected} />
              {isClaudeCode && <HowItWorks />}
            </>
          ) : (
            <>
              <TerminalView activeCat={effectiveCat} query={query} onOpen={setSelected} selectedTool={selected} />
              {isClaudeCode && <HowItWorks />}
            </>
          )}
        </main>
      </div>

      {selected && (
        <DetailDrawer
          tool={selected}
          onClose={() => setSelected(null)}
          onItemClick={setSelected}
        />
      )}

      <button
        onClick={() => setTweaksOn((v) => !v)}
        title="Tweaks (Cmd/Ctrl+Shift+T)"
        className="fixed bottom-4 left-4 z-30 w-9 h-9 rounded-full border border-border bg-surface text-text-dim grid place-items-center hover:border-border-hi"
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      </button>

      {tweaksOn && (
        <TweaksPanel
          accent={accent}
          setAccent={setAccent}
          onClose={() => setTweaksOn(false)}
        />
      )}
    </div>
  );
}
