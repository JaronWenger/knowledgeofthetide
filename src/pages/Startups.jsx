import { useState, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { TrendingUp, DollarSign, Users, RefreshCw } from 'lucide-react'

function formatNumber(n) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(1)}T`
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`
  return `$${n}`
}

const SORT_OPTIONS = [
  { value: 'mrr-desc', label: 'Highest MRR' },
  { value: 'mrr-asc', label: 'Lowest MRR' },
  { value: 'growth-desc', label: 'Fastest Growth' },
  { value: 'customers-desc', label: 'Most Customers' },
]

function Startups() {
  const { data, loading, errors, refreshKey } = useOutletContext()
  const [refreshing, setRefreshing] = useState(false)
  const [sortBy, setSortBy] = useState('mrr-desc')
  const [category, setCategory] = useState('all')
  const [forSaleOnly, setForSaleOnly] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await refreshKey('startups')
    setRefreshing(false)
  }

  const categories = useMemo(() => {
    if (!data.startups) return []
    const cats = [...new Set(data.startups.map((s) => s.category).filter(Boolean))]
    return cats.sort()
  }, [data.startups])

  const filtered = useMemo(() => {
    if (!data.startups) return []
    let list = [...data.startups]

    if (category !== 'all') {
      list = list.filter((s) => s.category === category)
    }
    if (forSaleOnly) {
      list = list.filter((s) => s.onSale)
    }

    const [field, dir] = sortBy.split('-')
    list.sort((a, b) => {
      let aVal, bVal
      if (field === 'mrr') { aVal = a.mrr ?? 0; bVal = b.mrr ?? 0 }
      else if (field === 'growth') { aVal = a.growth30d ?? 0; bVal = b.growth30d ?? 0 }
      else if (field === 'customers') { aVal = a.customers ?? 0; bVal = b.customers ?? 0 }
      return dir === 'desc' ? bVal - aVal : aVal - bVal
    })

    return list
  }, [data.startups, sortBy, category, forSaleOnly])

  return (
    <section className="section page-section">
      <div className="section-header">
        <div className="section-label">TrustMRR Data</div>
        <h2 className="section-title">
          Startup Revenue Landscape
          <button
            className="refresh-btn"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh startup data"
          >
            <RefreshCw size={18} className={refreshing ? 'spin' : ''} />
          </button>
        </h2>
        <p className="section-desc">
          Real verified revenue data from startups building in public.
        </p>
      </div>

      {data.startups ? (
        <>
          <div className="filters-bar">
            <div className="filter-chips">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`filter-chip ${sortBy === opt.value ? 'active' : ''}`}
                  onClick={() => setSortBy(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
              <button
                className={`filter-chip ${forSaleOnly ? 'sale-active' : ''}`}
                onClick={() => setForSaleOnly(!forSaleOnly)}
              >
                For Sale
              </button>
            </div>

            <div className="filter-right">
              <select
                className="filter-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <span className="filter-count">{filtered.length} startups</span>
            </div>
          </div>

          <div className="startups-grid">
            {filtered.map((s) => (
              <a
                key={s.slug || s.name}
                href={s.website || `https://trustmrr.com/${s.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="startup-card"
              >
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
              </a>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="error-msg">No startups match your filters.</p>
          )}
        </>
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
  )
}

export default Startups
