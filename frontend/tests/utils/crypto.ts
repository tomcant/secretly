import { uint8ArrayToBase64 } from "#/lib/crypto";

export const createEncryptedPayload = async (plaintext: string) => {
  const iv = new Uint8Array(Array.from({ length: 12 }, (_, i) => i + 1)); // 12 bytes
  const keyBytes = new Uint8Array(Array.from({ length: 32 }, (_, i) => i + 1)); // 32 bytes
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-GCM", length: 256 },
    true, // extractable
    ["encrypt", "decrypt"],
  );
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plaintext),
  );

  return {
    keyBase64: uint8ArrayToBase64(keyBytes),
    ciphertextBase64: uint8ArrayToBase64(new Uint8Array(encrypted)),
    ivBase64: uint8ArrayToBase64(iv),
  };
};
