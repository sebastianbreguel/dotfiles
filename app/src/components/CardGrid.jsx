import { CATEGORIES } from '../data'
import ToolCard from './ToolCard'

export default function CardGrid({ items, onItemClick }) {
  if (items.length === 0) {
    return (
      <div className="card-grid-empty">
        <div className="empty-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <p>No tools match your search</p>
      </div>
    )
  }

  const grouped = {}
  for (const item of items) {
    if (!grouped[item.category]) grouped[item.category] = {}
    if (!grouped[item.category][item.subcategory]) grouped[item.category][item.subcategory] = []
    grouped[item.category][item.subcategory].push(item)
  }

  const categoryOrder = Object.keys(CATEGORIES)

  return (
    <div className="card-grid">
      {categoryOrder.map(catKey => {
        const catGroup = grouped[catKey]
        if (!catGroup) return null
        const cat = CATEGORIES[catKey]
        const subcatEntries = Object.entries(cat.subcategories)
        const totalInCat = Object.values(catGroup).reduce((s, arr) => s + arr.length, 0)

        return (
          <section key={catKey} className="card-grid-section">
            <div className="card-grid-section-header">
              <h2 className="card-grid-section-title">{cat.label}</h2>
              <span className="card-grid-section-count mono">{totalInCat}</span>
            </div>
            {subcatEntries.map(([subKey, subLabel]) => {
              const subItems = catGroup[subKey]
              if (!subItems) return null
              return (
                <div key={subKey} className="card-grid-subsection">
                  {subcatEntries.length > 1 && (
                    <h3 className="card-grid-subsection-title">{subLabel}</h3>
                  )}
                  <div className="card-grid-items">
                    {subItems.map(item => (
                      <ToolCard key={item.id} item={item} onClick={onItemClick} />
                    ))}
                  </div>
                </div>
              )
            })}
          </section>
        )
      })}
    </div>
  )
}
