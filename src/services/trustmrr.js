// TrustMRR — live data via Cloudflare Worker proxy, with static fallback

const WORKER_URL = import.meta.env.VITE_WORKER_URL || ''

async function fetchFromWorker(path, params = {}) {
  if (!WORKER_URL) return null
  const query = new URLSearchParams(params).toString()
  const url = `${WORKER_URL}/api/trustmrr/${path}${query ? `?${query}` : ''}`
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`TrustMRR error: ${res.status}`)
  return res.json()
}

function formatStartup(s) {
  return {
    name: s.name,
    slug: s.slug,
    description: s.description,
    website: s.website,
    category: s.category,
    icon: s.icon,
    revenue30d: s.revenue?.last30Days ? s.revenue.last30Days / 100 : null,
    mrr: s.revenue?.mrr ? s.revenue.mrr / 100 : null,
    totalRevenue: s.revenue?.total ? s.revenue.total / 100 : null,
    customers: s.customers,
    growth30d: s.growth30d ? +(s.growth30d * 100).toFixed(1) : null,
    profitMargin: s.profitMarginLast30Days,
    askingPrice: s.askingPrice ? s.askingPrice / 100 : null,
    onSale: s.onSale,
    rank: s.rank,
    techStack: s.techStack || [],
    visitors: s.visitorsLast30Days,
  }
}

const FALLBACK = [
  { name: 'ShipFast', slug: 'shipfast', category: 'saas', mrr: 45000, growth30d: 12.5, customers: 3200, description: 'The NextJS boilerplate with all you need to build your SaaS.', onSale: false },
  { name: 'ByeDispute', slug: 'byedispute', category: 'fintech', mrr: 28000, growth30d: 8.3, customers: 450, description: 'Chargeback prevention and management for online businesses.', onSale: false },
  { name: 'CodeFast', slug: 'codefast', category: 'ai', mrr: 32000, growth30d: 15.2, customers: 1800, description: 'Learn to code and ship your startup fast with AI.', onSale: false },
  { name: 'ZenVoice', slug: 'zenvoice', category: 'saas', mrr: 18000, growth30d: 6.7, customers: 920, description: 'Self-serve invoices for Stripe.', onSale: true },
  { name: 'DataFast', slug: 'datafast', category: 'ai', mrr: 12000, growth30d: 22.1, customers: 340, description: 'Collect user feedback and testimonials with AI.', onSale: false },
  { name: 'LogoFast', slug: 'logofast', category: 'design', mrr: 8500, growth30d: 4.2, customers: 5600, description: 'Make beautiful logos with AI in 5 minutes.', onSale: true },
]

export async function getTopStartups(limit = 12) {
  try {
    const result = await fetchFromWorker('startups', { limit, sort: 'revenue-desc' })
    if (result?.data) return result.data.map(formatStartup)
  } catch {
    // fall through to static data
  }
  return FALLBACK.slice(0, limit)
}
