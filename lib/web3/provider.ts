import { ethers } from 'ethers'
import { DEFAULT_CHAIN_ID, SUPPORTED_CHAINS } from '@/lib/constants'

export interface WalletInfo {
  address: string
  balance: string
  network: {
    chainId: number
    name: string
  }
}

export class Web3Provider {
  private provider: ethers.BrowserProvider | null = null
  private signer: ethers.JsonRpcSigner | null = null

  async connect(): Promise<WalletInfo> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.')
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock your MetaMask wallet.')
      }

      this.provider = new ethers.BrowserProvider(window.ethereum)
      this.signer = await this.provider.getSigner()
      const address = await this.signer.getAddress()

      const network = await this.provider.getNetwork()
      const chainId = Number(network.chainId)

      const isSupported = Object.values(SUPPORTED_CHAINS).some(
        chain => chain.chainId === chainId
      )

      if (!isSupported) {
        throw new Error(
          `Unsupported network. Please switch to Ethereum Mainnet (Chain ID: ${DEFAULT_CHAIN_ID})`
        )
      }

      const balance = await this.provider.getBalance(address)
      const balanceInEth = ethers.formatEther(balance)

      return {
        address,
        balance: balanceInEth,
        network: {
          chainId,
          name: SUPPORTED_CHAINS.ethereum.name,
        },
      }
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error('User rejected the connection request.')
      }
      throw error
    }
  }

  async disconnect(): Promise<void> {
    this.provider = null
    this.signer = null
  }

  async getWalletInfo(): Promise<WalletInfo | null> {
    if (!this.provider || !this.signer) {
      return null
    }

    try {
      const address = await this.signer.getAddress()
      const balance = await this.provider.getBalance(address)
      const network = await this.provider.getNetwork()

      return {
        address,
        balance: ethers.formatEther(balance),
        network: {
          chainId: Number(network.chainId),
          name: network.name || 'Unknown',
        },
      }
    } catch (error) {
      console.error('Error getting wallet info:', error)
      return null
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected')
    }

    try {
      const signature = await this.signer.signMessage(message)
      return signature
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error('User rejected the signature request.')
      }
      throw error
    }
  }

  async sendTransaction(to: string, value: string): Promise<ethers.TransactionResponse> {
    if (!this.signer) {
      throw new Error('Wallet not connected')
    }

    try {
      const tx = await this.signer.sendTransaction({
        to,
        value: ethers.parseEther(value),
      })
      return tx
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error('User rejected the transaction.')
      }
      throw error
    }
  }

  async switchNetwork(chainId: number): Promise<void> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed')
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })
    } catch (error: any) {
      if (error.code === 4902) {
        const chain = Object.values(SUPPORTED_CHAINS).find(c => c.chainId === chainId)
        if (chain) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
                chainName: chain.name,
                rpcUrls: [chain.rpcUrl],
                nativeCurrency: {
                  name: 'Ether',
                  symbol: 'ETH',
                  decimals: 18,
                },
                blockExplorerUrls: [chain.explorer],
              },
            ],
          })
        }
      } else {
        throw error
      }
    }
  }

  getProvider(): ethers.BrowserProvider | null {
    return this.provider
  }

  getSigner(): ethers.JsonRpcSigner | null {
    return this.signer
  }

  isConnected(): boolean {
    return this.provider !== null && this.signer !== null
  }
}

export const web3Provider = new Web3Provider()

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      isMetaMask?: boolean
      on?: (event: string, handler: (...args: any[]) => void) => void
      removeListener?: (event: string, handler: (...args: any[]) => void) => void
    }
  }
}

