import { useOutletContext } from 'react-router-dom'
import { TrendingUp, TrendingDown } from 'lucide-react'

function formatNumber(n) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(1)}T`
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`
  return `$${n}`
}

function Economy() {
  const { data, loading, errors } = useOutletContext()

  return (
    <section className="section page-section">
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
  )
}

export default Economy
