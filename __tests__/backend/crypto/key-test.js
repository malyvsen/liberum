import expect, { createSpy, spyOn, isSpy } from "expect";
import Key from "../../../backend/crypto/key.js";

test("same passwords give same public keys", () => {
  const key = new Key();
  const sameKey = new Key();
  const password = "Here we go!";
  return key.generate(password, 1024).then(() => {
    return sameKey.generate(password, 1024).then(() => {
      expect(sameKey.publicKey).toBe(key.publicKey);
    });
  });
});

test("different passwords give different public keys", () => {
  const key = new Key();
  const differentKey = new Key();
  return key.generate("Here we go!", 1024).then(() => {
    return differentKey.generate("No we don't", 1024).then(() => {
      expect(differentKey.publicKey).not.toBe(key.publicKey);
    });
  });
});

test("same plaintext gives different ciphertext", () => {
  const key = new Key();
  const plaintext = "Clear, legible plaintext";
  return key.generate("Let's see!", 1024).then(() => {
    return key.encrypt(plaintext).then(ciphertext => {
      return key.encrypt(plaintext).then(differentCiphertext => {
        expect(differentCiphertext).not.toBe(ciphertext);
      });
    });
  });
});

test("encryption is reversible with same password", () => {
  const key = new Key();
  const sameKey = new Key();
  const password = "Here we go!";
  const plaintext = "Clear, legible plaintext";
  return key.generate(password, 1024).then(() => {
    return sameKey.generate(password, 1024).then(() => {
      return key.encrypt(plaintext).then(ciphertext => {
        return sameKey.decrypt(ciphertext).then(decrypted => {
          expect(decrypted).toBe(plaintext);
        });
      });
    });
  });
});
