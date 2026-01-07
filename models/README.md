# MongoDB Schemas

Production-grade Mongoose schemas for the CryptoBank application.

## Database Connection

Use the connection utility in `lib/db/connection.ts`:

```typescript
import connectDB from '@/lib/db/connection'

// In API routes or server components
await connectDB()
```

## Models

### 1. User (`User.ts`)
Core user authentication and authorization.

**Fields:**
- `email` (unique, indexed) - User email address
- `passwordHash` (nullable) - Bcrypt hashed password (null for wallet-only users)
- `emailVerified` - Email verification status
- `twoFactorEnabled` - 2FA status
- `role` - USER | ADMIN
- `status` - ACTIVE | SUSPENDED

**Indexes:** email (unique), status, role

### 2. UserProfile (`UserProfile.ts`)
Extended user profile information.

**Fields:**
- `user` (ref: User, unique) - Reference to user
- `fullName` - User's full name
- `avatar` - Avatar URL
- `country` - Country code
- `preferredCurrency` - Default currency (default: USD)

**Indexes:** user (unique), country

### 3. Wallet (`Wallet.ts`)
User wallet connections.

**Fields:**
- `user` (ref: User) - Reference to user
- `address` (unique, indexed) - Ethereum wallet address (validated)
- `walletType` - MetaMask | WalletConnect | Coinbase | Other
- `blockchainNetwork` - Network name
- `chainId` - Blockchain chain ID
- `isPrimary` - Primary wallet flag

**Indexes:** address (unique), user, user+isPrimary, blockchainNetwork+chainId

### 4. AuthSession (`AuthSession.ts`)
Authentication sessions with TTL auto-cleanup.

**Fields:**
- `user` (ref: User) - Reference to user
- `refreshToken` - Encrypted refresh token
- `ipAddress` - Client IP address
- `userAgent` - Client user agent
- `expiresAt` - Session expiration (TTL index)

**Indexes:** user, refreshToken, expiresAt (TTL)

### 5. Transaction (`Transaction.ts`)
Blockchain transactions from Molaris.

**Fields:**
- `wallet` (ref: Wallet) - Reference to wallet
- `hash` (unique, indexed) - Transaction hash
- `fromAddress` - Sender address
- `toAddress` - Recipient address
- `amount` (Decimal128) - Transaction amount (high precision)
- `tokenSymbol` - Token symbol (default: ETH)
- `gasFee` (Decimal128) - Gas fee paid
- `blockNumber` - Block number
- `status` - PENDING | CONFIRMED | FAILED
- `blockchainTimestamp` - Block timestamp

**Indexes:** hash (unique), wallet, wallet+status, fromAddress, toAddress, blockNumber, blockchainTimestamp, createdAt

### 6. TransactionMetadata (`TransactionMetadata.ts`)
Extended transaction metadata from Molaris.

**Fields:**
- `transaction` (ref: Transaction, unique) - Reference to transaction
- `confirmations` - Number of confirmations
- `gasUsed` - Gas used (string for precision)
- `nonce` - Transaction nonce
- `inputData` - Transaction input data
- `rawMolarisResponse` (JSON) - Complete Molaris API response

**Indexes:** transaction (unique), confirmations

### 7. MarketCache (`MarketCache.ts`)
CoinGecko market data cache.

**Fields:**
- `coinId` (unique, indexed) - CoinGecko coin ID
- `symbol` - Token symbol
- `priceUSD` (Decimal128) - Current price in USD
- `marketCap` (Decimal128) - Market capitalization
- `volume24h` (Decimal128) - 24h trading volume
- `priceChange24h` (Decimal128) - 24h price change percentage
- `lastUpdated` - Last update timestamp

**Indexes:** coinId (unique), symbol, lastUpdated

### 8. UserWatchlist (`UserWatchlist.ts`)
User cryptocurrency watchlist.

**Fields:**
- `user` (ref: User) - Reference to user
- `coinId` - CoinGecko coin ID

**Indexes:** user+coinId (unique), user, coinId

### 9. SecurityLog (`SecurityLog.ts`)
Security event logging.

**Fields:**
- `user` (ref: User, nullable) - Reference to user (nullable for system events)
- `eventType` - LOGIN | LOGOUT | WALLET_CONNECT | WALLET_DISCONNECT | TX_SIGN | PASSWORD_CHANGE | 2FA_ENABLED | 2FA_DISABLED | ACCOUNT_SUSPENDED
- `eventDescription` - Event description
- `ipAddress` - Client IP address
- `userAgent` - Client user agent

**Indexes:** user, eventType, user+eventType, createdAt, ipAddress

### 10. Notification (`Notification.ts`)
User notifications.

**Fields:**
- `user` (ref: User) - Reference to user
- `title` - Notification title
- `message` - Notification message
- `isRead` - Read status

**Indexes:** user, user+isRead, createdAt, user+createdAt

## Usage

```typescript
import { User, Wallet, Transaction } from '@/models'
import connectDB from '@/lib/db/connection'

// Connect to database
await connectDB()

// Create user
const user = await User.create({
  email: 'user@example.com',
  passwordHash: hashedPassword,
  emailVerified: false,
  twoFactorEnabled: false,
  role: 'USER',
  status: 'ACTIVE',
})

// Create wallet
const wallet = await Wallet.create({
  user: user._id,
  address: '0x...',
  walletType: 'MetaMask',
  blockchainNetwork: 'Ethereum Mainnet',
  chainId: 1,
  isPrimary: true,
})
```

## Notes

- All schemas use `timestamps: true` for automatic `createdAt` and `updatedAt`
- Decimal128 is used for crypto amounts to maintain precision
- TTL index on AuthSession automatically cleans expired sessions
- All addresses are stored in lowercase for consistency
- Indexes are optimized for common query patterns

