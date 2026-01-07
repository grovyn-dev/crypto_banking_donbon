import React from 'react'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants'

export const Footer: React.FC = () => {
  return (
    <footer className="glass border-t border-primary-500/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold gradient-text mb-4">CryptoBank</h3>
            <p className="text-gray-400 text-sm">
              Secure, decentralized crypto banking platform for the Web3 era.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href={ROUTES.dashboard} className="hover:text-primary-500 transition-colors">Dashboard</Link></li>
              <li><Link href={ROUTES.markets} className="hover:text-primary-500 transition-colors">Markets</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href={ROUTES.about} className="hover:text-primary-500 transition-colors">About</Link></li>
              <li><Link href={ROUTES.support} className="hover:text-primary-500 transition-colors">Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-500 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary-500 transition-colors">Compliance</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-dark-700 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} CryptoBank. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

