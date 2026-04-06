import { useState, useMemo, useEffect } from 'react'
import './App.css'
import { items } from './data'
import StatsBar from './components/StatsBar'
import SearchBar from './components/SearchBar'
import Sidebar from './components/Sidebar'
import CardGrid from './components/CardGrid'
import DetailPanel from './components/DetailPanel'
import HowItWorks from './components/HowItWorks'

function App() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme')
      if (saved) return saved === 'dark'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const filteredItems = useMemo(() => {
    let result = items

    if (activeCategory) {
      if (activeCategory.includes(':')) {
        const [cat, sub] = activeCategory.split(':')
        result = result.filter(i => i.category === cat && i.subcategory === sub)
      } else {
        result = result.filter(i => i.category === activeCategory)
      }
    }

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        (i.tags && i.tags.some(t => t.toLowerCase().includes(q)))
      )
    }

    return result
  }, [search, activeCategory])

  return (
    <div className="app-layout">
      <header className="app-header">
        <StatsBar />
        <div className="header-actions">
          <SearchBar value={search} onChange={setSearch} />
          <button
            className="theme-toggle"
            onClick={() => setDark(d => !d)}
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {dark ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        </div>
      </header>

      <div className="app-body">
        {sidebarOpen && (
          <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
        )}
        <Sidebar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          isOpen={sidebarOpen}
          onMobileClose={() => setSidebarOpen(false)}
        />
        <main className="app-main">
          <HowItWorks />
          <CardGrid items={filteredItems} onItemClick={setSelectedItem} />
        </main>
      </div>

      <DetailPanel
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onItemClick={setSelectedItem}
      />

      <footer className="app-footer">
        <div className="footer-setup">
          <span className="footer-setup-label">Quick setup</span>
          <code className="footer-setup-cmd mono">git clone https://github.com/sebastianbreguel/dotfiles && cd dotfiles && ./setup.sh</code>
        </div>
        <div className="footer-links">
          <a href="https://github.com/sebastianbreguel/dotfiles" target="_blank" rel="noreferrer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Source
          </a>
          <span className="footer-sep">·</span>
          <a href="https://github.com/sebastianbreguel/dotfiles/blob/main/setup.sh" target="_blank" rel="noreferrer">
            setup.sh
          </a>
          <span className="footer-sep">·</span>
          <span className="footer-credit">by <a href="https://github.com/sebastianbreguel" target="_blank" rel="noreferrer">@sebastianbreguel</a></span>
        </div>
      </footer>
    </div>
  )
}

export default App
