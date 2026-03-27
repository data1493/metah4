import sodium from 'libsodium-wrappers'

// Shared secret must be exactly 32 bytes — set VITE_SHARED_SECRET as a 64-char hex string
function getSharedKey(): Uint8Array {
  const hex = import.meta.env.VITE_SHARED_SECRET
  if (!hex || hex.length !== 64) {
    throw new Error('VITE_SHARED_SECRET must be a 64-character hex string (32 bytes)')
  }
  return sodium.from_hex(hex)
}

export interface EncryptedQuery {
  nonce: string   // hex-encoded
  ciphertext: string  // hex-encoded
}

/**
 * Encrypts a search query using libsodium secretbox (XSalsa20-Poly1305).
 * Both nonce and ciphertext are hex-encoded for safe JSON transport.
 * The server decrypts with the same shared key.
 */
export async function encryptQuery(query: string): Promise<EncryptedQuery> {
  await sodium.ready
  const key = getSharedKey()
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES)
  const message = sodium.from_string(query)
  const ciphertext = sodium.crypto_secretbox_easy(message, nonce, key)
  return {
    nonce: sodium.to_hex(nonce),
    ciphertext: sodium.to_hex(ciphertext),
  }
}
