import { useState, useEffect, useCallback } from 'react'
import { web3Provider, WalletInfo } from '@/lib/web3/provider'
import { useWalletStore } from '@/store/walletStore'
import { DEFAULT_CHAIN_ID } from '@/lib/constants'

export function useWeb3() {
  const { wallet, isConnected, isConnecting, error, setWallet, setConnecting, setError, clearWallet } = useWalletStore()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window === 'undefined' || !window.ethereum) {
        setIsInitialized(true)
        return
      }

      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts && accounts.length > 0) {
          const walletInfo = await web3Provider.getWalletInfo()
          if (walletInfo) {
            setWallet(walletInfo)
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
      } finally {
        setIsInitialized(true)
      }
    }

    checkConnection()

    if (window.ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          clearWallet()
        } else {
          const walletInfo = await web3Provider.getWalletInfo()
          if (walletInfo) {
            setWallet(walletInfo)
          }
        }
      }

      const handleChainChanged = async () => {
        const walletInfo = await web3Provider.getWalletInfo()
        if (walletInfo) {
          setWallet(walletInfo)
        }
      }

      window.ethereum.on?.('accountsChanged', handleAccountsChanged)
      window.ethereum.on?.('chainChanged', handleChainChanged)

      return () => {
        window.ethereum?.removeListener?.('accountsChanged', handleAccountsChanged)
        window.ethereum?.removeListener?.('chainChanged', handleChainChanged)
      }
    }
  }, [setWallet, clearWallet])

  const connect = useCallback(async () => {
    setConnecting(true)
    setError(null)

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.')
      }

      const walletInfo = await web3Provider.connect()
      setWallet(walletInfo)

      if (walletInfo.network.chainId !== DEFAULT_CHAIN_ID) {
        await web3Provider.switchNetwork(DEFAULT_CHAIN_ID)
        const updatedInfo = await web3Provider.getWalletInfo()
        if (updatedInfo) {
          setWallet(updatedInfo)
        }
      }

      return walletInfo
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to connect wallet'
      setError(errorMessage)
      throw err
    } finally {
      setConnecting(false)
    }
  }, [setWallet, setConnecting, setError])

  const disconnect = useCallback(async () => {
    try {
      await web3Provider.disconnect()
      clearWallet()
    } catch (err) {
      console.error('Error disconnecting wallet:', err)
    }
  }, [clearWallet])

  const refreshBalance = useCallback(async () => {
    if (!isConnected) return

    try {
      const walletInfo = await web3Provider.getWalletInfo()
      if (walletInfo) {
        setWallet(walletInfo)
      }
    } catch (err) {
      console.error('Error refreshing balance:', err)
    }
  }, [isConnected, setWallet])

  const signMessage = useCallback(async (message: string) => {
    if (!isConnected) {
      throw new Error('Wallet not connected')
    }

    try {
      return await web3Provider.signMessage(message)
    } catch (err: any) {
      if (err.message) {
        setError(err.message)
      }
      throw err
    }
  }, [isConnected, setError])

  const sendTransaction = useCallback(async (to: string, value: string) => {
    if (!isConnected) {
      throw new Error('Wallet not connected')
    }

    try {
      return await web3Provider.sendTransaction(to, value)
    } catch (err: any) {
      if (err.message) {
        setError(err.message)
      }
      throw err
    }
  }, [isConnected, setError])

  return {
    wallet,
    isConnected,
    isConnecting,
    error,
    isInitialized,
    connect,
    disconnect,
    refreshBalance,
    signMessage,
    sendTransaction,
  }
}

