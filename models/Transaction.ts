import mongoose, { Schema, Document, Decimal128 } from 'mongoose'

export interface ITransaction extends Document {
  wallet: mongoose.Types.ObjectId
  hash: string
  fromAddress: string
  toAddress: string
  amount: Decimal128
  tokenSymbol: string
  gasFee: Decimal128
  blockNumber: number
  status: 'PENDING' | 'CONFIRMED' | 'FAILED'
  blockchainTimestamp: Date
  createdAt: Date
  updatedAt: Date
}

const TransactionSchema = new Schema<ITransaction>(
  {
    wallet: {
      type: Schema.Types.ObjectId,
      ref: 'Wallet',
      required: true,
      index: true,
    },
    hash: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    fromAddress: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    toAddress: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    amount: {
      type: Schema.Types.Decimal128,
      required: true,
      get: (value: Decimal128) => value?.toString(),
    },
    tokenSymbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      default: 'ETH',
    },
    gasFee: {
      type: Schema.Types.Decimal128,
      required: true,
      get: (value: Decimal128) => value?.toString(),
    },
    blockNumber: {
      type: Number,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'FAILED'],
      required: true,
      default: 'PENDING',
      index: true,
    },
    blockchainTimestamp: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

TransactionSchema.index({ hash: 1 }, { unique: true })
TransactionSchema.index({ wallet: 1 })
TransactionSchema.index({ wallet: 1, status: 1 })
TransactionSchema.index({ fromAddress: 1 })
TransactionSchema.index({ toAddress: 1 })
TransactionSchema.index({ blockNumber: 1 })
TransactionSchema.index({ blockchainTimestamp: -1 })
TransactionSchema.index({ createdAt: -1 })

export const Transaction = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema)

