import { useState } from 'react'

const TABS = [
  { id: 'overview', label: 'Overview', video: '/videos/overview.mp4', desc: 'The 4 layers that amplify Claude Code: Hooks, Plugins, Skills, and Agents.' },
  { id: 'token_savings', label: 'Token Savings', video: '/videos/token_savings.mp4', desc: 'How every request gets optimized through multiple layers — saving 60-90% of tokens.' },
  { id: 'hooks', label: 'Hooks', video: '/videos/hooks.mp4', desc: 'Invisible middleware that intercepts commands. RTK compresses output, context-mode indexes it.' },
  { id: 'plugins_mcp', label: 'Plugins & MCP', video: '/videos/plugins_mcp.mp4', desc: 'Local plugins (context-mode, claude-mem, playwright) + remote MCP servers (ClickUp, PostHog).' },
  { id: 'skills', label: 'Skills', video: '/videos/skills.mp4', desc: 'Complete workflows activated with a slash command — /commit, /brainstorm, /test-and-fix.' },
  { id: 'agents', label: 'Agents', video: '/videos/agents.mp4', desc: 'Specialized subagents dispatched in parallel for complex tasks like code review + architecture.' },
]

export default function HowItWorks() {
  const [active, setActive] = useState('overview')
  const tab = TABS.find(t => t.id === active)

  return (
    <section className="how-it-works">
      <div className="hiw-header">
        <h2 className="hiw-title">How it works</h2>
        <p className="hiw-subtitle">Each layer of the ecosystem optimizes your development workflow</p>
      </div>

      <div className="hiw-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`hiw-tab ${active === t.id ? 'active' : ''}`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="hiw-content">
        <div className="hiw-video-wrap">
          <video
            key={tab.id}
            autoPlay
            loop
            muted
            playsInline
            className="hiw-video"
          >
            <source src={tab.video} type="video/mp4" />
          </video>
        </div>
        <p className="hiw-desc">{tab.desc}</p>
      </div>
    </section>
  )
}
