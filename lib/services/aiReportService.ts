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

interface AIReport {
  executive_summary: string
  portfolio_performance: string
  transaction_overview: string
  risk_analysis: string
  observations: string
}

const OLLAMA_ENDPOINT = 'http://localhost:11434/api/generate'
const MODEL = 'tinyllama'

export async function generateAIReport(metrics: FinancialMetrics): Promise<AIReport> {
  const prompt = `You are a financial analyst. Analyze and explain the following cryptocurrency portfolio data. 
DO NOT calculate or invent any numbers. Only explain and interpret the provided metrics.

PORTFOLIO DATA:
- Total Balance: ${metrics.totalBalance.toFixed(4)} ETH ($${metrics.totalBalanceUSD.toFixed(2)} USD)
- Transaction Count: ${metrics.transactionCount}
- Total Volume: ${metrics.totalVolume.toFixed(4)} ETH
- Average Transaction Value: ${metrics.averageTransactionValue.toFixed(4)} ETH
- Largest Transaction: ${metrics.largestTransaction.toFixed(4)} ETH
- Portfolio Change (24h): ${metrics.portfolioChange24h.toFixed(2)}%

TOP HOLDINGS:
${metrics.topCoins.map(coin => `- ${coin.symbol}: ${coin.amount.toFixed(4)} ($${coin.valueUSD.toFixed(2)})`).join('\n')}

TRANSACTION BREAKDOWN:
- Incoming: ${metrics.transactionBreakdown.incoming}
- Outgoing: ${metrics.transactionBreakdown.outgoing}
- Pending: ${metrics.transactionBreakdown.pending}
- Confirmed: ${metrics.transactionBreakdown.confirmed}
- Failed: ${metrics.transactionBreakdown.failed}

MARKET DATA:
- Total Market Cap: $${metrics.marketData.totalMarketCap.toLocaleString()}
- BTC Dominance: ${metrics.marketData.btcDominance.toFixed(2)}%
- ETH Dominance: ${metrics.marketData.ethDominance.toFixed(2)}%
- Market Cap Change (24h): ${metrics.marketData.marketCapChange24h.toFixed(2)}%

Generate a financial report in JSON format with exactly these sections:
1. executive_summary: Brief overview of portfolio status
2. portfolio_performance: Analysis of portfolio value and changes
3. transaction_overview: Analysis of transaction activity
4. risk_analysis: Risk assessment based on provided data
5. observations: Key insights and observations

Return ONLY valid JSON in this exact format:
{
  "executive_summary": "...",
  "portfolio_performance": "...",
  "transaction_overview": "...",
  "risk_analysis": "...",
  "observations": "..."
}`

  try {
    const response = await fetch(OLLAMA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        prompt: prompt,
        stream: false,
        format: 'json',
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    let reportText = data.response || data.text || ''
    
    reportText = reportText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    let report: AIReport
    try {
      report = JSON.parse(reportText)
    } catch (parseError) {
      const jsonMatch = reportText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        report = JSON.parse(jsonMatch[0])
      } else {
        report = {
          executive_summary: reportText.split('\n')[0] || 'Portfolio analysis completed.',
          portfolio_performance: reportText.split('\n')[1] || 'Portfolio performance reviewed.',
          transaction_overview: reportText.split('\n')[2] || 'Transaction activity analyzed.',
          risk_analysis: reportText.split('\n')[3] || 'Risk factors assessed.',
          observations: reportText.split('\n').slice(4).join(' ') || 'Additional observations noted.',
        }
      }
    }

    if (!report.executive_summary || !report.portfolio_performance || !report.transaction_overview || 
        !report.risk_analysis || !report.observations) {
      throw new Error('Invalid report structure from AI')
    }

    return report
  } catch (error: any) {
    console.error('AI Report generation error:', error)
    
    return {
      executive_summary: `Portfolio analysis for ${metrics.totalBalance.toFixed(4)} ETH ($${metrics.totalBalanceUSD.toFixed(2)}). ${metrics.transactionCount} transactions recorded in the period.`,
      portfolio_performance: `Total portfolio value is $${metrics.totalBalanceUSD.toFixed(2)} USD. Portfolio change is ${metrics.portfolioChange24h.toFixed(2)}% over 24 hours.`,
      transaction_overview: `Transaction activity shows ${metrics.transactionBreakdown.incoming} incoming and ${metrics.transactionBreakdown.outgoing} outgoing transactions. ${metrics.transactionBreakdown.confirmed} confirmed, ${metrics.transactionBreakdown.pending} pending, ${metrics.transactionBreakdown.failed} failed.`,
      risk_analysis: `Risk assessment based on ${metrics.transactionCount} transactions. Largest transaction value is ${metrics.largestTransaction.toFixed(4)} ETH. Market conditions show ${metrics.marketData.marketCapChange24h >= 0 ? 'positive' : 'negative'} market cap change of ${metrics.marketData.marketCapChange24h.toFixed(2)}%.`,
      observations: `Top holdings include ${metrics.topCoins.map(c => c.symbol).join(', ')}. Average transaction value is ${metrics.averageTransactionValue.toFixed(4)} ETH. Market dominance: BTC ${metrics.marketData.btcDominance.toFixed(2)}%, ETH ${metrics.marketData.ethDominance.toFixed(2)}%.`,
    }
  }
}

