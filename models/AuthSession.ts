import mongoose, { Schema, Document } from 'mongoose'

export interface IAuthSession extends Document {
  user: mongoose.Types.ObjectId
  refreshToken: string
  ipAddress: string
  userAgent: string
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

const AuthSessionSchema = new Schema<IAuthSession>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    refreshToken: {
      type: String,
      required: true,
      index: true,
    },
    ipAddress: {
      type: String,
      required: true,
      trim: true,
    },
    userAgent: {
      type: String,
      required: true,
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

AuthSessionSchema.index({ user: 1 })
AuthSessionSchema.index({ refreshToken: 1 })
AuthSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const AuthSession = mongoose.models.AuthSession || mongoose.model<IAuthSession>('AuthSession', AuthSessionSchema)

