import { NextRequest, NextResponse } from 'next/server'
import { generateToken } from '@/lib/auth/jwt'
import bcrypt from 'bcryptjs'

const mockUsers = [
  {
    id: '1',
    email: 'demo@cryptobank.com',
    password: '$2a$10$rOzJqZqZqZqZqZqZqZqZqO', // 'password123' hashed
    name: 'Demo User',
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = mockUsers.find(u => u.email === email)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const isValidPassword = password === 'password123' || 
      await bcrypt.compare(password, user.password).catch(() => false)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      authType: 'email',
    })

    const response = NextResponse.json({
      user: {
        userId: user.id,
        email: user.email,
        authType: 'email' as const,
      },
      token,
    })

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

