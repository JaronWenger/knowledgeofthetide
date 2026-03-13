import { useState, useEffect } from 'react'
import { getGlobalSnapshot, getGrowthLeaders } from '../services/worldbank'
import { getTrendingPosts, getSubredditBuzz } from '../services/reddit'
import { getTopStartups } from '../services/trustmrr'
import { getEconomicIndicators } from '../services/fred'

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
      const results = await Promise.allSettled([
        getGlobalSnapshot(),
        getGrowthLeaders(),
        getTrendingPosts(),
        getSubredditBuzz(),
        getTopStartups(),
        getEconomicIndicators(),
      ])

      if (cancelled) return

      const keys = ['worldBank', 'growthLeaders', 'redditPosts', 'subredditBuzz', 'startups', 'fred']
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

  return { data, loading, errors }
}
