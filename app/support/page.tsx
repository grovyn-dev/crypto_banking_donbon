'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const faqs = [
  {
    question: 'How do I connect my MetaMask wallet?',
    answer: 'Click the "Connect Wallet" button in the navigation bar. Make sure MetaMask is installed in your browser. You\'ll be prompted to authorize the connection.',
  },
  {
    question: 'Is my wallet secure?',
    answer: 'Yes, we never store your private keys. All wallet operations are performed through MetaMask, and you maintain full control of your assets.',
  },
  {
    question: 'How do I view my transaction history?',
    answer: 'Navigate to the Wallet page after connecting your wallet. Your transaction history will be displayed automatically using the Molaris API.',
  },
  {
    question: 'Can I use this platform without MetaMask?',
    answer: 'Currently, MetaMask is required for wallet functionality. However, you can still browse markets and view data without connecting a wallet.',
  },
  {
    question: 'How often is market data updated?',
    answer: 'Market data from CoinGecko is updated in real-time. Prices and market statistics refresh automatically.',
  },
  {
    question: 'What networks are supported?',
    answer: 'Currently, we support Ethereum Mainnet. Support for additional networks will be added in future updates.',
  },
]

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Contact form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Support</h1>

        <Card variant="glass" className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-dark-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-dark-900 transition-colors"
                >
                  <span className="text-white font-medium">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="p-4 bg-dark-900 border-t border-dark-700">
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card variant="glass">
          <h2 className="text-2xl font-semibold text-white mb-6">Contact Us</h2>
          {submitted ? (
            <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
              <p className="text-green-400">Thank you! Your message has been sent. We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Subject"
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <Button type="submit" variant="primary" className="w-full md:w-auto">
                Send Message
              </Button>
            </form>
          )}
        </Card>

        <Card variant="glass" className="mt-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Help Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="https://metamask.io/support/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-dark-900 rounded-lg border border-dark-700 hover:border-primary-500 transition-colors"
            >
              <h3 className="text-white font-medium mb-2">MetaMask Support</h3>
              <p className="text-sm text-gray-400">Get help with MetaMask wallet</p>
            </a>
            <a
              href="https://ethereum.org/en/developers/docs/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-dark-900 rounded-lg border border-dark-700 hover:border-primary-500 transition-colors"
            >
              <h3 className="text-white font-medium mb-2">Ethereum Docs</h3>
              <p className="text-sm text-gray-400">Learn about Ethereum blockchain</p>
            </a>
            <a
              href="https://www.coingecko.com/en/api"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-dark-900 rounded-lg border border-dark-700 hover:border-primary-500 transition-colors"
            >
              <h3 className="text-white font-medium mb-2">CoinGecko API</h3>
              <p className="text-sm text-gray-400">Market data documentation</p>
            </a>
          </div>
        </Card>
      </div>
    </div>
  )
}

