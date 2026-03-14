import { useState, useEffect, useCallback } from 'react'
import { getGlobalSnapshot, getGrowthLeaders } from '../services/worldbank'
import { getTrendingPosts, getSubredditBuzz } from '../services/reddit'
import { getTopStartups } from '../services/trustmrr'
import { getEconomicIndicators } from '../services/fred'

const fetchers = {
  worldBank: getGlobalSnapshot,
  growthLeaders: getGrowthLeaders,
  redditPosts: getTrendingPosts,
  subredditBuzz: getSubredditBuzz,
  startups: getTopStartups,
  fred: getEconomicIndicators,
}

export function useMarketData() {
  const [data, setData] = useState({
    worldBank: null,
    growthLeaders: null,
    redditPosts: null,
    subredditBuzz: null,
    startups: null,
    fred: null,
  })
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    let cancelled = false

    async function fetchAll() {
      const keys = Object.keys(fetchers)
      const results = await Promise.allSettled(keys.map((k) => fetchers[k]()))

      if (cancelled) return

      const newData = {}
      const newErrors = {}

      results.forEach((result, i) => {
        if (result.status === 'fulfilled') {
          newData[keys[i]] = result.value
        } else {
          newErrors[keys[i]] = result.reason?.message || 'Failed to load'
          newData[keys[i]] = null
        }
      })

      setData(newData)
      setErrors(newErrors)
      setLoading(false)
    }

    fetchAll()
    return () => { cancelled = true }
  }, [])

  const refreshKey = useCallback(async (key) => {
    const fn = fetchers[key]
    if (!fn) return
    try {
      const result = await fn()
      setData((prev) => ({ ...prev, [key]: result }))
      setErrors((prev) => { const next = { ...prev }; delete next[key]; return next })
    } catch (err) {
      setErrors((prev) => ({ ...prev, [key]: err.message }))
    }
  }, [])

  return { data, loading, errors, refreshKey }
}
