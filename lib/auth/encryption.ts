const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-32-byte-key-change-in-production'

export function encrypt(data: string): string {
  try {
    return btoa(JSON.stringify({ data, timestamp: Date.now() }))
  } catch (error) {
    console.error('Encryption error:', error)
    return data
  }
}

export function decrypt(encryptedData: string): string | null {
  try {
    const decoded = JSON.parse(atob(encryptedData))
    const maxAge = 7 * 24 * 60 * 60 * 1000
    if (Date.now() - decoded.timestamp > maxAge) {
      return null
    }
    return decoded.data
  } catch (error) {
    console.error('Decryption error:', error)
    return null
  }
}

export function setSecureStorage(key: string, value: string): void {
  if (typeof window === 'undefined') return
  const encrypted = encrypt(value)
  localStorage.setItem(key, encrypted)
}

export function getSecureStorage(key: string): string | null {
  if (typeof window === 'undefined') return null
  const encrypted = localStorage.getItem(key)
  if (!encrypted) return null
  return decrypt(encrypted)
}

export function removeSecureStorage(key: string): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(key)
}

