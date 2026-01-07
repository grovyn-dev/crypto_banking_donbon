import jwt, { SignOptions } from 'jsonwebtoken'

const JWT_SECRET: string = process.env.JWT_SECRET || 'fallback-secret-change-in-production'
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d'

if (!JWT_SECRET || JWT_SECRET === 'fallback-secret-change-in-production') {
  console.warn('⚠️  WARNING: Using fallback JWT_SECRET. Set JWT_SECRET in .env for production!')
}

export interface JWTPayload {
  userId: string
  email?: string
  walletAddress?: string
  authType: 'email' | 'wallet'
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as SignOptions)
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload
  } catch (error) {
    return null
  }
}

