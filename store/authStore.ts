import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { JWTPayload } from '@/lib/auth/jwt'
import { setSecureStorage, getSecureStorage, removeSecureStorage } from '@/lib/auth/encryption'

interface AuthState {
  user: JWTPayload | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setAuth: (user: JWTPayload, token: string) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      setAuth: (user, token) => {
        setSecureStorage('auth_token', token)
        set({ user, token, isAuthenticated: true })
      },
      clearAuth: () => {
        removeSecureStorage('auth_token')
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage')
        }
        set({ user: null, token: null, isAuthenticated: false })
      },
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

