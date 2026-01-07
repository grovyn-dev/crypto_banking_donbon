import { NextRequest, NextResponse } from 'next/server'
import { generateToken } from '@/lib/auth/jwt'
import bcrypt from 'bcryptjs'

const mockUsers: Array<{
  id: string
  email: string
  password: string
  name: string
}> = []

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    const existingUser = mockUsers.find(u => u.email === email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      name,
    }
    mockUsers.push(newUser)

    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      authType: 'email',
    })

    const response = NextResponse.json({
      user: {
        userId: newUser.id,
        email: newUser.email,
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
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

