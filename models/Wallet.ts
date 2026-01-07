import mongoose, { Schema, Document } from 'mongoose'

export interface IWallet extends Document {
  user: mongoose.Types.ObjectId
  address: string
  walletType: 'MetaMask' | 'WalletConnect' | 'Coinbase' | 'Other'
  blockchainNetwork: string
  chainId: number
  isPrimary: boolean
  createdAt: Date
  updatedAt: Date
}

const WalletSchema = new Schema<IWallet>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    address: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      validate: {
        validator: function(v: string) {
          return /^0x[a-fA-F0-9]{40}$/.test(v)
        },
        message: 'Invalid Ethereum address format',
      },
    },
    walletType: {
      type: String,
      enum: ['MetaMask', 'WalletConnect', 'Coinbase', 'Other'],
      required: true,
      default: 'MetaMask',
    },
    blockchainNetwork: {
      type: String,
      required: true,
      trim: true,
    },
    chainId: {
      type: Number,
      required: true,
    },
    isPrimary: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

WalletSchema.index({ address: 1 }, { unique: true })
WalletSchema.index({ user: 1 })
WalletSchema.index({ user: 1, isPrimary: 1 })
WalletSchema.index({ blockchainNetwork: 1, chainId: 1 })

export const Wallet = mongoose.models.Wallet || mongoose.model<IWallet>('Wallet', WalletSchema)

