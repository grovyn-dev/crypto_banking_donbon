import mongoose, { Schema, Document } from 'mongoose'

export interface ISecurityLog extends Document {
  user?: mongoose.Types.ObjectId
  eventType: 'LOGIN' | 'LOGOUT' | 'WALLET_CONNECT' | 'WALLET_DISCONNECT' | 'TX_SIGN' | 'PASSWORD_CHANGE' | '2FA_ENABLED' | '2FA_DISABLED' | 'ACCOUNT_SUSPENDED'
  eventDescription: string
  ipAddress: string
  userAgent: string
  createdAt: Date
  updatedAt: Date
}

const SecurityLogSchema = new Schema<ISecurityLog>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null,
      index: true,
    },
    eventType: {
      type: String,
      enum: [
        'LOGIN',
        'LOGOUT',
        'WALLET_CONNECT',
        'WALLET_DISCONNECT',
        'TX_SIGN',
        'PASSWORD_CHANGE',
        '2FA_ENABLED',
        '2FA_DISABLED',
        'ACCOUNT_SUSPENDED',
      ],
      required: true,
      index: true,
    },
    eventDescription: {
      type: String,
      required: true,
      trim: true,
    },
    ipAddress: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    userAgent: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

SecurityLogSchema.index({ user: 1 })
SecurityLogSchema.index({ eventType: 1 })
SecurityLogSchema.index({ user: 1, eventType: 1 })
SecurityLogSchema.index({ createdAt: -1 })
SecurityLogSchema.index({ ipAddress: 1 })

export const SecurityLog = mongoose.models.SecurityLog || mongoose.model<ISecurityLog>('SecurityLog', SecurityLogSchema)

