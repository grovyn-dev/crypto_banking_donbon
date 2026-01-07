'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { useWeb3 } from '@/hooks/useWeb3'
import { isValidEmail } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAuth } = useAuthStore()
  const { connect, signMessage, wallet, isConnected } = useWeb3()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    walletAddress: '',
  })
  const [authMethod, setAuthMethod] = useState<'email' | 'wallet'>('email')
  const [walletConnectionMethod, setWalletConnectionMethod] = useState<'metamask' | 'manual'>('metamask')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!isValidEmail(formData.email)) {
        throw new Error('Please enter a valid email address')
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      setAuth(data.user, data.token)

      const redirect = searchParams.get('redirect') || ROUTES.dashboard
      
      setTimeout(() => {
        window.location.href = redirect
      }, 500)
    } catch (err: any) {
      setError(err.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  const isValidAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }

  const handleWalletLogin = async () => {
    setError(null)
    setLoading(true)

    try {
      let walletAddress: string
      let signature: string | null = null
      let message: string | null = null

      if (walletConnectionMethod === 'metamask') {
        const walletInfo = await connect()

        message = `Sign in to CryptoBank\n\nWallet: ${walletInfo.address}\nTimestamp: ${Date.now()}`
        signature = await signMessage(message)
        walletAddress = walletInfo.address
      } else {
        const address = formData.walletAddress.trim()
        
        if (!address) {
          throw new Error('Please enter a wallet address')
        }

        if (!isValidAddress(address)) {
          throw new Error('Invalid wallet address format. Please enter a valid Ethereum address (0x...)')
        }

        walletAddress = address
      }

      const response = await fetch('/api/auth/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: walletAddress,
          signature,
          message,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Wallet authentication failed')
      }

      setAuth(data.user, data.token)

      const redirect = searchParams.get('redirect') || ROUTES.dashboard
      
      setTimeout(() => {
        window.location.href = redirect
      }, 500)
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate with wallet')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">CryptoBank</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        <Card variant="glass" glow>
          <div className="flex gap-2 mb-6 p-1 bg-dark-900 rounded-lg">
            <button
              onClick={() => setAuthMethod('email')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                authMethod === 'email'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setAuthMethod('wallet')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                authMethod === 'wallet'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Wallet
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {authMethod === 'email' ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                label="Password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={loading}
              >
                Sign In
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2 p-1 bg-dark-900 rounded-lg mb-4">
                <button
                  type="button"
                  onClick={() => setWalletConnectionMethod('metamask')}
                  className={`flex-1 py-2 px-4 rounded-md text-xs font-medium transition-colors ${
                    walletConnectionMethod === 'metamask'
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  MetaMask
                </button>
                <button
                  type="button"
                  onClick={() => setWalletConnectionMethod('manual')}
                  className={`flex-1 py-2 px-4 rounded-md text-xs font-medium transition-colors ${
                    walletConnectionMethod === 'manual'
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Enter Address
                </button>
              </div>

              {walletConnectionMethod === 'metamask' ? (
                <>
                  {!isConnected ? (
                    <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                      <p className="text-yellow-400 text-sm">Wallet not connected</p>
                    </div>
                  ) : wallet ? (
                    <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                      <p className="text-green-400 text-sm text-center">
                        Connected: {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                      </p>
                    </div>
                  ) : null}
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleWalletLogin}
                    isLoading={loading}
                  >
                    {isConnected ? 'Sign In with Wallet' : 'Connect & Sign In'}
                  </Button>
                </>
              ) : (
                <>
                  <Input
                    label="Wallet Address"
                    type="text"
                    placeholder="0x..."
                    value={formData.walletAddress}
                    onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                    required
                  />
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleWalletLogin}
                    isLoading={loading}
                  >
                    Sign In with Address
                  </Button>
                </>
              )}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link href={ROUTES.register} className="text-primary-500 hover:text-primary-400">
                Sign up
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}

