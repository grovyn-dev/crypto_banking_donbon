import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/connection'
import { Report, User } from '@/models'
import { aggregateFinancialData } from '@/lib/services/financialDataService'
import { generateAIReport } from '@/lib/services/aiReportService'
import { verifyToken } from '@/lib/auth/jwt'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const token = request.cookies.get('auth_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { dateRange } = await request.json()

    if (!dateRange || !dateRange.start || !dateRange.end) {
      return NextResponse.json(
        { error: 'Date range (start and end) is required' },
        { status: 400 }
      )
    }

    const startDate = new Date(dateRange.start)
    const endDate = new Date(dateRange.end)

    let user = await User.findOne({ email: payload.email })
    
    if (!user && payload.email) {
      user = await User.create({
        email: payload.email,
        emailVerified: false,
        twoFactorEnabled: false,
        role: 'USER',
        status: 'ACTIVE',
      })
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const metrics = await aggregateFinancialData(user._id.toString(), {
      start: startDate,
      end: endDate,
    })

    const aiReport = await generateAIReport(metrics)

    const report = await Report.create({
      user: user._id,
      dateRange: {
        start: startDate,
        end: endDate,
      },
      inputMetrics: metrics,
      aiReport: aiReport,
    })

    return NextResponse.json({
      success: true,
      report: {
        id: report._id,
        dateRange: report.dateRange,
        inputMetrics: report.inputMetrics,
        aiReport: report.aiReport,
        createdAt: report.createdAt,
      },
    })
  } catch (error: any) {
    console.error('Report generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate report' },
      { status: 500 }
    )
  }
}

