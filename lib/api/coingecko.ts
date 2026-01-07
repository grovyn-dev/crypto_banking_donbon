import axios from 'axios'
import { API_ENDPOINTS } from '@/lib/constants'

const API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY || ''
const BASE_URL = API_ENDPOINTS.coingecko.base

const api = axios.create({
  baseURL: BASE_URL,
  headers: API_KEY ? { 'x-cg-demo-api-key': API_KEY } : {},
  timeout: 10000,
})

export interface Coin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  last_updated: string
}

export interface GlobalMarketData {
  data: {
    active_cryptocurrencies: number
    upcoming_icos: number
    ongoing_icos: number
    ended_icos: number
    markets: number
    total_market_cap: { [key: string]: number }
    total_volume: { [key: string]: number }
    market_cap_percentage: { [key: string]: number }
    market_cap_change_percentage_24h_usd: number
    updated_at: number
  }
}

export interface TrendingCoin {
  item: {
    id: string
    coin_id: number
    name: string
    symbol: string
    market_cap_rank: number
    thumb: string
    small: string
    large: string
    slug: string
    price_btc: number
    score: number
  }
}

export interface CoinDetail extends Coin {
  description: { en: string }
  links: {
    homepage: string[]
    blockchain_site: string[]
    official_forum_url: string[]
    subreddit_url: string
    repos_url: { github: string[] }
  }
  market_data: {
    current_price: { [key: string]: number }
    market_cap: { [key: string]: number }
    total_volume: { [key: string]: number }
    price_change_percentage_24h: number
    price_change_percentage_7d: number
    price_change_percentage_30d: number
    price_change_percentage_1y: number
  }
}

export interface PriceHistory {
  prices: [number, number][]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

export class CoinGeckoService {
  async getMarkets(
    vsCurrency: string = 'usd',
    order: string = 'market_cap_desc',
    perPage: number = 100,
    page: number = 1
  ): Promise<Coin[]> {
    try {
      const response = await api.get(API_ENDPOINTS.coingecko.markets, {
        params: {
          vs_currency: vsCurrency,
          order,
          per_page: perPage,
          page,
          sparkline: false,
          price_change_percentage: '24h,7d,30d',
        },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching markets:', error)
      throw new Error('Failed to fetch market data')
    }
  }

  async getGlobalData(): Promise<GlobalMarketData> {
    try {
      const response = await api.get(API_ENDPOINTS.coingecko.global)
      return response.data
    } catch (error) {
      console.error('Error fetching global data:', error)
      throw new Error('Failed to fetch global market data')
    }
  }

  async getTrending(): Promise<TrendingCoin[]> {
    try {
      const response = await api.get(API_ENDPOINTS.coingecko.trending)
      return response.data.coins
    } catch (error) {
      console.error('Error fetching trending coins:', error)
      throw new Error('Failed to fetch trending coins')
    }
  }

  async getCoinDetail(coinId: string): Promise<CoinDetail> {
    try {
      const response = await api.get(`${API_ENDPOINTS.coingecko.coin}/${coinId}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: false,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching coin detail:', error)
      throw new Error('Failed to fetch coin details')
    }
  }

  async getPriceHistory(
    coinId: string,
    days: number = 7,
    vsCurrency: string = 'usd'
  ): Promise<PriceHistory> {
    try {
      const response = await api.get(
        `${API_ENDPOINTS.coingecko.coin}/${coinId}/market_chart`,
        {
          params: {
            vs_currency: vsCurrency,
            days,
            interval: days <= 1 ? 'hourly' : 'daily',
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('Error fetching price history:', error)
      throw new Error('Failed to fetch price history')
    }
  }

  async getPrices(coinIds: string[], vsCurrency: string = 'usd'): Promise<{ [key: string]: { [key: string]: number } }> {
    try {
      const response = await api.get(API_ENDPOINTS.coingecko.price, {
        params: {
          ids: coinIds.join(','),
          vs_currencies: vsCurrency,
          include_24hr_change: true,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching prices:', error)
      throw new Error('Failed to fetch prices')
    }
  }

  async searchCoins(query: string): Promise<Coin[]> {
    try {
      const response = await api.get('/search', {
        params: { query },
      })
      const coinIds = response.data.coins.slice(0, 10).map((coin: any) => coin.id)
      if (coinIds.length === 0) return []
      return this.getMarkets('usd', 'market_cap_desc', coinIds.length, 1)
    } catch (error) {
      console.error('Error searching coins:', error)
      throw new Error('Failed to search coins')
    }
  }
}

export const coinGeckoService = new CoinGeckoService()

