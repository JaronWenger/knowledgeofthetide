import { Link, useOutletContext } from 'react-router-dom'
import { Activity, Compass, BarChart3 } from 'lucide-react'

function Home() {
  const { data } = useOutletContext()

  return (
    <>
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
          <Link to="/ideas" className="btn-primary">
            <Compass size={18} />
            Explore Ideas
          </Link>
          <Link to="/economy" className="btn-secondary">
            <BarChart3 size={18} />
            Live Data
          </Link>
        </div>
      </section>

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
    </>
  )
}

export default Home
