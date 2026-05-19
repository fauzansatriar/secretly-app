/**
 * Secretly — Client-side AES-256-GCM Encryption
 *
 * All sensitive data is encrypted/decrypted ONLY on the client.
 * The server and database NEVER see plaintext.
 *
 * Key derivation: PBKDF2 (user passphrase) → AES-GCM key
 * Encryption: AES-256-GCM with random 96-bit IV per operation
 */

const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits for GCM
const PBKDF2_ITERATIONS = 600_000;
const SALT_LENGTH = 16;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function generateIV(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(IV_LENGTH));
}

function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

// ─── Key Derivation ──────────────────────────────────────────────────────────

/**
 * Derives an AES-GCM CryptoKey from a user passphrase using PBKDF2
 */
export async function deriveKey(
  passphrase: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Generates a random AES-GCM key (for users who don't want passphrase-based encryption)
 */
export async function generateKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: ALGORITHM, length: KEY_LENGTH },
    true,
    ["encrypt", "decrypt"]
  );
}

/**
 * Exports a CryptoKey to a base64 string (for secure storage)
 */
export async function exportKey(key: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey("raw", key);
  return arrayBufferToBase64(raw);
}

/**
 * Imports a base64 key string back into a CryptoKey
 */
export async function importKey(base64Key: string): Promise<CryptoKey> {
  const raw = base64ToArrayBuffer(base64Key);
  return crypto.subtle.importKey(
    "raw",
    raw,
    { name: ALGORITHM, length: KEY_LENGTH },
    true,
    ["encrypt", "decrypt"]
  );
}

// ─── Encrypt / Decrypt ───────────────────────────────────────────────────────

export interface EncryptedData {
  ciphertext: string; // base64
  iv: string; // base64
  salt?: string; // base64, present when using passphrase-based key
}

/**
 * Encrypts plaintext with the given CryptoKey
 * Returns base64-encoded ciphertext and IV
 */
export async function encrypt(
  plaintext: string,
  key: CryptoKey
): Promise<EncryptedData> {
  const encoder = new TextEncoder();
  const iv = generateIV();

  const cipherBuffer = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv: iv as BufferSource },
    key,
    encoder.encode(plaintext)
  );

  return {
    ciphertext: arrayBufferToBase64(cipherBuffer),
    iv: arrayBufferToBase64(iv.buffer as ArrayBuffer),
  };
}

/**
 * Decrypts ciphertext with the given CryptoKey and IV
 */
export async function decrypt(
  ciphertext: string,
  iv: string,
  key: CryptoKey
): Promise<string> {
  const decoder = new TextDecoder();

  const plainBuffer = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv: new Uint8Array(base64ToArrayBuffer(iv)) },
    key,
    base64ToArrayBuffer(ciphertext)
  );

  return decoder.decode(plainBuffer);
}

// ─── Convenience: Passphrase-based Encrypt/Decrypt ───────────────────────────

/**
 * Encrypts plaintext using a user passphrase (derives key internally)
 */
export async function encryptWithPassphrase(
  plaintext: string,
  passphrase: string
): Promise<EncryptedData> {
  const salt = generateSalt();
  const key = await deriveKey(passphrase, salt);
  const result = await encrypt(plaintext, key);
  return {
    ...result,
    salt: arrayBufferToBase64(salt.buffer as ArrayBuffer),
  };
}

/**
 * Decrypts ciphertext using a user passphrase
 */
export async function decryptWithPassphrase(
  ciphertext: string,
  iv: string,
  salt: string,
  passphrase: string
): Promise<string> {
  const saltBuffer = new Uint8Array(base64ToArrayBuffer(salt));
  const key = await deriveKey(passphrase, saltBuffer);
  return decrypt(ciphertext, iv, key);
}

// ─── Session Key Management ──────────────────────────────────────────────────

const SESSION_KEY_STORAGE = "secretly_session_key";

/**
 * Stores the encryption key in sessionStorage (cleared on tab close)
 * This keeps the key in memory only for the active session
 */
export async function storeSessionKey(key: CryptoKey): Promise<void> {
  const exported = await exportKey(key);
  sessionStorage.setItem(SESSION_KEY_STORAGE, exported);
}

/**
 * Retrieves the encryption key from sessionStorage
 */
export async function getSessionKey(): Promise<CryptoKey | null> {
  const stored = sessionStorage.getItem(SESSION_KEY_STORAGE);
  if (!stored) return null;
  return importKey(stored);
}

/**
 * Clears the session key (on logout)
 */
export function clearSessionKey(): void {
  sessionStorage.removeItem(SESSION_KEY_STORAGE);
}
