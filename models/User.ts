import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  passwordHash?: string
  emailVerified: boolean
  twoFactorEnabled: boolean
  role: 'USER' | 'ADMIN'
  status: 'ACTIVE' | 'SUSPENDED'
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: false,
      default: null,
    },
    emailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    twoFactorEnabled: {
      type: Boolean,
      required: true,
      default: false,
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      required: true,
      default: 'USER',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED'],
      required: true,
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
  }
)

UserSchema.index({ email: 1 }, { unique: true })
UserSchema.index({ status: 1 })
UserSchema.index({ role: 1 })

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

