'use client'

import React, { useState, useMemo } from 'react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useMarkets } from '@/hooks/useMarkets'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { Coin } from '@/lib/api/coingecko'

export default function MarketsPage() {
  const { coins, globalData, trending, loading, error } = useMarkets()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'market_cap' | 'price_change_24h'>('market_cap')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const filteredAndSortedCoins = useMemo(() => {
    if (!coins || coins.length === 0) return []
    
    let filtered = coins.filter(coin => coin && coin.id)

    if (searchQuery) {
      filtered = filtered.filter(
        coin =>
          coin.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          coin.symbol?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    filtered = [...filtered].sort((a, b) => {
      let aValue: number, bValue: number

      if (sortBy === 'market_cap') {
        aValue = a.market_cap || 0
        bValue = b.market_cap || 0
      } else {
        aValue = a.price_change_percentage_24h || 0
        bValue = b.price_change_percentage_24h || 0
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
    })

    return filtered
  }, [coins, searchQuery, sortBy, sortOrder])

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Markets</h1>
          {globalData && (
            <div className="text-right">
              <p className="text-sm text-gray-400">Market Cap</p>
              <p className="text-xl font-semibold text-white">
                {formatCurrency(globalData.data.total_market_cap.usd)}
              </p>
            </div>
          )}
        </div>

        {trending.length > 0 && (
          <Card variant="glass" className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Trending Coins</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {trending.slice(0, 5).map((coin) => (
                <div key={coin.item.id} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2">
                    <img
                      src={coin.item.thumb}
                      alt={coin.item.name}
                      className="w-full h-full rounded-full"
                    />
                  </div>
                  <p className="text-sm font-medium text-white">{coin.item.symbol.toUpperCase()}</p>
                  <p className="text-xs text-gray-400">#{coin.item.market_cap_rank}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search coins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'market_cap' | 'price_change_24h')}
              className="px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="market_cap">Market Cap</option>
              <option value="price_change_24h">24h Change</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white hover:border-primary-500 transition-colors"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        <Card variant="glass">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-4"></div>
              <p className="text-gray-400">Loading markets...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 mb-2">Error loading markets</p>
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
          ) : filteredAndSortedCoins.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-400 mb-2">No coins available</p>
              <p className="text-gray-500 text-sm">
                {coins.length === 0 
                  ? 'CoinGecko API rate limit reached. Please try again in a few moments.'
                  : 'No coins match your search criteria.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">#</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Coin</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Price</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">24h Change</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Market Cap</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedCoins.map((coin) => (
                    <tr
                      key={coin.id}
                      className="border-b border-dark-800 hover:bg-dark-900/50 transition-colors"
                    >
                      <td className="py-4 px-4 text-gray-400">{coin.market_cap_rank || 'N/A'}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {coin.image && (
                            <img
                              src={coin.image}
                              alt={coin.name || 'Coin'}
                              className="w-8 h-8 rounded-full"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none'
                              }}
                            />
                          )}
                          <div>
                            <p className="text-white font-medium">{coin.name || 'Unknown'}</p>
                            <p className="text-sm text-gray-400">{(coin.symbol || '').toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right text-white font-semibold">
                        {coin.current_price ? formatCurrency(coin.current_price) : 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {coin.price_change_percentage_24h !== null && coin.price_change_percentage_24h !== undefined ? (
                          <span
                            className={`font-semibold ${
                              coin.price_change_percentage_24h >= 0
                                ? 'text-green-400'
                                : 'text-red-400'
                            }`}
                          >
                            {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                            {coin.price_change_percentage_24h.toFixed(2)}%
                          </span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-300">
                        {coin.market_cap ? formatCurrency(coin.market_cap) : 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-300">
                        {coin.total_volume ? formatCurrency(coin.total_volume) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

