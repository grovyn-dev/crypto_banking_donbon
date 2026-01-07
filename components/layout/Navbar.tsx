'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useWeb3 } from '@/hooks/useWeb3'
import { Button } from '@/components/ui/Button'
import { formatAddress } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'

export const Navbar: React.FC = () => {
  const pathname = usePathname()
  const { isAuthenticated, user, token, clearAuth } = useAuthStore()
  const { wallet, isConnected, connect, disconnect } = useWeb3()
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const storeState = useAuthStore.getState()
      if (storeState.isAuthenticated || storeState.token || storeState.user) {
        return true
      }
      
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('auth-storage')
          if (stored) {
            const parsed = JSON.parse(stored)
            return !!(
              parsed?.state?.isAuthenticated || 
              parsed?.state?.token || 
              parsed?.state?.user
            )
          }
        } catch (e) {
        }
      }
      
      return false
    }

    setIsUserAuthenticated(checkAuth())

    const unsubscribe = useAuthStore.subscribe((state) => {
      const hasAuth = !!(state.isAuthenticated || state.token || state.user)
      setIsUserAuthenticated(hasAuth)
    })

    const timer = setTimeout(() => {
      setIsUserAuthenticated(checkAuth())
    }, 200)

    return () => {
      unsubscribe()
      clearTimeout(timer)
    }
  }, [])

  const handleDisconnect = async () => {
    await disconnect()
    clearAuth()
  }

  const handleLogout = async () => {
    try {
      clearAuth()
      
      if (isConnected) {
        await disconnect()
      }
      
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      window.location.href = ROUTES.home
    } catch (error) {
      console.error('Logout error:', error)
      clearAuth()
      if (isConnected) {
        await disconnect()
      }
      window.location.href = ROUTES.home
    }
  }

  const navLinks = [
    { href: ROUTES.dashboard, label: 'Dashboard' },
    { href: ROUTES.markets, label: 'Markets' },
  ]

  return (
    <nav className="glass border-b border-primary-500/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href={ROUTES.home} className="text-2xl font-bold gradient-text">
              CryptoBank
            </Link>
            <div className="hidden md:flex items-center gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${pathname === link.href
                      ? 'text-primary-500 bg-primary-500/10'
                      : 'text-gray-300 hover:text-primary-500 hover:bg-primary-500/5'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isConnected ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-dark-800 rounded-lg border border-primary-500/30">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-300">
                    {formatAddress(wallet?.address || '')}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button variant="primary" size="sm" onClick={connect}>
                Connect Wallet
              </Button>
            )}

            {isUserAuthenticated ? (
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Sign Out
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Link href={ROUTES.login}>
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href={ROUTES.register}>
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

