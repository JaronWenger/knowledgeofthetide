import { useOutletContext } from 'react-router-dom'
import { TrendingUp, TrendingDown } from 'lucide-react'

function FedData() {
  const { data, loading } = useOutletContext()

  if (!data.fred && !loading) {
    return (
      <section className="section page-section">
        <div className="section-header">
          <div className="section-label">Federal Reserve Data</div>
          <h2 className="section-title">U.S. Economic Indicators</h2>
          <p className="section-desc">
            FRED data is currently unavailable.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="section page-section">
      <div className="section-header">
        <div className="section-label">Federal Reserve Data</div>
        <h2 className="section-title">U.S. Economic Indicators</h2>
        <p className="section-desc">
          Live data from the Federal Reserve Bank of St. Louis.
        </p>
      </div>

      {loading && !data.fred ? (
        <div className="trends-grid">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton skeleton-card" />
          ))}
        </div>
      ) : data.fred ? (
        <div className="trends-grid">
          {Object.entries(data.fred).map(([key, indicator]) => {
            const change = indicator.current && indicator.previous
              ? +(indicator.current - indicator.previous).toFixed(2)
              : null
            return (
              <div key={key} className="trend-card">
                <div className="trend-card-header">
                  <span className="trend-category tech">{indicator.label}</span>
                  {change !== null && (
                    <span className={`trend-momentum ${change >= 0 ? 'up' : 'down'}`}>
                      {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {change >= 0 ? '+' : ''}{change}{indicator.unit === '%' ? '%' : ''}
                    </span>
                  )}
                </div>
                <h3>
                  {indicator.current !== null ? indicator.current.toFixed(2) : '—'}
                  {indicator.unit === '%' ? '%' : ''}
                </h3>
                {indicator.history.length > 1 && (
                  <div className="mini-chart">
                    {indicator.history.slice(-8).map((d, i) => {
                      const values = indicator.history.slice(-8).map((h) => h.value)
                      const min = Math.min(...values)
                      const max = Math.max(...values)
                      const range = max - min || 1
                      const height = ((d.value - min) / range) * 40 + 4
                      return (
                        <div key={i} className="mini-bar-wrap">
                          <div
                            className={`mini-bar positive`}
                            style={{ height: `${height}px` }}
                            title={`${d.date}: ${d.value}`}
                          />
                          <span className="mini-bar-label">{d.date.slice(0, 7)}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}

export default FedData
