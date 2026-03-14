import { useOutletContext } from 'react-router-dom'
import { TrendingUp, MessageSquare, ExternalLink } from 'lucide-react'

function timeAgo(utc) {
  const diff = Date.now() / 1000 - utc
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function Community() {
  const { data, loading } = useOutletContext()

  return (
    <section className="section page-section">
      <div className="section-header">
        <div className="section-label">Reddit Pulse</div>
        <h2 className="section-title">What Founders Are Talking About</h2>
        <p className="section-desc">
          Trending discussions from startup and entrepreneurship communities.
        </p>
      </div>

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
  )
}

export default Community
