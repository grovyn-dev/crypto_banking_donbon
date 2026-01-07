'use client'

import React, { useEffect, useMemo } from 'react'
import { Card } from '@/components/ui/Card'
import { useWeb3 } from '@/hooks/useWeb3'
import { useMarkets } from '@/hooks/useMarkets'
import { useTransactions } from '@/hooks/useTransactions'
import { useAuthStore } from '@/store/authStore'
import { formatBalance, formatCurrency, formatAddress, formatNumber } from '@/lib/utils'
import { format } from 'date-fns'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { AIReportCard } from '@/components/reports/AIReportCard'

function DashboardContent() {
  const { user } = useAuthStore()
  const { wallet, isConnected, refreshBalance, connect } = useWeb3()
  const { globalData, coins, loading: marketsLoading } = useMarkets()
  const { transactions, loading: txLoading } = useTransactions(wallet?.address || null)

  useEffect(() => {
    if (isConnected) {
      refreshBalance()
      const interval = setInterval(refreshBalance, 30000)
      return () => clearInterval(interval)
    }
  }, [isConnected, refreshBalance])

  const totalBalance = wallet ? parseFloat(wallet.balance) : 0
  const ethPrice = coins?.find(c => c.symbol.toLowerCase() === 'eth')?.current_price || 0
  const balanceUSD = totalBalance * ethPrice

  const assetDistribution = useMemo(() => {
    if (!wallet || totalBalance === 0) return []
    return [
      {
        name: 'Ethereum',
        value: totalBalance,
        symbol: 'ETH',
        percentage: 100,
        usdValue: balanceUSD,
      },
    ]
  }, [wallet, totalBalance, balanceUSD])

  const transactionChartData = useMemo(() => {
    if (!transactions.length) return []
    
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return {
        date: format(date, 'MMM d'),
        incoming: 0,
        outgoing: 0,
      }
    })

    transactions.forEach((tx) => {
      const txDate = new Date(tx.timestamp * 1000)
      const dayIndex = Math.floor((Date.now() - txDate.getTime()) / (1000 * 60 * 60 * 24))
      if (dayIndex >= 0 && dayIndex < 7) {
        const dataPoint = last7Days[6 - dayIndex]
        if (tx.type === 'incoming') {
          dataPoint.incoming += parseFloat(tx.value) / 1e18
        } else {
          dataPoint.outgoing += parseFloat(tx.value) / 1e18
        }
      }
    })

    return last7Days
  }, [transactions])

  const COLORS = ['#FF6B35', '#F7931E', '#FFA500', '#FF8C00']

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">
            Welcome back, {user?.email?.split('@')[0] || 'User'}
          </p>
        </div>

        <Card variant="glass" glow className="mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-2">Total Balance</p>
              <div className="flex items-baseline gap-3">
                <p className="text-5xl font-bold text-white">
                  {formatBalance(totalBalance)} ETH
                </p>
                {ethPrice > 0 && (
                  <p className="text-2xl text-gray-400">
                    ≈ {formatCurrency(balanceUSD)}
                  </p>
                )}
              </div>
              {wallet && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-sm text-gray-400">
                    {wallet.network.name}
                  </p>
                </div>
              )}
            </div>
            {!isConnected && (
              <button
                onClick={connect}
                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors mt-4 md:mt-0"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card variant="glass" className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-white mb-4">Wallet Overview</h2>
            {isConnected && wallet ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Wallet Address</p>
                  <div className="flex items-center gap-2">
                    <p className="text-primary-500 font-mono text-sm break-all">
                      {formatAddress(wallet.address)}
                    </p>
                    <button
                      onClick={() => navigator.clipboard.writeText(wallet.address)}
                      className="text-gray-400 hover:text-primary-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="pt-4 border-t border-dark-700">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-400">Network</p>
                    <p className="text-white font-medium">{wallet.network.name}</p>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-400">Chain ID</p>
                    <p className="text-white font-medium">{wallet.network.chainId}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">Status</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <p className="text-green-400 text-sm font-medium">Connected</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-gray-400 mb-4">Connect your wallet to view details</p>
                <button
                  onClick={connect}
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
                >
                  Connect Wallet
                </button>
              </div>
            )}
          </Card>

          <Card variant="glass" className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-white mb-4">Market Snapshot</h2>
            {globalData ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-dark-900 rounded-lg border border-dark-700">
                  <p className="text-xs text-gray-400 mb-1">Total Market Cap</p>
                  <p className="text-lg font-semibold text-white break-words overflow-hidden">
                    ${formatNumber(globalData.data.total_market_cap.usd)}
                  </p>
                </div>
                <div className="p-4 bg-dark-900 rounded-lg border border-dark-700">
                  <p className="text-xs text-gray-400 mb-1">24h Volume</p>
                  <p className="text-lg font-semibold text-white break-words overflow-hidden">
                    ${formatNumber(globalData.data.total_volume.usd)}
                  </p>
                </div>
                <div className="p-4 bg-dark-900 rounded-lg border border-dark-700">
                  <p className="text-xs text-gray-400 mb-1">BTC Dominance</p>
                  <p className="text-lg font-semibold text-white">
                    {globalData.data.market_cap_percentage.btc.toFixed(2)}%
                  </p>
                </div>
                <div className="p-4 bg-dark-900 rounded-lg border border-dark-700">
                  <p className="text-xs text-gray-400 mb-1">ETH Dominance</p>
                  <p className="text-lg font-semibold text-white">
                    {globalData.data.market_cap_percentage.eth.toFixed(2)}%
                  </p>
                </div>
                <div className="p-4 bg-dark-900 rounded-lg border border-dark-700 col-span-2 md:col-span-4">
                  <p className="text-xs text-gray-400 mb-1">24h Market Cap Change</p>
                  <p className={`text-lg font-semibold ${
                    globalData.data.market_cap_change_percentage_24h_usd >= 0
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}>
                    {globalData.data.market_cap_change_percentage_24h_usd >= 0 ? '+' : ''}
                    {globalData.data.market_cap_change_percentage_24h_usd.toFixed(2)}%
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <p className="text-gray-400">Loading market data...</p>
              </div>
            )}
          </Card>
        </div>

        <AIReportCard />

        <Card variant="glass" className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Asset Distribution</h2>
          {isConnected && wallet ? (
            totalBalance > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {assetDistribution.map((asset, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-dark-900 rounded-lg border border-dark-700">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-primary-500 font-bold text-lg">{asset.symbol}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{asset.name}</p>
                          <p className="text-sm text-gray-400">{asset.percentage}% of portfolio</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">{formatBalance(asset.value)} {asset.symbol}</p>
                        <p className="text-sm text-gray-400">{formatCurrency(asset.usdValue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={assetDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {assetDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatBalance(value) + ' ETH'} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-400 mb-2">No assets found</p>
                <p className="text-gray-500 text-sm">Your wallet balance is 0 ETH</p>
              </div>
            )
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-gray-400 mb-2">Connect your wallet to view asset distribution</p>
              <button
                onClick={connect}
                className="mt-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
              >
                Connect Wallet
              </button>
            </div>
          )}
        </Card>

        <Card variant="glass">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
            {transactions.length > 0 && (
              <p className="text-sm text-gray-400">
                Showing {Math.min(transactions.length, 5)} of {transactions.length}
              </p>
            )}
          </div>
          {txLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-400">Loading transactions...</p>
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Hash</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">From</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">To</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 5).map((tx) => (
                      <tr
                        key={tx.hash}
                        className="border-b border-dark-800 hover:bg-dark-900/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <a
                            href={`https://etherscan.io/tx/${tx.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-500 hover:text-primary-400 font-mono text-sm"
                          >
                            {formatAddress(tx.hash)}
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            tx.type === 'incoming'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-gray-300 font-mono text-sm">
                            {formatAddress(tx.from)}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-gray-300 font-mono text-sm">
                            {formatAddress(tx.to)}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-white font-medium">
                          {formatBalance(parseFloat(tx.value) / 1e18)} ETH
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            tx.status === 'confirmed'
                              ? 'bg-green-500/20 text-green-400'
                              : tx.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-400 text-sm">
                          {format(new Date(tx.timestamp * 1000), 'MMM d, yyyy HH:mm')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {transactionChartData.length > 0 && (
                <div className="mt-6 pt-6 border-t border-dark-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Transaction Activity (Last 7 Days)</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={transactionChartData}>
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        formatter={(value: number) => formatBalance(value) + ' ETH'}
                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      />
                      <Legend />
                      <Bar dataKey="incoming" fill="#10B981" name="Incoming" />
                      <Bar dataKey="outgoing" fill="#EF4444" name="Outgoing" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No transactions found</p>
              {!isConnected && (
                <p className="text-sm text-gray-500 mt-2">Connect your wallet to view transaction history</p>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return <DashboardContent />
}
