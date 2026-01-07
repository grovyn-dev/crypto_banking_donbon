# CryptoBank - Production-Grade Web3 Banking Platform

A modern, secure crypto banking web application built with Next.js, featuring Web3 wallet integration, real-time market data, and comprehensive transaction management.

## 🚀 Features

### Authentication System
- **Email/Password Authentication** - Traditional email-based login with JWT tokens
- **Web3 Wallet Authentication** - MetaMask wallet-based authentication with message signing
- **Protected Routes** - Middleware-based route protection
- **Session Persistence** - Secure encrypted session storage
- **2FA Ready** - Structure in place for future two-factor authentication

### Web3 Integration
- **MetaMask Integration** - Connect/disconnect wallet functionality
- **Wallet Management** - View address, balance, and network information
- **Transaction Signing** - Sign messages for identity verification
- **On-chain Transactions** - Send ETH transactions directly from the app
- **Error Handling** - Comprehensive error handling for wallet operations

### Market Data (CoinGecko)
- **Live Market Data** - Real-time cryptocurrency prices and market statistics
- **Global Market Stats** - Total market cap, volume, and dominance metrics
- **Trending Coins** - Top trending cryptocurrencies
- **Price Charts** - Historical price data (1D, 7D, 30D, 1Y)
- **Search & Filter** - Search coins and filter by market cap, price change, etc.

### Transaction History (Molaris)
- **Transaction History** - Complete transaction history for connected wallets
- **Transaction Details** - Detailed view of individual transactions
- **Filter & Search** - Filter by type, status, date range
- **Pagination** - Efficient pagination for large transaction lists
- **Real-time Updates** - Live transaction status updates

### AI-Powered Financial Reports
- **AI Report Generation** - Generate comprehensive financial reports using TinyLLaMA
- **Portfolio Analysis** - Automated analysis of portfolio performance
- **Risk Assessment** - AI-powered risk analysis based on transaction patterns
- **Executive Summaries** - Concise summaries of financial activity
- **Data-Driven Insights** - Observations and recommendations based on actual data

### UI/UX
- **Dark Theme** - Black base with orange accents
- **Glassmorphism** - Modern glassmorphic card designs
- **Smooth Animations** - Fluid transitions and hover effects
- **Responsive Design** - Mobile-first responsive layout
- **Premium Feel** - Fintech-grade user interface

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - App Router with React Server Components
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management

### Web3 & APIs
- **Ethers.js v6** - Ethereum library for Web3 interactions
- **MetaMask** - Browser wallet integration
- **CoinGecko API** - Cryptocurrency market data
- **Molaris API** - Blockchain transaction data

### Backend & Database
- **MongoDB** - NoSQL database for user data, transactions, and market cache
- **Mongoose** - MongoDB ODM for Node.js
- **Ollama** - Local LLM server for AI report generation
- **TinyLLaMA** - Lightweight language model for financial analysis

### Security
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Encrypted Storage** - Secure session storage
- **Protected Routes** - Middleware-based route protection

## 📦 Installation & Local Setup

### Prerequisites
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **MongoDB** - Local installation or MongoDB Atlas account
- **Ollama** - For AI report generation (TinyLLaMA model)
- **MetaMask** - Browser extension for wallet features (optional)
- **Git** - For cloning the repository

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd fresh_pro
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up MongoDB

#### Option A: MongoDB Atlas (Cloud - Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user and get your connection string
4. Whitelist your IP address (or use `0.0.0.0/0` for development)

