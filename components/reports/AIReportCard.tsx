'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { format } from 'date-fns'

interface AIReport {
  executive_summary: string
  portfolio_performance: string
  transaction_overview: string
  risk_analysis: string
  observations: string
}

interface ReportData {
  id: string
  dateRange: {
    start: string
    end: string
  }
  inputMetrics: any
  aiReport: AIReport
  createdAt: string
}

export function AIReportCard() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<ReportData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generateReport = async () => {
    if (!user?.userId) {
      setError('Please log in to generate a report')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)

      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRange: {
            start: startDate.toISOString(),
            end: endDate.toISOString(),
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate report')
      }

      setReport(data.report)
    } catch (err: any) {
      setError(err.message || 'Failed to generate report')
    } finally {
      setLoading(false)
    }
  }

  if (report) {
    return (
      <Card variant="glass" className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">AI Financial Report</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setReport(null)}
          >
            Generate New Report
          </Button>
        </div>

        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-400 text-sm">
            ⚠️ AI-generated report for informational purposes only. Not financial advice.
          </p>
        </div>

        <div className="mb-4 text-sm text-gray-400">
          <p>Period: {format(new Date(report.dateRange.start), 'MMM d, yyyy')} - {format(new Date(report.dateRange.end), 'MMM d, yyyy')}</p>
          <p>Generated: {format(new Date(report.createdAt), 'MMM d, yyyy HH:mm')}</p>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-white mb-2">Executive Summary</h3>
            <p className="text-gray-300 leading-relaxed">{report.aiReport.executive_summary}</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-2">Portfolio Performance</h3>
            <p className="text-gray-300 leading-relaxed">{report.aiReport.portfolio_performance}</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-2">Transaction Overview</h3>
            <p className="text-gray-300 leading-relaxed">{report.aiReport.transaction_overview}</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-2">Risk Analysis</h3>
            <p className="text-gray-300 leading-relaxed">{report.aiReport.risk_analysis}</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-2">Observations</h3>
            <p className="text-gray-300 leading-relaxed">{report.aiReport.observations}</p>
          </section>
        </div>
      </Card>
    )
  }

  return (
    <Card variant="glass" className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">AI Financial Report</h2>
          <p className="text-sm text-gray-400">
            Generate an AI-powered analysis of your portfolio performance
          </p>
        </div>
        <Button
          variant="primary"
          onClick={generateReport}
          isLoading={loading}
          disabled={loading || !user?.userId}
        >
          {loading ? 'Generating...' : 'Generate AI Report'}
        </Button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {!user?.userId && (
        <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
          <p className="text-yellow-400 text-sm">Please log in to generate a report</p>
        </div>
      )}
    </Card>
  )
}

