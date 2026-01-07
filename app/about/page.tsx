import React from 'react'
import { Card } from '@/components/ui/Card'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">About CryptoBank</h1>

        <Card variant="glass" className="mb-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Platform Overview</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            CryptoBank is a production-grade Web3 banking platform designed to bridge the gap between
            traditional finance and decentralized finance. Our platform provides secure, real-time access
            to crypto markets, wallet management, and transaction history.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Built with modern web technologies and best security practices, CryptoBank offers a seamless
            experience for managing your digital assets while maintaining the highest standards of security
            and compliance.
          </p>
        </Card>

        <Card variant="glass" className="mb-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Security & Compliance</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Encryption</h3>
              <p className="text-gray-300">
                All sensitive data is encrypted using industry-standard encryption algorithms. Session tokens
                are securely stored and transmitted over HTTPS.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Wallet Security</h3>
              <p className="text-gray-300">
                We never store your private keys. All wallet operations are performed client-side through
                MetaMask, ensuring you maintain full control of your assets.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Compliance</h3>
              <p className="text-gray-300">
                Our platform adheres to industry best practices for security and privacy. We continuously
                monitor and update our security measures to protect user data.
              </p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="mb-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Frontend</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Next.js 14 (App Router)</li>
                <li>• React 18</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• Zustand (State Management)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Web3 & APIs</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Ethers.js</li>
                <li>• MetaMask Integration</li>
                <li>• CoinGecko API</li>
                <li>• Molaris API</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Security</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• JWT Authentication</li>
                <li>• Encrypted Session Storage</li>
                <li>• Protected Routes</li>
                <li>• Secure API Communication</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Real-time Market Data</li>
                <li>• Transaction History</li>
                <li>• Wallet Management</li>
                <li>• Price Charts & Analytics</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card variant="glass">
          <h2 className="text-2xl font-semibold text-white mb-4">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed">
            Our mission is to make Web3 banking accessible, secure, and user-friendly. We believe that
            everyone should have easy access to decentralized finance tools without compromising on security
            or user experience. CryptoBank is built for the future of finance.
          </p>
        </Card>
      </div>
    </div>
  )
}

