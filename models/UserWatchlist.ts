import mongoose, { Schema, Document } from 'mongoose'

export interface IUserWatchlist extends Document {
  user: mongoose.Types.ObjectId
  coinId: string
  createdAt: Date
  updatedAt: Date
}

const UserWatchlistSchema = new Schema<IUserWatchlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    coinId: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

UserWatchlistSchema.index({ user: 1, coinId: 1 }, { unique: true })
UserWatchlistSchema.index({ user: 1 })
UserWatchlistSchema.index({ coinId: 1 })

export const UserWatchlist = mongoose.models.UserWatchlist || mongoose.model<IUserWatchlist>('UserWatchlist', UserWatchlistSchema)

