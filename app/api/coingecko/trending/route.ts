import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3'
const API_KEY = process.env.COINGECKO_API_KEY || process.env.NEXT_PUBLIC_COINGECKO_API_KEY || ''

export async function GET(request: NextRequest) {
  try {
    const response = await axios.get(`${COINGECKO_BASE}/search/trending`, {
      headers: API_KEY ? { 'x-cg-demo-api-key': API_KEY } : {},
      timeout: 10000,
    })

    return NextResponse.json(response.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error: any) {
    if (error.response?.status === 429) {
      console.warn('CoinGecko rate limit reached, returning empty trending data')
    } else {
      console.error('CoinGecko API error:', error.message)
    }
    
    return NextResponse.json({
      coins: [],
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=60',
      },
    })
  }
}

