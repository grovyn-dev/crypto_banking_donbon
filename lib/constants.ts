export const SUPPORTED_CHAINS = {
  ethereum: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://eth.llamarpc.com',
    explorer: 'https://etherscan.io',
  },
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/',
    explorer: 'https://sepolia.etherscan.io',
  },
}

export const DEFAULT_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID 
  ? parseInt(process.env.NEXT_PUBLIC_CHAIN_ID) 
  : 1

export const API_ENDPOINTS = {
  coingecko: {
    base: 'https://api.coingecko.com/api/v3',
    markets: '/coins/markets',
    global: '/global',
    trending: '/search/trending',
    coin: '/coins',
    price: '/simple/price',
  },
  molaris: {
    base: process.env.MOLARIS_BASE_URL || 'https://api.molaris.io',
    transactions: '/v1/transactions',
  },
}

export const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  markets: '/markets',
  about: '/about',
  support: '/support',
  login: '/login',
  register: '/register',
}

export const TOKEN_SYMBOLS = ['ETH', 'BTC', 'USDT', 'USDC', 'BNB', 'ADA', 'SOL', 'DOT', 'MATIC', 'AVAX']

