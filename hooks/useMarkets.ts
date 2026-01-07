import { useState, useEffect, useCallback } from 'react'
import { Coin, GlobalMarketData, TrendingCoin } from '@/lib/api/coingecko'

export function useMarkets() {
  const [coins, setCoins] = useState<Coin[]>([])
  const [globalData, setGlobalData] = useState<GlobalMarketData | null>(null)
  const [trending, setTrending] = useState<TrendingCoin[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMarkets = useCallback(async (page: number = 1, perPage: number = 100) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: perPage.toString(),
        page: page.toString(),
      })
      
      const response = await fetch(`/api/coingecko/markets?${params}`)
      const data = await response.json()
      
      if (response.status === 429) {
        setError('Rate limit exceeded. Please try again in a few moments.')
        setCoins([])
      } else if (data.error) {
        setError(data.error)
        setCoins(data.coins || [])
      } else if (Array.isArray(data)) {
        setCoins(data)
      } else if (data.coins) {
        setCoins(data.coins)
      } else {
        setCoins([])
        if (!response.ok) {
          setError('Failed to fetch markets')
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch markets')
      setCoins([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchGlobalData = useCallback(async () => {
    try {
      const response = await fetch('/api/coingecko/global')
      if (!response.ok) {
        throw new Error('Failed to fetch global data')
      }
      const data = await response.json()
      setGlobalData(data)
    } catch (err: any) {
      console.error('Error fetching global data:', err)
      setGlobalData({
        data: {
          active_cryptocurrencies: 0,
          upcoming_icos: 0,
          ongoing_icos: 0,
          ended_icos: 0,
          markets: 0,
          total_market_cap: { usd: 0 },
          total_volume: { usd: 0 },
          market_cap_percentage: { btc: 0, eth: 0 },
          market_cap_change_percentage_24h_usd: 0,
          updated_at: Date.now(),
        },
      })
    }
  }, [])

  const fetchTrending = useCallback(async () => {
    try {
      const response = await fetch('/api/coingecko/trending')
      if (!response.ok) {
        throw new Error('Failed to fetch trending')
      }
      const data = await response.json()
      setTrending(data?.coins || [])
    } catch (err: any) {
      console.error('Error fetching trending:', err)
      setTrending([]) // Set empty array on error
    }
  }, [])

  useEffect(() => {
    fetchMarkets()
    fetchGlobalData()
    fetchTrending()
  }, [fetchMarkets, fetchGlobalData, fetchTrending])

  return {
    coins,
    globalData,
    trending,
    loading,
    error,
    refetch: fetchMarkets,
  }
}

