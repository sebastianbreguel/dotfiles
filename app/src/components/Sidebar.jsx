import { useState } from 'react'
import { CATEGORIES, items } from '../data'

export default function Sidebar({ activeCategory, onCategoryChange, onMobileClose, isOpen }) {
  const [expanded, setExpanded] = useState({})

  const toggleExpand = (catKey) => {
    setExpanded(prev => ({ ...prev, [catKey]: !prev[catKey] }))
  }

  const getCategoryCount = (catKey) => items.filter(i => i.category === catKey).length
  const getSubcategoryCount = (catKey, subKey) =>
    items.filter(i => i.category === catKey && i.subcategory === subKey).length

  const handleCategoryClick = (catKey) => {
    onCategoryChange(activeCategory === catKey ? null : catKey)
    if (onMobileClose) onMobileClose()
  }

  const handleSubcategoryClick = (catKey, subKey) => {
    const filter = `${catKey}:${subKey}`
    onCategoryChange(activeCategory === filter ? null : filter)
    if (onMobileClose) onMobileClose()
  }

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      {onMobileClose && (
        <div className="sidebar-mobile-header">
          <span>Filter</span>
          <button className="sidebar-close" onClick={onMobileClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      <nav className="sidebar-nav">
        <button
          className={`sidebar-item ${activeCategory === null ? 'active' : ''}`}
          onClick={() => { onCategoryChange(null); if (onMobileClose) onMobileClose() }}
        >
          <span className="sidebar-item-label">All tools</span>
          <span className="sidebar-count mono">{items.length}</span>
        </button>

        <div className="sidebar-divider" />

        {Object.entries(CATEGORIES).map(([catKey, cat]) => {
          const isExpanded = expanded[catKey]
          const isActive = activeCategory === catKey || (activeCategory && activeCategory.startsWith(catKey + ':'))
          const subcats = Object.entries(cat.subcategories)
          const hasSubcats = subcats.length > 1

          return (
            <div key={catKey} className="sidebar-group">
              <div className="sidebar-item-row">
                <button
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(catKey)}
                >
                  <span className="sidebar-item-label">{cat.label}</span>
                  <span className="sidebar-count mono">{getCategoryCount(catKey)}</span>
                </button>
                {hasSubcats && (
                  <button
                    className="sidebar-chevron"
                    onClick={() => toggleExpand(catKey)}
                    style={{ transform: isExpanded ? 'rotate(90deg)' : 'none' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                )}
              </div>
              {hasSubcats && isExpanded && (
                <div className="sidebar-subcategories">
                  {subcats.map(([subKey, subLabel]) => {
                    const subCount = getSubcategoryCount(catKey, subKey)
                    if (subCount === 0) return null
                    return (
                      <button
                        key={subKey}
                        className={`sidebar-subitem ${activeCategory === `${catKey}:${subKey}` ? 'active' : ''}`}
                        onClick={() => handleSubcategoryClick(catKey, subKey)}
                      >
                        <span>{subLabel}</span>
                        <span className="sidebar-count mono">{subCount}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
