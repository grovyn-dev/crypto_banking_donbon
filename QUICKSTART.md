# Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- MetaMask browser extension (for wallet features)
- API keys for CoinGecko and Molaris (optional for basic functionality)

## Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   
   Minimum required variables:
   ```env
   JWT_SECRET=your-random-secret-key-here
   NEXT_PUBLIC_CHAIN_ID=1
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Open http://localhost:3000
   - Connect MetaMask wallet
   - Explore the platform!

## Demo Credentials

For email authentication (demo):
- Email: `demo@cryptobank.com`
- Password: `password123`

## Features to Test

1. **Landing Page** - Hero section with wallet connection
2. **Dashboard** - Wallet overview and market snapshot
3. **Markets** - Browse cryptocurrencies with search/filter
4. **Wallet** - View address, balance, and transaction history
5. **Security** - Manage authentication and settings

## API Keys (Optional)

### CoinGecko
- Sign up at https://www.coingecko.com/en/api
- Add `COINGECKO_API_KEY` to `.env`
- Free tier: 10-50 calls/minute

### Molaris
- Sign up at https://molaris.io
- Add `MOLARIS_API_KEY` and `MOLARIS_BASE_URL` to `.env`

## Troubleshooting

**MetaMask not connecting?**
- Ensure MetaMask is installed and unlocked
- Check browser console for errors
- Try refreshing the page

**API errors?**
- Verify API keys in `.env`
- Check network connectivity
- Review API rate limits

**Build errors?**
- Clear `.next` folder: `rm -rf .next`
- Reinstall: `rm -rf node_modules && npm install`

## Next Steps

1. Replace mock authentication with real database
2. Add your API keys for full functionality
3. Customize theme colors in `tailwind.config.ts`
4. Deploy to production (Vercel recommended)

