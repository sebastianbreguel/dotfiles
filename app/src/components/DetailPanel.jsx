import { useState, useEffect } from 'react'
import { items } from '../data'

export default function DetailPanel({ item, onClose, onItemClick }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!item) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [item, onClose])

  if (!item) return null

  const relatedItems = (item.related || [])
    .map(id => items.find(i => i.id === id))
    .filter(Boolean)

  const copyInstall = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(item.install)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={e => e.stopPropagation()}>
        <div className="detail-top-bar">
          <button className="detail-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="detail-content">
          <div className="detail-name-row">
            <h2 className="detail-name">{item.name}</h2>
            {item.cost && (
              <span className={`detail-cost cost-${item.cost}`}>
                {item.cost === 'free' ? 'Free' : item.cost === 'freemium' ? 'Freemium' : 'Paid'}
              </span>
            )}
          </div>
          <p className="detail-desc">{item.description}</p>

          {item.why && (
            <div className="detail-why">
              <span className="detail-why-icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </span>
              <p className="detail-why-text">{item.why}</p>
            </div>
          )}

          {item.install && item.installMethod !== 'builtin' && item.installMethod !== 'manual' && (
            <div className="detail-section">
              <label className="detail-label">Install</label>
              <div className="detail-install" onClick={copyInstall}>
                <code className="mono">{item.install}</code>
                <button className={`detail-copy-btn mono ${copied ? 'copied' : ''}`}>
                  {copied ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect width="14" height="14" x="8" y="8" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}

          {item.url && (
            <div className="detail-section">
              <label className="detail-label">Website</label>
              <a href={item.url} target="_blank" rel="noreferrer" className="detail-link">
                {item.url.replace(/^https?:\/\/(www\.)?/, '')}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M7 17 17 7M7 7h10v10" />
                </svg>
              </a>
            </div>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="detail-section">
              <label className="detail-label">Tags</label>
              <div className="detail-tags">
                {item.tags.map(tag => (
                  <span key={tag} className="detail-tag mono">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {relatedItems.length > 0 && (
            <div className="detail-section">
              <label className="detail-label">Related tools</label>
              <div className="detail-related">
                {relatedItems.map(rel => (
                  <button
                    key={rel.id}
                    className="detail-related-item"
                    onClick={() => onItemClick(rel)}
                  >
                    <span className="detail-related-name">{rel.name}</span>
                    <span className="detail-related-desc">{rel.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
