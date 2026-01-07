import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3'
const API_KEY = process.env.COINGECKO_API_KEY || process.env.NEXT_PUBLIC_COINGECKO_API_KEY || ''

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const vsCurrency = searchParams.get('vs_currency') || 'usd'
    const order = searchParams.get('order') || 'market_cap_desc'
    const perPage = parseInt(searchParams.get('per_page') || '100')
    const page = parseInt(searchParams.get('page') || '1')

    const response = await axios.get(`${COINGECKO_BASE}/coins/markets`, {
      params: {
        vs_currency: vsCurrency,
        order,
        per_page: perPage,
        page,
        sparkline: false,
        price_change_percentage: '24h,7d,30d',
      },
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
      console.warn('CoinGecko rate limit reached, returning empty array')
      return NextResponse.json(
        { error: 'Rate limit exceeded', coins: [] },
        { 
          status: 429,
          headers: {
            'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=60',
          },
        }
      )
    } else {
      console.error('CoinGecko API error:', error.message)
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch markets', coins: [] },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=60',
        },
      }
    )
  }
}

