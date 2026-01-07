'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/lib/constants'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, token, user } = useAuthStore()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsAuthorized(true)
      setHasChecked(true)
      return
    }

    const checkAuth = () => {
      let hasStoredAuth = false
      
      try {
        const stored = localStorage.getItem('auth-storage')
        if (stored) {
          const parsed = JSON.parse(stored)
          hasStoredAuth = !!(
            parsed?.state?.isAuthenticated || 
            parsed?.state?.token || 
            parsed?.state?.user
          )
        }
      } catch (e) {
      }
      
      const currentState = useAuthStore.getState()
      
      const hasAuth = 
        currentState.isAuthenticated || 
        currentState.token ||
        currentState.user ||
        hasStoredAuth
      
      if (hasAuth) {
        setIsAuthorized(true)
        setHasChecked(true)
      } else {
        setTimeout(() => {
          const finalState = useAuthStore.getState()
          
          let finalHasStoredAuth = false
          try {
            const stored = localStorage.getItem('auth-storage')
            if (stored) {
              const parsed = JSON.parse(stored)
              finalHasStoredAuth = !!(
                parsed?.state?.isAuthenticated || 
                parsed?.state?.token || 
                parsed?.state?.user
              )
            }
          } catch (e) {
          }
          
          const finalHasAuth = 
            finalState.isAuthenticated || 
            finalState.token ||
            finalState.user ||
            finalHasStoredAuth
          
          if (finalHasAuth) {
            setIsAuthorized(true)
            setHasChecked(true)
          } else {
            if (pathname !== ROUTES.login && pathname !== ROUTES.register && pathname !== '/') {
              router.push(`${ROUTES.login}?redirect=${encodeURIComponent(pathname)}`)
            } else {
              setHasChecked(true)
            }
          }
        }, 100)
      }
    }
    
    checkAuth()
  }, [isAuthenticated, token, user, router, pathname])

  if (typeof window !== 'undefined' && !hasChecked) {
    try {
      const stored = localStorage.getItem('auth-storage')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed?.state?.isAuthenticated || parsed?.state?.token || parsed?.state?.user) {
          return <>{children}</>
        }
      }
    } catch (e) {
    }
  }

  if (isAuthorized) {
    return <>{children}</>
  }

  if (!hasChecked) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 border-4 mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return null
}
