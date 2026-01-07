import { NextRequest, NextResponse } from 'next/server'
import { generateToken } from '@/lib/auth/jwt'
import { ethers } from 'ethers'
import { isValidAddress } from '@/lib/utils'

const mockWalletUsers: Array<{
  id: string
  walletAddress: string
  createdAt: number
}> = []

export async function POST(request: NextRequest) {
  try {
    const { address, signature, message } = await request.json()

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    if (!isValidAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      )
    }

    if (signature && message) {
      try {
        const recoveredAddress = ethers.verifyMessage(message, signature)
        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
          return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 401 }
          )
        }
      } catch (error) {
        return NextResponse.json(
          { error: 'Signature verification failed' },
          { status: 401 }
        )
      }
    }

    let user = mockWalletUsers.find(u => 
      u.walletAddress.toLowerCase() === address.toLowerCase()
    )

    if (!user) {
      user = {
        id: Date.now().toString(),
        walletAddress: address,
        createdAt: Date.now(),
      }
      mockWalletUsers.push(user)
    }

    const token = generateToken({
      userId: user.id,
      walletAddress: user.walletAddress,
      authType: 'wallet',
    })

    const response = NextResponse.json({
      user: {
        userId: user.id,
        walletAddress: user.walletAddress,
        authType: 'wallet' as const,
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
    console.error('Wallet auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

