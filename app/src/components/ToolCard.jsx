const METHOD_LABELS = {
  brew: 'Homebrew',
  pnpm: 'pnpm',
  npm: 'npm',
  pip: 'pip',
  curl: 'curl',
  git: 'git',
  vscode: 'VS Code',
  marketplace: 'Marketplace',
}

const COST_LABELS = {
  free: { label: 'Free', className: 'cost-free' },
  freemium: { label: 'Freemium', className: 'cost-freemium' },
  paid: { label: 'Paid', className: 'cost-paid' },
}

export default function ToolCard({ item, onClick }) {
  const method = METHOD_LABELS[item.installMethod]
  const showMethod = method && item.installMethod !== 'builtin' && item.installMethod !== 'manual'
  const cost = COST_LABELS[item.cost]

  return (
    <article className="tool-card" onClick={() => onClick(item)} tabIndex={0} role="button">
      <div className="tool-card-header">
        <h3 className="tool-card-name">{item.name}</h3>
        <div className="tool-card-badges">
          {cost && item.cost !== 'free' && (
            <span className={`tool-card-cost ${cost.className}`}>{cost.label}</span>
          )}
          {showMethod && <span className="tool-card-badge mono">{method}</span>}
        </div>
      </div>
      <p className="tool-card-desc">{item.description}</p>
    </article>
  )
}
