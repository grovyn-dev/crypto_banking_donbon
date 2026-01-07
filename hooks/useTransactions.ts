import { useState, useEffect, useCallback } from 'react'
import { molarisService, Transaction, TransactionFilters, TransactionResponse } from '@/lib/api/molaris'

export function useTransactions(address: string | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const fetchTransactions = useCallback(async (
    filters?: Partial<TransactionFilters>,
    pageNum: number = 1
  ) => {
    if (!address) {
      setTransactions([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response: TransactionResponse = await molarisService.getTransactions({
        address,
        page: pageNum,
        limit: 50,
        ...filters,
      })

      if (pageNum === 1) {
        setTransactions(response.transactions)
      } else {
        setTransactions(prev => [...prev, ...response.transactions])
      }

      setTotal(response.total)
      setPage(response.page)
      setHasMore(response.hasMore)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transactions')
    } finally {
      setLoading(false)
    }
  }, [address])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchTransactions({}, page + 1)
    }
  }, [loading, hasMore, page, fetchTransactions])

  const refetch = useCallback(() => {
    fetchTransactions({}, 1)
  }, [fetchTransactions])

  useEffect(() => {
    if (address) {
      fetchTransactions()
    }
  }, [address, fetchTransactions])

  return {
    transactions,
    loading,
    error,
    total,
    hasMore,
    loadMore,
    refetch,
    fetchTransactions,
  }
}