#### Option B: Local MongoDB
1. Install MongoDB locally:
   - **macOS**: `brew install mongodb-community`
   - **Windows**: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - **Linux**: Follow [MongoDB Installation Guide](https://www.mongodb.com/docs/manual/installation/)
2. Start MongoDB service:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   # MongoDB starts automatically as a service
   ```

### Step 4: Set Up Ollama & TinyLLaMA

1. **Install Ollama**
   - **macOS/Linux**: 
     ```bash
     curl -fsSL https://ollama.ai/install.sh | sh
     ```
   - **Windows**: Download from [Ollama Website](https://ollama.ai/download)
   - Or visit [https://ollama.ai](https://ollama.ai) for installation instructions

2. **Start Ollama Service**
   ```bash
   ollama serve
   ```
   This starts Ollama on `http://localhost:11434` (default port)

3. **Pull TinyLLaMA Model**
   ```bash
   ollama pull tinyllama
   ```
   This downloads the TinyLLaMA model (~637 MB). Wait for the download to complete.

4. **Verify Installation**
   ```bash
   ollama list
   ```
   You should see `tinyllama` in the list.

### Step 5: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Create .env file
touch .env
```

Add the following environment variables to `.env`:

```env
# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# MongoDB Connection
# For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/dbname
# For local MongoDB, use: mongodb://localhost:27017/cryptobank
MONGODB_URI=mongodb://localhost:27017/cryptobank

# Ollama/TinyLLaMA Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=tinyllama

# CoinGecko API (Optional - for market data)
COINGECKO_API_KEY=your-coingecko-api-key
# Note: CoinGecko free tier allows 10-50 calls/minute without API key

# Molaris API (Optional - for transaction history)
MOLARIS_API_KEY=your-molaris-api-key
MORALIS_API_KEY=your-moralis-api-key
MOLARIS_BASE_URL=https://api.molaris.io

# Ethereum Network
NEXT_PUBLIC_CHAIN_ID=1

# Application URL (for API routes)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important Notes:**
- Replace `JWT_SECRET` with a strong random string (use `openssl rand -base64 32` to generate)
- Update `MONGODB_URI` with your actual MongoDB connection string
- `OLLAMA_BASE_URL` should point to your Ollama instance (default: `http://localhost:11434`)
- API keys for CoinGecko and Molaris are optional but recommended for full functionality

### Step 6: Run the Development Server

```bash
npm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000)

### Step 7: Verify Setup

1. **Check MongoDB Connection**
   - The app will connect to MongoDB on startup
   - Check the terminal for connection success messages

2. **Check Ollama Connection**
   - Ensure Ollama is running: `ollama serve`
   - Test the connection:
     ```bash
     curl http://localhost:11434/api/tags
     ```

3. **Test the Application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Try registering/logging in
   - Connect a MetaMask wallet (optional)
   - Generate an AI financial report from the Dashboard

## 📁 Project Structure

```
fresh_pro/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/             # Authentication endpoints
│   │   ├── coingecko/        # CoinGecko proxy routes
│   │   └── reports/          # AI report generation
│   ├── dashboard/            # Dashboard page
│   ├── markets/              # Markets page
│   ├── about/                # About page
│   ├── support/              # Support page
│   ├── login/                # Login page
│   ├── register/             # Registration page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── ui/                   # Reusable UI components
│   ├── layout/               # Layout components
│   ├── auth/                 # Authentication components
│   └── reports/              # AI report components
├── hooks/                    # Custom React hooks
│   ├── useWeb3.ts            # Web3 wallet hook
│   ├── useMarkets.ts         # Market data hook
│   └── useTransactions.ts    # Transaction history hook
├── lib/                      # Utility libraries
│   ├── api/                  # API service layers
│   ├── auth/                 # Authentication utilities
│   ├── db/                   # Database connection
│   ├── services/             # Business logic services
│   │   ├── financialDataService.ts
│   │   └── aiReportService.ts
│   ├── web3/                 # Web3 provider
│   ├── utils.ts              # Utility functions
│   └── constants.ts          # App constants
├── models/                   # Mongoose schemas
│   ├── User.ts               # User model
│   ├── Wallet.ts             # Wallet model
│   ├── Transaction.ts        # Transaction model
│   ├── Report.ts             # AI Report model
│   └── index.ts              # Model exports
├── store/                    # Zustand state stores
│   ├── authStore.ts          # Authentication state
│   └── walletStore.ts        # Wallet state
├── .env                      # Environment variables (not in git)
├── render.yaml               # Render.com deployment config
└── package.json              # Dependencies
```

## 🔐 Security Considerations

### Production Checklist
- [ ] Replace mock authentication with real database
- [ ] Use strong, randomly generated JWT_SECRET
- [ ] Implement proper encryption for sensitive data
- [ ] Add rate limiting to API routes
- [ ] Enable HTTPS in production
- [ ] Implement CORS policies
- [ ] Add input validation and sanitization
- [ ] Set up proper error logging
- [ ] Implement session timeout
- [ ] Add CSRF protection

### Current Security Features
- ✅ JWT token-based authentication
- ✅ HTTP-only cookies for token storage
- ✅ Encrypted session storage
- ✅ Client-side authentication guards
- ✅ Wallet signature verification
- ✅ Input validation
- ✅ Secure API communication

## 🎨 Theme Customization

The app uses a black and orange color scheme. To customize:

1. **Colors** - Edit `tailwind.config.ts`:
   ```typescript
   colors: {
     primary: { /* Orange shades */ },
     dark: { /* Black shades */ },
   }
   ```

2. **Styles** - Modify `app/globals.css` for global styles

3. **Components** - Update individual components in `components/ui/`

## 📝 API Integration

### CoinGecko
- **Free tier**: 10-50 calls/minute (no API key required for basic usage)
- **Pro tier**: Higher rate limits with API key
- Get API key from [CoinGecko API](https://www.coingecko.com/en/api)
- Add to `.env` as `COINGECKO_API_KEY` (optional but recommended)

### Molaris
- Get API key from [Molaris](https://molaris.io)
- Add to `.env` as `MOLARIS_API_KEY` or `MORALIS_API_KEY`
- Set `MOLARIS_BASE_URL` in `.env`
- Used for fetching blockchain transaction history

### Ollama (TinyLLaMA)
- **Local LLM**: Runs entirely on your machine
- **No API key required**: Free and open-source
- **Model**: TinyLLaMA (~637 MB)
- **Default endpoint**: `http://localhost:11434`
- Configure `OLLAMA_BASE_URL` in `.env` if using a different port
- Used for AI-powered financial report generation

## 🚦 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style
- TypeScript strict mode enabled
- ESLint with Next.js config
- Prettier (recommended)

## 🐛 Troubleshooting

### MongoDB Connection Issues
- **Connection refused**: Ensure MongoDB is running
  ```bash
  # Check MongoDB status
  brew services list  # macOS
  sudo systemctl status mongod  # Linux
  ```
- **Authentication failed**: Verify username/password in connection string
- **Network timeout**: Check firewall settings and IP whitelist (for Atlas)
- **Connection string format**: 
  - Local: `mongodb://localhost:27017/cryptobank`
  - Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`

### Ollama/TinyLLaMA Issues
- **Connection refused**: Ensure Ollama is running
  ```bash
  ollama serve
  ```
- **Model not found**: Pull the model
  ```bash
  ollama pull tinyllama
  ```
- **Port already in use**: Change `OLLAMA_BASE_URL` in `.env` or stop other Ollama instances
- **Slow generation**: TinyLLaMA is lightweight but may be slow on older hardware
- **Test Ollama**:
  ```bash
  curl http://localhost:11434/api/generate -d '{
    "model": "tinyllama",
    "prompt": "Hello",
    "stream": false
  }'
  ```

### MetaMask Not Connecting
- Ensure MetaMask is installed and unlocked
- Check that you're on a supported network (Ethereum Mainnet)
- Clear browser cache and try again
- Check browser console for errors

### API Errors
- Verify API keys in `.env` file
- Check API rate limits
- Ensure network connectivity
- CoinGecko: Free tier works without API key but has rate limits

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Clear TypeScript cache: `rm -rf .next/cache`

### AI Report Generation Fails
- Verify Ollama is running: `ollama list`
- Check `OLLAMA_BASE_URL` in `.env` matches your Ollama instance
- Ensure TinyLLaMA model is installed: `ollama pull tinyllama`
- Check MongoDB connection (reports are stored in database)
- Review server logs for detailed error messages

## 📄 License

This project is proprietary and confidential.

## 👥 Contributing

This is a production application. All changes should be reviewed and tested before deployment.

## 🔮 Future Enhancements

- [ ] Multi-wallet support (WalletConnect, Coinbase Wallet)
- [ ] Token swap functionality
- [ ] DeFi protocol integration
- [ ] Advanced charting
- [ ] Enhanced portfolio analytics
- [ ] Mobile app
- [ ] 2FA implementation
- [ ] Email notifications
- [ ] Transaction scheduling
- [ ] Support for larger LLM models (Llama 2, Mistral)
- [ ] Real-time portfolio updates
- [ ] Historical report storage and retrieval

---

**Built with ❤️ for the Web3 future**

