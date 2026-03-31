import { CATEGORIES, items } from '../data'

export default function StatsBar() {
  return (
    <div className="stats-bar">
      <div className="stats-bar-brand">
        <span className="stats-bar-dot" />
        <span className="stats-bar-name">dotfiles</span>
      </div>
      <div className="stats-bar-pills">
        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const count = items.filter(i => i.category === key).length
          return (
            <span key={key} className="stats-bar-pill">
              <span className="stats-bar-pill-count mono">{count}</span>
              <span className="stats-bar-pill-label">{cat.label}</span>
            </span>
          )
        })}
      </div>
    </div>
  )
}
