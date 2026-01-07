import mongoose, { Schema, Document } from 'mongoose'

export interface ITransactionMetadata extends Document {
  transaction: mongoose.Types.ObjectId
  confirmations: number
  gasUsed: string
  nonce: number
  inputData?: string
  rawMolarisResponse: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

const TransactionMetadataSchema = new Schema<ITransactionMetadata>(
  {
    transaction: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
      required: true,
      unique: true,
      index: true,
    },
    confirmations: {
      type: Number,
      required: true,
      default: 0,
    },
    gasUsed: {
      type: String,
      required: true,
    },
    nonce: {
      type: Number,
      required: true,
    },
    inputData: {
      type: String,
      required: false,
      default: null,
    },
    rawMolarisResponse: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

TransactionMetadataSchema.index({ transaction: 1 }, { unique: true })
TransactionMetadataSchema.index({ confirmations: 1 })

export const TransactionMetadata = mongoose.models.TransactionMetadata || mongoose.model<ITransactionMetadata>(
  'TransactionMetadata',
  TransactionMetadataSchema
)

