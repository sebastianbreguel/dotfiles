import { useState, useMemo } from 'react'
import './App.css'
import { stats, navItems, apps, plugins, skills, agents, extensions, cliTools, shellTools } from './data'

const Badge = ({ cost }) => (
  <span className={`badge badge-${cost}`}>
    {cost === 'free' ? 'Free' : cost === 'paid' ? 'Paid' : 'Freemium'}
  </span>
)

const Card = ({ name, desc, cost, install, id }) => (
  <div className="card">
    <div className="card-top">
      <span className="card-name">{name}</span>
      {cost && <Badge cost={cost} />}
    </div>
    <div className="card-desc">{desc}</div>
    {(install || id) && <div className="card-install">{install || id}</div>}
  </div>
)

const AgentCard = ({ name, desc }) => (
  <div className="agent-card">
    <div className="agent-name">{name}</div>
    <div className="agent-desc">{desc}</div>
  </div>
)

function App() {
  const [search, setSearch] = useState('')
  const [activeSection, setActiveSection] = useState(null)

  const q = search.toLowerCase()

  const filterItems = (items) =>
    items.filter(i => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q))

  const filterGrouped = (groups) => {
    const result = {}
    for (const [cat, items] of Object.entries(groups)) {
      const filtered = filterItems(items)
      if (filtered.length > 0) result[cat] = filtered
    }
    return result
  }

  const filteredApps = useMemo(() => filterGrouped(apps), [q])
  const filteredPlugins = useMemo(() => filterItems(plugins), [q])
  const filteredSkills = useMemo(() => filterItems(skills), [q])
  const filteredAgents = useMemo(() => filterGrouped(agents), [q])
  const filteredExtensions = useMemo(() => filterItems(extensions), [q])
  const filteredCli = useMemo(() => filterGrouped(cliTools), [q])
  const filteredShell = useMemo(() => filterItems(shellTools), [q])

  const scrollTo = (id) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="container">
      {/* Hero */}
      <div className="hero">
        <h1>dotfiles</h1>
        <p>Mi setup completo de desarrollo para macOS. Todo lo necesario para configurar una nueva maquina desde cero.</p>
        <div className="stats-row">
          {stats.map(s => (
            <div className="stat" key={s.label}>
              <div className="stat-number">{s.number}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav>
        {navItems.map(item => (
          <a
            key={item.id}
            className={activeSection === item.id ? 'active' : ''}
            onClick={() => scrollTo(item.id)}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Search */}
      <div className="search-wrapper">
        <input
          className="search-input"
          type="text"
          placeholder="Buscar herramienta..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Mac Apps */}
      {Object.keys(filteredApps).length > 0 && (
        <section id="apps">
          <div className="section-header">
            <div className="section-icon" style={{ background: 'rgba(34,211,238,0.1)' }}>&#127758;</div>
            <h2>Mac Apps</h2>
          </div>
          {Object.entries(filteredApps).map(([cat, items]) => (
            <div className="subcategory" key={cat}>
              <h3>{cat}</h3>
              <div className="grid">
                {items.map(app => <Card key={app.name} {...app} />)}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Plugins */}
      {filteredPlugins.length > 0 && (
        <section id="plugins">
          <div className="section-header">
            <div className="section-icon" style={{ background: 'rgba(167,139,250,0.1)' }}>&#9889;</div>
            <h2>Claude Code - Plugins</h2>
          </div>
          <p className="section-desc">Plugins del marketplace que extienden las capacidades de Claude Code.</p>
          <div className="grid">
            {filteredPlugins.map(p => (
              <Card key={p.name} name={p.name} desc={p.desc} cost="free" install={p.source} />
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {filteredSkills.length > 0 && (
        <section id="skills">
          <div className="section-header">
            <div className="section-icon" style={{ background: 'rgba(74,222,128,0.1)' }}>&#128295;</div>
            <h2>Claude Code - Skills</h2>
          </div>
          <p className="section-desc">
            Skills de <a href="https://github.com/garrytan/gstack" target="_blank" rel="noreferrer">gstack</a> (Garry Tan). Se invocan con /skill-name.
          </p>
          <div className="grid">
            {filteredSkills.map(s => <Card key={s.name} name={s.name} desc={s.desc} cost="free" />)}
          </div>
        </section>
      )}

      {/* Agents */}
      {Object.keys(filteredAgents).length > 0 && (
        <section id="agents">
          <div className="section-header">
            <div className="section-icon" style={{ background: 'rgba(244,114,182,0.1)' }}>&#129302;</div>
            <h2>Claude Code - Custom Agents</h2>
          </div>
          <p className="section-desc">16 agentes especializados que se lanzan automaticamente segun la tarea.</p>
          {Object.entries(filteredAgents).map(([cat, items]) => (
            <div className="subcategory" key={cat}>
              <h3>{cat}</h3>
              <div className="agents-grid">
                {items.map(a => <AgentCard key={a.name} {...a} />)}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Extensions */}
      {filteredExtensions.length > 0 && (
        <section id="extensions">
          <div className="section-header">
            <div className="section-icon" style={{ background: 'rgba(251,191,36,0.1)' }}>&#128230;</div>
            <h2>VS Code / Cursor Extensions</h2>
          </div>
          <div className="grid">
            {filteredExtensions.map(e => <Card key={e.id} name={e.name} desc={e.desc} cost={e.cost} install={e.id} />)}
          </div>
        </section>
      )}

      {/* CLI Tools */}
      {Object.keys(filteredCli).length > 0 && (
        <section id="cli">
          <div className="section-header">
            <div className="section-icon" style={{ background: 'rgba(251,146,60,0.1)' }}>&#9000;</div>
            <h2>CLI Tools</h2>
          </div>
          {Object.entries(filteredCli).map(([cat, items]) => (
            <div className="subcategory" key={cat}>
              <h3>{cat}</h3>
              <div className="grid">
                {items.map(t => <Card key={t.name} {...t} />)}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Shell */}
      {filteredShell.length > 0 && (
        <section id="shell">
          <div className="section-header">
            <div className="section-icon" style={{ background: 'rgba(34,211,238,0.1)' }}>&gt;_</div>
            <h2>Shell Setup</h2>
          </div>
          <div className="grid">
            {filteredShell.map(s => <Card key={s.name} {...s} />)}
          </div>
        </section>
      )}

      {/* Quick Start */}
      <div className="quickstart" id="quickstart">
        <h2>Quick Start</h2>
        <p className="section-desc" style={{ marginBottom: '1rem' }}>
          Clona el repo y ejecuta el script. Instala todo automaticamente.
        </p>
        <pre>
          <span className="comment"># 1. Install Xcode CLI tools</span>{'\n'}
          xcode-select --install{'\n\n'}
          <span className="comment"># 2. Install Homebrew</span>{'\n'}
          /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"{'\n'}
          eval "$(/opt/homebrew/bin/brew shellenv)"{'\n\n'}
          <span className="comment"># 3. Clone and run</span>{'\n'}
          git clone https://github.com/sebastianbreguel/dotfiles.git ~/dotfiles{'\n'}
          cd ~/dotfiles && ./setup.sh
        </pre>
        <div className="quickstart-details">
          <h3>El script instala:</h3>
          <div className="quickstart-grid">
            <div className="qs-item"><span className="qs-check">&#10003;</span> Homebrew formulae + casks</div>
            <div className="qs-item"><span className="qs-check">&#10003;</span> Oh My Zsh + Powerlevel10k</div>
            <div className="qs-item"><span className="qs-check">&#10003;</span> Node v25 (NVM) + Bun + uv</div>
            <div className="qs-item"><span className="qs-check">&#10003;</span> npm global packages</div>
            <div className="qs-item"><span className="qs-check">&#10003;</span> Python packages</div>
            <div className="qs-item"><span className="qs-check">&#10003;</span> Claude Code config + agents</div>
            <div className="qs-item"><span className="qs-check">&#10003;</span> gstack skills</div>
            <div className="qs-item"><span className="qs-check">&#10003;</span> 20+ Mac apps</div>
          </div>
        </div>
      </div>

      <footer>
        Built with Claude Code &mdash; <a href="https://github.com/sebastianbreguel/dotfiles" target="_blank" rel="noreferrer">github.com/sebastianbreguel/dotfiles</a>
      </footer>
    </div>
  )
}

export default App
