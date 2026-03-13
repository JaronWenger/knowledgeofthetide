// FRED (Federal Reserve Economic Data) — via Cloudflare Worker proxy

const WORKER_URL = import.meta.env.VITE_WORKER_URL || ''

const SERIES = {
  unemployment: { id: 'UNRATE', label: 'Unemployment Rate', unit: '%' },
  inflation: { id: 'CPIAUCSL', label: 'CPI (Inflation)', unit: 'index', transform: 'pc1' },
  fedRate: { id: 'FEDFUNDS', label: 'Fed Funds Rate', unit: '%' },
  gdpGrowth: { id: 'A191RL1Q225SBEA', label: 'GDP Growth', unit: '%' },
  consumerSentiment: { id: 'UMCSENT', label: 'Consumer Sentiment', unit: 'index' },
}

async function fetchSeries(seriesId, limit = 12, units = 'lin') {
  if (!WORKER_URL) return null
  const params = new URLSearchParams({
    series_id: seriesId,
    sort_order: 'desc',
    limit: limit.toString(),
    units,
  })
  const url = `${WORKER_URL}/api/fred/series/observations?${params}`
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`FRED error: ${res.status}`)
  return res.json()
}

export async function getEconomicIndicators() {
  if (!WORKER_URL) return null

  const results = {}

  const entries = Object.entries(SERIES)
  const fetches = await Promise.allSettled(
    entries.map(([key, config]) =>
      fetchSeries(config.id, 12, config.transform || 'lin')
    )
  )

  entries.forEach(([key, config], i) => {
    const result = fetches[i]
    if (result.status === 'fulfilled' && result.value?.observations) {
      const obs = result.value.observations
        .filter((o) => o.value !== '.')
        .map((o) => ({ date: o.date, value: parseFloat(o.value) }))
        .reverse()

      results[key] = {
        label: config.label,
        unit: config.unit,
        current: obs.length > 0 ? obs[obs.length - 1].value : null,
        previous: obs.length > 1 ? obs[obs.length - 2].value : null,
        history: obs,
      }
    }
  })

  return Object.keys(results).length > 0 ? results : null
}
