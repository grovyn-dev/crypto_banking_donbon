import { create } from 'zustand'
import { WalletInfo } from '@/lib/web3/provider'

interface WalletState {
  wallet: WalletInfo | null
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  setWallet: (wallet: WalletInfo | null) => void
  setConnecting: (connecting: boolean) => void
  setError: (error: string | null) => void
  clearWallet: () => void
}

export const useWalletStore = create<WalletState>((set) => ({
  wallet: null,
  isConnected: false,
  isConnecting: false,
  error: null,
  setWallet: (wallet: WalletInfo | null) => set({ wallet, isConnected: !!wallet, error: null }),
  setConnecting: (connecting: boolean) => set({ isConnecting: connecting }),
  setError: (error: string | null) => set({ error }),
  clearWallet: () => set({ wallet: null, isConnected: false, error: null }),
}))

