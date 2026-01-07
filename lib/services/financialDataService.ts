import { Wallet } from '@/models'
import { Transaction } from '@/models'
import { MarketCache } from '@/models'
import mongoose from 'mongoose'

interface DateRange {
  start: Date
  end: Date
}

interface FinancialMetrics {
  totalBalance: number
  totalBalanceUSD: number
  transactionCount: number
  totalVolume: number
  averageTransactionValue: number
  largestTransaction: number
  portfolioChange24h: number
  topCoins: Array<{
    symbol: string
    amount: number
    valueUSD: number
  }>
  transactionBreakdown: {
    incoming: number
    outgoing: number
    pending: number
    confirmed: number
    failed: number
  }
  marketData: {
    totalMarketCap: number
    btcDominance: number
    ethDominance: number
    marketCapChange24h: number
  }
}

export async function aggregateFinancialData(
  userId: string,
  dateRange: DateRange
): Promise<FinancialMetrics> {
  let userObjectId: mongoose.Types.ObjectId
  if (mongoose.Types.ObjectId.isValid(userId)) {
    userObjectId = new mongoose.Types.ObjectId(userId)
  } else {
    throw new Error('Invalid user ID format - must be a valid MongoDB ObjectId')
  }
  
  const wallets = await Wallet.find({ user: userObjectId })
  const walletIds = wallets.map(w => w._id)

  if (wallets.length === 0) {
    return {
      totalBalance: 0,
      totalBalanceUSD: 0,
      transactionCount: 0,
      totalVolume: 0,
      averageTransactionValue: 0,
      largestTransaction: 0,
      portfolioChange24h: 0,
      topCoins: [],
      transactionBreakdown: {
        incoming: 0,
        outgoing: 0,
        pending: 0,
        confirmed: 0,
        failed: 0,
      },
      marketData: {
        totalMarketCap: 0,
        btcDominance: 0,
        ethDominance: 0,
        marketCapChange24h: 0,
      },
    }
  }

  const transactions = await Transaction.find({
    wallet: { $in: walletIds },
    blockchainTimestamp: {
      $gte: dateRange.start,
      $lte: dateRange.end,
    },
  }).populate('wallet')

  const transactionCount = transactions.length
  let totalVolume = 0
  let largestTransaction = 0
  const transactionBreakdown = {
    incoming: 0,
    outgoing: 0,
    pending: 0,
    confirmed: 0,
    failed: 0,
  }

  transactions.forEach((tx) => {
    const amount = parseFloat(tx.amount.toString())
    totalVolume += amount
    largestTransaction = Math.max(largestTransaction, amount)

    if (tx.status === 'PENDING') transactionBreakdown.pending++
    else if (tx.status === 'CONFIRMED') transactionBreakdown.confirmed++
    else if (tx.status === 'FAILED') transactionBreakdown.failed++

    const walletAddress = (tx.wallet as any)?.address?.toLowerCase()
    if (tx.toAddress.toLowerCase() === walletAddress) {
      transactionBreakdown.incoming++
    } else if (tx.fromAddress.toLowerCase() === walletAddress) {
      transactionBreakdown.outgoing++
    }
  })

  const averageTransactionValue = transactionCount > 0 ? totalVolume / transactionCount : 0

  let totalBalance = 0
  const coinBalances: Record<string, { amount: number; symbol: string }> = {}

  for (const wallet of wallets) {
    const walletTransactions = transactions.filter(
      (tx) => (tx.wallet as any)?._id?.toString() === wallet._id.toString()
    )
    
    let walletBalance = 0
    walletTransactions.forEach((tx) => {
      const amount = parseFloat(tx.amount.toString())
      if (tx.toAddress.toLowerCase() === wallet.address.toLowerCase()) {
        walletBalance += amount
      } else if (tx.fromAddress.toLowerCase() === wallet.address.toLowerCase()) {
        walletBalance -= amount
      }
    })

    totalBalance += Math.max(0, walletBalance)
    
    const symbol = walletTransactions[0]?.tokenSymbol || 'ETH'
    if (!coinBalances[symbol]) {
      coinBalances[symbol] = { amount: 0, symbol }
    }
    coinBalances[symbol].amount += Math.max(0, walletBalance)
  }

  const ethCache = await MarketCache.findOne({ coinId: 'ethereum' })
  const btcCache = await MarketCache.findOne({ coinId: 'bitcoin' })
  
  const ethPrice = ethCache ? parseFloat(ethCache.priceUSD.toString()) : 0
  const totalBalanceUSD = totalBalance * ethPrice

  let marketData = {
    totalMarketCap: 0,
    btcDominance: 0,
    ethDominance: 0,
    marketCapChange24h: 0,
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const globalResponse = await fetch(`${baseUrl}/api/coingecko/global`, {
      cache: 'no-store',
    })
    if (globalResponse.ok) {
      const globalData = await globalResponse.json()
      if (globalData?.data) {
        marketData = {
          totalMarketCap: globalData.data.total_market_cap?.usd || 0,
          btcDominance: globalData.data.market_cap_percentage?.btc || 0,
          ethDominance: globalData.data.market_cap_percentage?.eth || 0,
          marketCapChange24h: globalData.data.market_cap_change_percentage_24h_usd || 0,
        }
      }
    }
  } catch (error) {
    console.error('Error fetching global market data:', error)
    marketData = {
      totalMarketCap: 0,
      btcDominance: 0,
      ethDominance: 0,
      marketCapChange24h: 0,
    }
  }

  const portfolioChange24h = 0

  const topCoins = Object.values(coinBalances)
    .map((coin) => {
      const cache = coin.symbol === 'ETH' ? ethCache : null
      const price = cache ? parseFloat(cache.priceUSD.toString()) : 0
      return {
        symbol: coin.symbol,
        amount: coin.amount,
        valueUSD: coin.amount * price,
      }
    })
    .sort((a, b) => b.valueUSD - a.valueUSD)
    .slice(0, 5)

  return {
    totalBalance,
    totalBalanceUSD,
    transactionCount,
    totalVolume,
    averageTransactionValue,
    largestTransaction,
    portfolioChange24h,
    topCoins,
    transactionBreakdown,
    marketData,
  }
}

