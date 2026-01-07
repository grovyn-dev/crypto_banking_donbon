import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3'
const API_KEY = process.env.COINGECKO_API_KEY || process.env.NEXT_PUBLIC_COINGECKO_API_KEY || ''

export async function GET(request: NextRequest) {
  try {
    const response = await axios.get(`${COINGECKO_BASE}/global`, {
      headers: API_KEY ? { 'x-cg-demo-api-key': API_KEY } : {},
      timeout: 10000,
    })

    return NextResponse.json(response.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error: any) {
    if (error.response?.status === 429) {
      console.warn('CoinGecko rate limit reached, returning fallback data')
    } else {
      console.error('CoinGecko API error:', error.message)
    }
    
    return NextResponse.json({
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
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=60',
      },
    })
  }
}

