import { useState, useEffect } from 'react'
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Brain,
  Leaf,
  Shield,
  Zap,
  Heart,
  Globe,
  Database,
  Activity,
  Compass,
  BarChart3,
  Waves,
} from 'lucide-react'
import { trends, ideas, dataSources } from './data/trends'
import './App.css'

const iconMap = {
  brain: Brain,
  leaf: Leaf,
  shield: Shield,
  zap: Zap,
  heart: Heart,
  globe: Globe,
}

function App() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="app">
      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-brand">
          <Waves size={28} />
          <span>Knowledge of the Tide</span>
        </div>
        <ul className="nav-links">
          <li><a href="#trends" className="active">Trends</a></li>
          <li><a href="#ideas">Ideas</a></li>
          <li><a href="#sources">Sources</a></li>
        </ul>
        <div className="nav-status">
          <div className="pulse" />
          LIVE DATA
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">
          <Activity size={14} />
          MARKET INTELLIGENCE
        </div>
        <h1>
          See Where the <span className="gradient">Tide Is Going</span>
        </h1>
        <p className="hero-sub">
          Real-time business ideas powered by market data, trend analysis,
          and emerging opportunities. Stay ahead of the curve.
        </p>
        <div className="hero-actions">
          <a href="#ideas" className="btn-primary">
            <Compass size={18} />
            Explore Ideas
          </a>
          <a href="#trends" className="btn-secondary">
            <BarChart3 size={18} />
            View Trends
          </a>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stat">
          <div className="stat-value">2,847</div>
          <div className="stat-label">Data Points Analyzed</div>
        </div>
        <div className="stat">
          <div className="stat-value">142</div>
          <div className="stat-label">Markets Tracked</div>
        </div>
        <div className="stat">
          <div className="stat-value">6</div>
          <div className="stat-label">Live Data Sources</div>
        </div>
        <div className="stat">
          <div className="stat-value">24/7</div>
          <div className="stat-label">Monitoring</div>
        </div>
      </div>

      {/* Trends */}
      <section className="section" id="trends">
        <div className="section-header">
          <div className="section-label">Live Signals</div>
          <h2 className="section-title">Trending Right Now</h2>
          <p className="section-desc">
            Markets and sectors gaining momentum based on real-time data aggregation.
          </p>
        </div>
        <div className="trends-grid">
          {trends.map((trend) => (
            <div key={trend.id} className="trend-card">
              <div className="trend-card-header">
                <span className={`trend-category ${trend.category}`}>
                  {trend.category}
                </span>
                <span className={`trend-momentum ${trend.direction}`}>
                  {trend.direction === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {trend.momentum}
                </span>
              </div>
              <h3>{trend.title}</h3>
              <p>{trend.description}</p>
              <div className="trend-tags">
                {trend.tags.map((tag) => (
                  <span key={tag} className="trend-tag">#{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ideas */}
      <section className="section" id="ideas">
        <div className="section-header">
          <div className="section-label">Opportunities</div>
          <h2 className="section-title">Business Ideas Worth Building</h2>
          <p className="section-desc">
            Curated ideas backed by data, market gaps, and emerging demand signals.
          </p>
        </div>
        <div className="ideas-grid">
          {ideas.map((idea) => {
            const Icon = iconMap[idea.icon] || Zap
            return (
              <div key={idea.id} className="idea-card">
                <div className="idea-icon">
                  <Icon size={24} />
                </div>
                <h3>{idea.title}</h3>
                <p>{idea.description}</p>
                <div className="idea-meta">
                  <span className="idea-viability">
                    Viability: <strong>{idea.viability}%</strong>
                  </span>
                  <span className="idea-market">{idea.market}</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Data Sources */}
      <section className="section" id="sources">
        <div className="section-header">
          <div className="section-label">Infrastructure</div>
          <h2 className="section-title">Where the Data Comes From</h2>
          <p className="section-desc">
            Multiple APIs and datasets powering our analysis engine.
          </p>
        </div>
        <div className="sources-grid">
          {dataSources.map((source) => (
            <div key={source.name} className="source-card">
              <div className="source-icon">
                <Database size={18} />
              </div>
              <div className="source-info">
                <h4>{source.name}</h4>
                <p>{source.description}</p>
              </div>
              <div className={`source-status ${source.status}`} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ride the Next Wave</h2>
        <p>Get weekly trend reports and curated business ideas delivered to your inbox.</p>
        <div className="cta-form">
          <input type="email" placeholder="your@email.com" />
          <button className="btn-primary">
            Subscribe
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <ul className="footer-links">
          <li><a href="#trends">Trends</a></li>
          <li><a href="#ideas">Ideas</a></li>
          <li><a href="#sources">Sources</a></li>
        </ul>
        <p>&copy; {new Date().getFullYear()} Knowledge of the Tide. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
