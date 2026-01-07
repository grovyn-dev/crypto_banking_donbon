import mongoose, { Schema, Document } from 'mongoose'

export interface IUserProfile extends Document {
  user: mongoose.Types.ObjectId
  fullName: string
  avatar?: string
  country?: string
  preferredCurrency: string
  createdAt: Date
  updatedAt: Date
}

const UserProfileSchema = new Schema<IUserProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      required: false,
      default: null,
    },
    country: {
      type: String,
      required: false,
      default: null,
      trim: true,
    },
    preferredCurrency: {
      type: String,
      required: true,
      default: 'USD',
      uppercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

UserProfileSchema.index({ user: 1 }, { unique: true })
UserProfileSchema.index({ country: 1 })

export const UserProfile = mongoose.models.UserProfile || mongoose.model<IUserProfile>('UserProfile', UserProfileSchema)

