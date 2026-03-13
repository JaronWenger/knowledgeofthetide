import { useState, useEffect } from 'react'
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ArrowUpRight,
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
  MessageSquare,
  DollarSign,
  Users,
  ExternalLink,
} from 'lucide-react'
import tideIcon from './assets/tideicon.png'
import { useMarketData } from './hooks/useMarketData'
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

function formatNumber(n) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(1)}T`
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`
  return `$${n}`
}

function timeAgo(utc) {
  const diff = Date.now() / 1000 - utc
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function App() {
  const [scrolled, setScrolled] = useState(false)
  const { data, loading, errors } = useMarketData()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const liveSourceCount = Object.keys(data).filter((k) => data[k] !== null).length

  return (
    <div className="app">
      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-brand">
          <img src={tideIcon} alt="Tide" className="nav-logo" />
          <span>Knowledge of the Tide</span>
        </div>
        <ul className="nav-links">
          <li><a href="#trends">Trends</a></li>
          <li><a href="#economy">Global</a></li>
          <li><a href="#fed">U.S. Data</a></li>
          <li><a href="#startups">Startups</a></li>
          <li><a href="#community">Community</a></li>
          <li><a href="#ideas">Ideas</a></li>
        </ul>
        <div className="nav-status">
          <div className="pulse" />
          {loading ? 'LOADING...' : `${liveSourceCount} SOURCES LIVE`}
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
          <a href="#economy" className="btn-secondary">
            <BarChart3 size={18} />
            Live Data
          </a>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stat">
          <div className="stat-value">{data.redditPosts?.length || '...'}</div>
          <div className="stat-label">Trending Posts</div>
        </div>
        <div className="stat">
          <div className="stat-value">{data.growthLeaders?.length || '...'}</div>
          <div className="stat-label">Growth Economies</div>
        </div>
        <div className="stat">
          <div className="stat-value">{data.startups?.length || '...'}</div>
          <div className="stat-label">Startups Tracked</div>
        </div>
        <div className="stat">
          <div className="stat-value">24/7</div>
          <div className="stat-label">Monitoring</div>
        </div>
      </div>

      {/* Curated Trends */}
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

      {/* World Bank Economy Section */}
      <section className="section" id="economy">
        <div className="section-header">
          <div className="section-label">World Bank Data</div>
          <h2 className="section-title">Global Economic Pulse</h2>
          <p className="section-desc">
            Live economic indicators from the World Bank API.
          </p>
        </div>

        {loading && !data.worldBank ? (
          <div className="trends-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton skeleton-card" />
            ))}
          </div>
        ) : data.worldBank ? (
          <div className="trends-grid">
            {Object.entries(data.worldBank).map(([code, info]) => (
              <div key={code} className="trend-card">
                <div className="trend-card-header">
                  <span className="trend-category tech">{code}</span>
                  {info.gdpGrowth.length > 0 && (
                    <span className={`trend-momentum ${info.gdpGrowth[info.gdpGrowth.length - 1]?.value > 0 ? 'up' : 'down'}`}>
                      {info.gdpGrowth[info.gdpGrowth.length - 1]?.value > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {info.gdpGrowth[info.gdpGrowth.length - 1]?.value}%
                    </span>
                  )}
                </div>
                <h3>{info.country}</h3>
                <div className="economy-stats">
                  {info.gdpPerCapita && (
                    <div className="econ-stat">
                      <span className="econ-label">GDP/Capita</span>
                      <span className="econ-value">{formatNumber(info.gdpPerCapita)}</span>
                    </div>
                  )}
                  {info.inflation !== null && (
                    <div className="econ-stat">
                      <span className="econ-label">Inflation</span>
                      <span className="econ-value">{info.inflation}%</span>
                    </div>
                  )}
                  {info.unemployment !== null && (
                    <div className="econ-stat">
                      <span className="econ-label">Unemployment</span>
                      <span className="econ-value">{info.unemployment}%</span>
                    </div>
                  )}
                </div>
                {info.gdpGrowth.length > 0 && (
                  <div className="mini-chart">
                    {info.gdpGrowth.map((d, i) => (
                      <div key={i} className="mini-bar-wrap">
                        <div
                          className={`mini-bar ${d.value >= 0 ? 'positive' : 'negative'}`}
                          style={{ height: `${Math.min(Math.abs(d.value) * 8, 60)}px` }}
                        />
                        <span className="mini-bar-label">{d.year}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="error-msg">Could not load World Bank data. {errors.worldBank}</p>
        )}

        {/* Growth Leaders */}
        {data.growthLeaders && data.growthLeaders.length > 0 && (
          <div className="growth-leaders">
            <h3 className="subsection-title">
              <TrendingUp size={18} />
              Fastest Growing Economies
            </h3>
            <div className="leaders-grid">
              {data.growthLeaders.slice(0, 10).map((leader, i) => (
                <div key={leader.code} className="leader-chip">
                  <span className="leader-rank">#{i + 1}</span>
                  <span className="leader-name">{leader.country}</span>
                  <span className="leader-growth">+{leader.growth}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* FRED Economic Indicators */}
      {data.fred && (
        <section className="section" id="fed">
          <div className="section-header">
            <div className="section-label">Federal Reserve Data</div>
            <h2 className="section-title">U.S. Economic Indicators</h2>
            <p className="section-desc">
              Live data from the Federal Reserve Bank of St. Louis.
            </p>
          </div>
          <div className="fred-grid">
            {Object.entries(data.fred).map(([key, indicator]) => {
              const change = indicator.current && indicator.previous
                ? +(indicator.current - indicator.previous).toFixed(2)
                : null
              return (
                <div key={key} className="fred-card">
                  <div className="fred-label">{indicator.label}</div>
                  <div className="fred-value">
                    {indicator.current !== null ? indicator.current.toFixed(2) : '—'}
                    <span className="fred-unit">{indicator.unit === '%' ? '%' : ''}</span>
                  </div>
                  {change !== null && (
                    <div className={`fred-change ${change >= 0 ? 'up' : 'down'}`}>
                      {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {change >= 0 ? '+' : ''}{change}
                    </div>
                  )}
                  {indicator.history.length > 1 && (
                    <div className="fred-sparkline">
                      {indicator.history.slice(-8).map((d, i) => {
                        const values = indicator.history.slice(-8).map((h) => h.value)
                        const min = Math.min(...values)
                        const max = Math.max(...values)
                        const range = max - min || 1
                        const height = ((d.value - min) / range) * 32 + 4
                        return (
                          <div
                            key={i}
                            className="spark-bar"
                            style={{ height: `${height}px` }}
                            title={`${d.date}: ${d.value}`}
                          />
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* TrustMRR Startups */}
      <section className="section" id="startups">
        <div className="section-header">
          <div className="section-label">TrustMRR Data</div>
          <h2 className="section-title">Startup Revenue Landscape</h2>
          <p className="section-desc">
            Real verified revenue data from startups building in public.
          </p>
        </div>

        {data.startups ? (
          <div className="startups-grid">
            {data.startups.map((s) => (
              <div key={s.slug || s.name} className="startup-card">
                <div className="startup-header">
                  <div>
                    <h3>{s.name}</h3>
                    <span className={`trend-category ${s.category === 'ai' ? 'ai' : s.category === 'fintech' ? 'finance' : 'tech'}`}>
                      {s.category}
                    </span>
                  </div>
                  {s.onSale && <span className="sale-badge">For Sale</span>}
                </div>
                {s.description && <p className="startup-desc">{s.description}</p>}
                <div className="startup-metrics">
                  {s.mrr !== null && s.mrr !== undefined && (
                    <div className="metric">
                      <DollarSign size={14} />
                      <span className="metric-value">{formatNumber(s.mrr)}</span>
                      <span className="metric-label">MRR</span>
                    </div>
                  )}
                  {s.growth30d !== null && s.growth30d !== undefined && (
                    <div className="metric">
                      <TrendingUp size={14} />
                      <span className={`metric-value ${s.growth30d >= 0 ? 'up' : 'down'}`}>
                        {s.growth30d > 0 ? '+' : ''}{s.growth30d}%
                      </span>
                      <span className="metric-label">Growth</span>
                    </div>
                  )}
                  {s.customers && (
                    <div className="metric">
                      <Users size={14} />
                      <span className="metric-value">{s.customers.toLocaleString()}</span>
                      <span className="metric-label">Customers</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : loading ? (
          <div className="startups-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton skeleton-card" />
            ))}
          </div>
        ) : (
          <p className="error-msg">Startup data unavailable. {errors.startups}</p>
        )}
      </section>

      {/* Reddit Community Pulse */}
      <section className="section" id="community">
        <div className="section-header">
          <div className="section-label">Reddit Pulse</div>
          <h2 className="section-title">What Founders Are Talking About</h2>
          <p className="section-desc">
            Trending discussions from startup and entrepreneurship communities.
          </p>
        </div>

        {/* Subreddit Buzz */}
        {data.subredditBuzz && (
          <div className="buzz-grid">
            {data.subredditBuzz.map((sub) => (
              <div key={sub.subreddit} className="buzz-card">
                <div className="buzz-header">
                  <span className="buzz-name">r/{sub.subreddit}</span>
                  <span className="buzz-score">{sub.totalScore.toLocaleString()} pts</span>
                </div>
                <div className="buzz-stats">
                  <span>{sub.postCount} posts</span>
                  <span>{sub.avgComments} avg comments</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trending Posts */}
        {loading && !data.redditPosts ? (
          <div className="reddit-posts">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton" style={{ height: 72, marginBottom: 8 }} />
            ))}
          </div>
        ) : data.redditPosts && data.redditPosts.length > 0 ? (
          <div className="reddit-posts">
            {data.redditPosts.slice(0, 12).map((post) => (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="reddit-post"
              >
                <div className="post-score">
                  <TrendingUp size={12} />
                  {post.score}
                </div>
                <div className="post-content">
                  <h4>{post.title}</h4>
                  <div className="post-meta">
                    <span className="post-sub">r/{post.subreddit}</span>
                    <span className="post-comments">
                      <MessageSquare size={12} />
                      {post.comments}
                    </span>
                    <span className="post-time">{timeAgo(post.created)}</span>
                  </div>
                </div>
                <ExternalLink size={14} className="post-link-icon" />
              </a>
            ))}
          </div>
        ) : (
          <div className="reddit-fallback">
            <p>Reddit data is temporarily unavailable.</p>
            <div className="fallback-links">
              <a href="https://reddit.com/r/startups" target="_blank" rel="noopener noreferrer">r/startups <ExternalLink size={12} /></a>
              <a href="https://reddit.com/r/SideProject" target="_blank" rel="noopener noreferrer">r/SideProject <ExternalLink size={12} /></a>
              <a href="https://reddit.com/r/Entrepreneur" target="_blank" rel="noopener noreferrer">r/Entrepreneur <ExternalLink size={12} /></a>
              <a href="https://reddit.com/r/smallbusiness" target="_blank" rel="noopener noreferrer">r/smallbusiness <ExternalLink size={12} /></a>
            </div>
          </div>
        )}
      </section>

      {/* Business Ideas */}
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
          <li><a href="#economy">Economy</a></li>
          <li><a href="#startups">Startups</a></li>
          <li><a href="#community">Community</a></li>
          <li><a href="#ideas">Ideas</a></li>
        </ul>
        <p>&copy; {new Date().getFullYear()} Knowledge of the Tide. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
