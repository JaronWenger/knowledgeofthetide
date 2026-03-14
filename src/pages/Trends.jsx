import { TrendingUp, TrendingDown } from 'lucide-react'
import { trends } from '../data/trends'

function Trends() {
  return (
    <section className="section page-section">
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
  )
}

export default Trends
