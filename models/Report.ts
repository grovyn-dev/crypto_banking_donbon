import mongoose, { Schema, Document } from 'mongoose'

export interface IReport extends Document {
  user: mongoose.Types.ObjectId
  dateRange: {
    start: Date
    end: Date
  }
  inputMetrics: {
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
  aiReport: {
    executive_summary: string
    portfolio_performance: string
    transaction_overview: string
    risk_analysis: string
    observations: string
  }
  createdAt: Date
  updatedAt: Date
}

const ReportSchema = new Schema<IReport>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    dateRange: {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
    },
    inputMetrics: {
      totalBalance: {
        type: Number,
        required: true,
      },
      totalBalanceUSD: {
        type: Number,
        required: true,
      },
      transactionCount: {
        type: Number,
        required: true,
      },
      totalVolume: {
        type: Number,
        required: true,
      },
      averageTransactionValue: {
        type: Number,
        required: true,
      },
      largestTransaction: {
        type: Number,
        required: true,
      },
      portfolioChange24h: {
        type: Number,
        required: true,
      },
      topCoins: [
        {
          symbol: String,
          amount: Number,
          valueUSD: Number,
        },
      ],
      transactionBreakdown: {
        incoming: Number,
        outgoing: Number,
        pending: Number,
        confirmed: Number,
        failed: Number,
      },
      marketData: {
        totalMarketCap: Number,
        btcDominance: Number,
        ethDominance: Number,
        marketCapChange24h: Number,
      },
    },
    aiReport: {
      executive_summary: {
        type: String,
        required: true,
      },
      portfolio_performance: {
        type: String,
        required: true,
      },
      transaction_overview: {
        type: String,
        required: true,
      },
      risk_analysis: {
        type: String,
        required: true,
      },
      observations: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
)

ReportSchema.index({ user: 1 })
ReportSchema.index({ user: 1, createdAt: -1 })
ReportSchema.index({ 'dateRange.start': 1, 'dateRange.end': 1 })

export const Report = mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema)

