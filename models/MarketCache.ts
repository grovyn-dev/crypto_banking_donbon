import mongoose, { Schema, Document, Decimal128 } from 'mongoose'

export interface IMarketCache extends Document {
  coinId: string
  symbol: string
  priceUSD: Decimal128
  marketCap: Decimal128
  volume24h: Decimal128
  priceChange24h: Decimal128
  lastUpdated: Date
  createdAt: Date
  updatedAt: Date
}

const MarketCacheSchema = new Schema<IMarketCache>(
  {
    coinId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    priceUSD: {
      type: Schema.Types.Decimal128,
      required: true,
      get: (value: Decimal128) => value?.toString(),
    },
    marketCap: {
      type: Schema.Types.Decimal128,
      required: true,
      get: (value: Decimal128) => value?.toString(),
    },
    volume24h: {
      type: Schema.Types.Decimal128,
      required: true,
      get: (value: Decimal128) => value?.toString(),
    },
    priceChange24h: {
      type: Schema.Types.Decimal128,
      required: true,
      get: (value: Decimal128) => value?.toString(),
    },
    lastUpdated: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

MarketCacheSchema.index({ coinId: 1 }, { unique: true })
MarketCacheSchema.index({ symbol: 1 })
MarketCacheSchema.index({ lastUpdated: -1 })

export const MarketCache = mongoose.models.MarketCache || mongoose.model<IMarketCache>('MarketCache', MarketCacheSchema)

