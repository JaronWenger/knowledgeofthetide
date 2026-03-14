import {
  Brain, Leaf, Shield, Zap, Heart, Globe,
} from 'lucide-react'
import { ideas } from '../data/trends'

const iconMap = {
  brain: Brain,
  leaf: Leaf,
  shield: Shield,
  zap: Zap,
  heart: Heart,
  globe: Globe,
}

function Ideas() {
  return (
    <>
      <section className="section page-section">
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

    </>
  )
}

export default Ideas
