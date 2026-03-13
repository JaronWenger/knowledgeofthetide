// Cloudflare Worker — API proxy for Knowledge of the Tide
// Handles CORS and keeps API keys server-side (safe)
//
// Environment variables (set in Cloudflare dashboard):
//   TRUSTMRR_API_KEY  — your tmrr_ key from trustmrr.com/dashboard-dev
//   FRED_API_KEY      — your key from fred.stlouisfed.org
//   ALLOWED_ORIGIN    — your site URL (e.g. https://jaronwenger.github.io)

const API_CONFIGS = {
  trustmrr: {
    base: 'https://trustmrr.com/api/v1',
    authHeader: (env) => `Bearer ${env.TRUSTMRR_API_KEY}`,
  },
  fred: {
    base: 'https://api.stlouisfed.org/fred',
    addKey: (url, env) => {
      const u = new URL(url)
      u.searchParams.set('api_key', env.FRED_API_KEY)
      u.searchParams.set('file_type', 'json')
      return u.toString()
    },
  },
}

function corsHeaders(origin, allowedOrigin) {
  const allowed = !allowedOrigin || origin === allowedOrigin || allowedOrigin === '*'
  return {
    'Access-Control-Allow-Origin': allowed ? origin || '*' : '',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const origin = request.headers.get('Origin') || ''
    const headers = corsHeaders(origin, env.ALLOWED_ORIGIN)

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers })
    }

    // Only allow GET
    if (request.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...headers, 'Content-Type': 'application/json' },
      })
    }

    // Route: /api/{service}/{path}
    // e.g. /api/trustmrr/startups?limit=10
    // e.g. /api/fred/series/observations?series_id=UNRATE
    const match = url.pathname.match(/^\/api\/(\w+)\/(.+)/)
    if (!match) {
      return new Response(JSON.stringify({
        error: 'Invalid route',
        usage: '/api/{service}/{path} — services: trustmrr, fred',
      }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
      })
    }

    const [, service, path] = match
    const config = API_CONFIGS[service]

    if (!config) {
      return new Response(JSON.stringify({
        error: `Unknown service: ${service}`,
        available: Object.keys(API_CONFIGS),
      }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
      })
    }

    // Build upstream URL
    let upstreamUrl = `${config.base}/${path}${url.search}`

    // Add API key for FRED
    if (config.addKey) {
      upstreamUrl = config.addKey(upstreamUrl, env)
    }

    // Build upstream request headers
    const upstreamHeaders = { 'Content-Type': 'application/json' }
    if (config.authHeader) {
      upstreamHeaders['Authorization'] = config.authHeader(env)
    }

    try {
      const response = await fetch(upstreamUrl, { headers: upstreamHeaders })
      const body = await response.text()

      return new Response(body, {
        status: response.status,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300', // cache 5 min
        },
      })
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Upstream request failed', detail: err.message }), {
        status: 502,
        headers: { ...headers, 'Content-Type': 'application/json' },
      })
    }
  },
}
