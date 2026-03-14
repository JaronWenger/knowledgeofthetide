import { Database } from 'lucide-react'
import { dataSources } from '../data/trends'

function Sources() {
  return (
    <section className="section page-section">
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
  )
}

export default Sources
