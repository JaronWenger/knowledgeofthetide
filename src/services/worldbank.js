const BASE = 'https://api.worldbank.org/v2'

const INDICATORS = {
  gdpGrowth: 'NY.GDP.MKTP.KD.ZG',
  gdp: 'NY.GDP.MKTP.CD',
  population: 'SP.POP.TOTL',
  gdpPerCapita: 'NY.GDP.PCAP.CD',
  inflation: 'FP.CPI.TOTL.ZG',
  unemployment: 'SL.UEM.TOTL.ZS',
}

async function fetchIndicator(countryCode, indicatorId, years = 5) {
  const url = `${BASE}/country/${countryCode}/indicator/${indicatorId}?format=json&per_page=${years}&mrv=${years}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`World Bank API error: ${res.status}`)
  const json = await res.json()
  const data = json[1]
  if (!data) return []
  return data
    .filter((d) => d.value !== null)
    .map((d) => ({
      date: d.date,
      value: d.value,
      country: d.country.value,
      countryCode: d.countryiso3code,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export async function getGlobalSnapshot(countries = ['US', 'CN', 'GB', 'DE', 'IN', 'JP']) {
  const results = {}

  const promises = countries.map(async (code) => {
    const [gdpGrowth, gdpPerCapita, inflation, unemployment] = await Promise.all([
      fetchIndicator(code, INDICATORS.gdpGrowth, 3).catch(() => []),
      fetchIndicator(code, INDICATORS.gdpPerCapita, 1).catch(() => []),
      fetchIndicator(code, INDICATORS.inflation, 3).catch(() => []),
      fetchIndicator(code, INDICATORS.unemployment, 1).catch(() => []),
    ])

    const latest = (arr) => (arr.length ? arr[arr.length - 1] : null)

    results[code] = {
      country: latest(gdpGrowth)?.country || code,
      gdpGrowth: gdpGrowth.map((d) => ({ year: d.date, value: +d.value.toFixed(2) })),
      gdpPerCapita: latest(gdpPerCapita)?.value
        ? +latest(gdpPerCapita).value.toFixed(0)
        : null,
      inflation: latest(inflation)?.value
        ? +latest(inflation).value.toFixed(2)
        : null,
      unemployment: latest(unemployment)?.value
        ? +latest(unemployment).value.toFixed(2)
        : null,
    }
  })

  await Promise.all(promises)
  return results
}

export async function getGrowthLeaders() {
  const url = `${BASE}/country/all/indicator/${INDICATORS.gdpGrowth}?format=json&per_page=300&mrv=1&mrnev=1`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`World Bank API error: ${res.status}`)
  const json = await res.json()
  const data = json[1]
  if (!data) return []

  return data
    .filter((d) => d.value !== null && d.value > 0 && d.countryiso3code)
    .map((d) => ({
      country: d.country.value,
      code: d.countryiso3code,
      growth: +d.value.toFixed(2),
      year: d.date,
    }))
    .sort((a, b) => b.growth - a.growth)
    .slice(0, 15)
}
