import axios from 'axios'
import { API_ENDPOINTS } from '@/lib/constants'

const API_KEY = process.env.MOLARIS_API_KEY || process.env.MORALIS_API_KEY || ''
const BASE_URL = API_ENDPOINTS.molaris.base

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

export interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  gasUsed: string
  gasPrice: string
  blockNumber: number
  blockHash: string
  timestamp: number
  status: 'pending' | 'confirmed' | 'failed'
  type: 'incoming' | 'outgoing'
  tokenTransfers?: TokenTransfer[]
}

export interface TokenTransfer {
  tokenAddress: string
  tokenSymbol: string
  tokenName: string
  tokenDecimals: number
  from: string
  to: string
  value: string
  valueUSD?: number
}

export interface TransactionResponse {
  transactions: Transaction[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface TransactionFilters {
  address: string
  from?: string
  to?: string
  startBlock?: number
  endBlock?: number
  startDate?: string
  endDate?: string
  type?: 'incoming' | 'outgoing' | 'all'
  status?: 'pending' | 'confirmed' | 'failed' | 'all'
  limit?: number
  page?: number
}

export class MolarisService {
  async getTransactions(filters: TransactionFilters): Promise<TransactionResponse> {
    try {
      const params: any = {
        address: filters.address,
        limit: filters.limit || 50,
        page: filters.page || 1,
      }

      if (filters.from) params.from = filters.from
      if (filters.to) params.to = filters.to
      if (filters.startBlock) params.startBlock = filters.startBlock
      if (filters.endBlock) params.endBlock = filters.endBlock
      if (filters.startDate) params.startDate = filters.startDate
      if (filters.endDate) params.endDate = filters.endDate
      if (filters.type && filters.type !== 'all') params.type = filters.type
      if (filters.status && filters.status !== 'all') params.status = filters.status

      const response = await api.get(API_ENDPOINTS.molaris.transactions, { params })
      return response.data
    } catch (error: any) {
      console.error('Error fetching transactions:', error)
      
      if (error.response?.status === 401 || !API_KEY) {
        console.warn('Molaris API key not configured, returning empty transactions')
        return {
          transactions: [],
          total: 0,
          page: filters.page || 1,
          limit: filters.limit || 50,
          hasMore: false,
        }
      }
      
      throw new Error('Failed to fetch transactions')
    }
  }

  async getTransactionByHash(txHash: string): Promise<Transaction | null> {
    try {
      const response = await api.get(`${API_ENDPOINTS.molaris.transactions}/${txHash}`)
      return response.data
    } catch (error) {
      console.error('Error fetching transaction:', error)
      return null
    }
  }

  async getTransactionCount(address: string): Promise<number> {
    try {
      const response = await api.get(`${API_ENDPOINTS.molaris.transactions}/count`, {
        params: { address },
      })
      return response.data.count || 0
    } catch (error) {
      console.error('Error fetching transaction count:', error)
      return 0
    }
  }
}

export const molarisService = new MolarisService()

