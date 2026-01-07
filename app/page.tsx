'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useWeb3 } from '@/hooks/useWeb3'
import { useMarkets } from '@/hooks/useMarkets'
import { ROUTES } from '@/lib/constants'
import { formatCurrency, formatNumber } from '@/lib/utils'

export default function LandingPage() {
  const { connect, isConnecting } = useWeb3()
  const { globalData, coins } = useMarkets()

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'Bank-Grade Security',
      description: 'Military-grade encryption, multi-signature wallets, and secure key management to protect your digital assets.',
      image: '/images/security.svg',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Real-Time Market Data',
      description: 'Live cryptocurrency prices, market trends, and comprehensive analytics powered by CoinGecko API.',
      image: '/images/markets.svg',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Wallet Management',
      description: 'Connect MetaMask, view balances, track transactions, and manage multiple wallets from one secure dashboard.',
      image: '/images/wallet.svg',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Transaction History',
      description: 'Complete transaction tracking with Molaris integration. View all incoming, outgoing, and pending transactions.',
      image: '/images/transactions.svg',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Instant Transfers',
      description: 'Send and receive crypto instantly with low fees. Support for Ethereum and ERC-20 tokens.',
      image: '/images/transfer.svg',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Portfolio Analytics',
      description: 'Track your portfolio performance, view asset distribution, and analyze your investment trends.',
      image: '/images/analytics.svg',
    },
  ]

  const functionalities = [
    {
      title: 'Dashboard Overview',
      description: 'Get a comprehensive view of your crypto portfolio, market trends, and recent transactions all in one place.',
      features: ['Wallet Balance', 'Market Snapshot', 'Asset Distribution', 'Recent Transactions'],
    },
    {
      title: 'Market Explorer',
      description: 'Browse thousands of cryptocurrencies with real-time prices, market cap, volume, and price change data.',
      features: ['Live Prices', 'Search & Filter', 'Trending Coins', 'Price Charts'],
    },
    {
      title: 'Wallet Management',
      description: 'Manage your Ethereum wallet with ease. View addresses, QR codes, balances, and transaction history.',
      features: ['Wallet Address', 'QR Code', 'Balance Tracking', 'Transaction History'],
    },
    {
      title: 'Security Center',
      description: 'Control your account security settings, manage connected wallets, and monitor active sessions.',
      features: ['Auth Settings', 'Wallet Management', 'Session Control', 'Notifications'],
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <div className="fixed inset-0 bg-gradient-to-br from-black via-dark-950 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.1),transparent_50%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="gradient-text">CryptoBank</span>
            <br />
            <span className="text-white">Web3 Banking</span>
            <br />
         </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Secure, decentralized crypto banking platform with real-time market data,
            transaction history, and seamless wallet integration.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              variant="primary"
              size="lg"
              onClick={connect}
              isLoading={isConnecting}
              className="w-full sm:w-auto"
            >
              Connect Wallet
            </Button>
            <Link href={ROUTES.register}>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Create Account
              </Button>
            </Link>
          </div>

          {globalData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-sm text-gray-400 mb-1">Total Market Cap</p>
                <p className="text-lg font-semibold text-white">
                  {formatNumber(globalData.data.total_market_cap.usd / 1e12)}T
                </p>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-sm text-gray-400 mb-1">24h Volume</p>
                <p className="text-lg font-semibold text-white">
                  {formatNumber(globalData.data.total_volume.usd / 1e9)}B
                </p>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-sm text-gray-400 mb-1">BTC Dominance</p>
                <p className="text-lg font-semibold text-white">
                  {globalData.data.market_cap_percentage.btc.toFixed(1)}%
                </p>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-sm text-gray-400 mb-1">Active Coins</p>
                <p className="text-lg font-semibold text-white">
                  {formatNumber(globalData.data.active_cryptocurrencies)}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Powerful <span className="gradient-text">Features</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to manage your crypto assets securely and efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} variant="glass" glow className="hover:scale-105 transition-transform duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary-500/20 rounded-xl flex items-center justify-center text-primary-500 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
                <div className="mt-6 h-48 bg-gradient-to-br from-primary-500/10 to-primary-600/10 rounded-lg flex items-center justify-center border border-primary-500/20">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                      {feature.icon}
                    </div>
                    <p className="text-sm text-gray-400">{feature.title} Preview</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 bg-gradient-to-b from-transparent to-dark-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Core <span className="gradient-text">Functionalities</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Explore the comprehensive tools and features designed for modern crypto banking
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {functionalities.map((func, index) => (
              <Card key={index} variant="glass" className="relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl transform group-hover:scale-150 transition-transform duration-500" />
                <div className="relative">
                  <h3 className="text-2xl font-bold text-white mb-3">{func.title}</h3>
                  <p className="text-gray-400 mb-6">{func.description}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {func.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary-500 rounded-full" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 h-64 bg-gradient-to-br from-dark-900 to-dark-950 rounded-lg border border-primary-500/20 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(249,115,22,0.05)_50%,transparent_75%)] bg-[length:20px_20px]" />
                    <div className="relative z-10 text-center">
                      <div className="w-20 h-20 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-400">{func.title} Interface</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Connect Your Wallet',
                description: 'Connect your MetaMask wallet or create an account with email. Your keys, your control.',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'Explore Markets',
                description: 'Browse real-time cryptocurrency prices, market trends, and discover investment opportunities.',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Manage & Track',
                description: 'Monitor your portfolio, track transactions, and manage your crypto assets all in one place.',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <Card variant="glass" className="text-center h-full">
                  <div className="text-6xl font-bold text-primary-500/20 mb-4">{item.step}</div>
                  <div className="w-20 h-20 bg-primary-500/20 rounded-xl flex items-center justify-center text-primary-500 mx-auto mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 bg-gradient-to-b from-dark-950/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Bank-Grade <span className="gradient-text">Security</span>
              </h2>
              <p className="text-lg text-gray-400 mb-8">
                Your security is our top priority. We employ industry-leading security measures
                to protect your digital assets and personal information.
              </p>
              <div className="space-y-4">
                {[
                  'End-to-end encryption for all data',
                  'Non-custodial wallet integration',
                  'Multi-signature support',
                  'Regular security audits',
                  '2FA ready infrastructure',
                  'Compliance with industry standards',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <Card variant="glass" glow className="p-8">
                <div className="aspect-video bg-gradient-to-br from-primary-500/10 to-primary-600/10 rounded-lg border border-primary-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-primary-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <p className="text-gray-400">Security Dashboard Preview</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card variant="glass" glow className="p-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of users managing their crypto assets securely with CryptoBank
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={connect}
                isLoading={isConnecting}
              >
                Connect Wallet
              </Button>
              <Link href={ROUTES.register}>
                <Button variant="secondary" size="lg">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
