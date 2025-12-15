import {
  base64ToUint8Array,
  decryptSecret,
  encryptSecret,
  exportKeyToBase64,
  importKeyFromBase64,
  uint8ArrayToBase64,
} from "#/lib/crypto";

describe("crypto", () => {
  it("encrypts and decrypts", async () => {
    const secret = "My secret";
    const { encrypted, iv, key } = await encryptSecret(secret);

    expect(iv).toBeInstanceOf(Uint8Array);
    expect(encrypted).toBeInstanceOf(Uint8Array);
    expect(encrypted.byteLength).toBeGreaterThan(0);

    const decrypted = await decryptSecret(encrypted, iv, key);
    expect(decrypted).toBe(secret);
  });

  it("imports a base64 key that can be used to decrypt", async () => {
    const secret = "My secret";
    const { encrypted, iv, key } = await encryptSecret(secret);

    const base64Key = await exportKeyToBase64(key);
    const importedKey = await importKeyFromBase64(base64Key);

    const decrypted = await decryptSecret(encrypted, iv, importedKey);
    expect(decrypted).toBe(secret);
  });

  it("converts between Uint8Array and base64", () => {
    const bytes = new Uint8Array([1, 2, 3, 250, 255]);

    const base64 = uint8ArrayToBase64(bytes);
    const roundTrip = base64ToUint8Array(base64);

    expect(base64).toBe("AQID+v8=");
    expect(roundTrip).toEqual(bytes);
  });
});
