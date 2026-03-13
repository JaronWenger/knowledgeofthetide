const PROXIES = [
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
]

const SUBREDDITS = [
  { name: 'startups', sort: 'top', time: 'week' },
  { name: 'SideProject', sort: 'hot', time: 'week' },
  { name: 'Entrepreneur', sort: 'top', time: 'week' },
  { name: 'smallbusiness', sort: 'top', time: 'week' },
]

async function fetchWithProxy(redditUrl) {
  for (const makeUrl of PROXIES) {
    try {
      const res = await fetch(makeUrl(redditUrl), {
        signal: AbortSignal.timeout(8000),
      })
      if (!res.ok) continue
      const text = await res.text()
      const json = JSON.parse(text)
      if (json?.data?.children) return json
    } catch {
      continue
    }
  }
  throw new Error('All proxies failed')
}

async function fetchSubreddit(subreddit, sort = 'top', time = 'week', limit = 10) {
  const redditUrl = `https://www.reddit.com/r/${subreddit}/${sort}.json?t=${time}&limit=${limit}&raw_json=1`
  const json = await fetchWithProxy(redditUrl)

  return json.data.children
    .filter((c) => c.kind === 't3')
    .map((c) => {
      const d = c.data
      return {
        id: d.id,
        title: d.title,
        author: d.author,
        score: d.score,
        comments: d.num_comments,
        url: d.url,
        permalink: `https://reddit.com${d.permalink}`,
        created: d.created_utc,
        subreddit: d.subreddit,
        flair: d.link_flair_text,
        selftext: d.selftext?.slice(0, 200) || '',
        upvoteRatio: d.upvote_ratio,
      }
    })
}

export async function getTrendingPosts() {
  const allPosts = []

  const results = await Promise.allSettled(
    SUBREDDITS.map((sub) => fetchSubreddit(sub.name, sub.sort, sub.time, 8))
  )

  for (const result of results) {
    if (result.status === 'fulfilled') {
      allPosts.push(...result.value)
    }
  }

  if (allPosts.length === 0) return null

  const seen = new Set()
  return allPosts
    .filter((p) => {
      if (seen.has(p.id)) return false
      seen.add(p.id)
      return true
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
}

export async function getSubredditBuzz() {
  const results = await Promise.allSettled(
    SUBREDDITS.map(async (sub) => {
      const posts = await fetchSubreddit(sub.name, sub.sort, sub.time, 25)
      const totalScore = posts.reduce((sum, p) => sum + p.score, 0)
      const avgComments = posts.reduce((sum, p) => sum + p.comments, 0) / (posts.length || 1)
      return {
        subreddit: sub.name,
        postCount: posts.length,
        totalScore,
        avgComments: Math.round(avgComments),
        topPost: posts[0] || null,
      }
    })
  )

  const fulfilled = results
    .filter((r) => r.status === 'fulfilled')
    .map((r) => r.value)
    .sort((a, b) => b.totalScore - a.totalScore)

  return fulfilled.length > 0 ? fulfilled : null
}
