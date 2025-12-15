/**
 * Encrypt a secret using AES-GCM
 *
 * @param plaintext The secret to encrypt
 * @returns Object containing encrypted data, IV, and the encryption key
 */
export async function encryptSecret(plaintext: string): Promise<{
  encrypted: Uint8Array;
  iv: Uint8Array;
  key: CryptoKey;
}> {
  const data = new TextEncoder().encode(plaintext);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true, // extractable
    ["encrypt", "decrypt"],
  );

  const encryptedData = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data,
  );

  return {
    encrypted: new Uint8Array(encryptedData),
    iv,
    key,
  };
}

/**
 * Export a CryptoKey to base64 string for transport in the URL fragment
 *
 * @param key The CryptoKey to export
 * @returns Base64-encoded key string
 */
export async function exportKeyToBase64(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey("raw", key);
  const base64 = btoa(String.fromCharCode(...new Uint8Array(exported)));
  return base64;
}

/**
 * Import a base64-encoded key string as a CryptoKey
 *
 * @param base64Key Base64-encoded key string
 * @returns Imported CryptoKey
 */
export async function importKeyFromBase64(
  base64Key: string,
): Promise<CryptoKey> {
  try {
    const bytes = base64ToUint8Array(base64Key);
    const key = await window.crypto.subtle.importKey(
      "raw",
      bytes as BufferSource,
      { name: "AES-GCM", length: 256 },
      true, // extractable
      ["decrypt"],
    );

    return key;
  } catch {
    throw new Error("Invalid encryption key.");
  }
}

/**
 * Decrypt a secret using AES-GCM
 *
 * @param ciphertext Encrypted data as Uint8Array
 * @param iv Initialization vector as Uint8Array
 * @param key The CryptoKey to use for decryption
 * @returns Decrypted plaintext string
 */
export async function decryptSecret(
  ciphertext: Uint8Array,
  iv: Uint8Array,
  key: CryptoKey,
): Promise<string> {
  try {
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv as BufferSource,
      },
      key,
      ciphertext as BufferSource,
    );

    return new TextDecoder().decode(decryptedData);
  } catch {
    throw new Error("Unable to decrypt the secret.");
  }
}

/**
 * Convert Uint8Array to base64 string
 *
 * @param bytes The Uint8Array to convert
 * @returns Base64-encoded string
 */
export function uint8ArrayToBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

/**
 * Convert base64 string to Uint8Array
 *
 * @param base64 The base64 string to convert
 * @returns Uint8Array
 */
export function base64ToUint8Array(base64: string): Uint8Array {
  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; ++i) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    throw new Error("Invalid data format.");
  }
}
