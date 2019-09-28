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

test("signatures can be verified using public key only", () => {
  const signingKey = new Key();
  const verifyingKey = new Key();
  const password = "Here we go!";
  const plaintext = "Clear, legible plaintext";
  return signingKey.generate(password, 1024).then(() => {
    verifyingKey.publicKey = signingKey.publicKey;
    return signingKey.sign(plaintext).then(signature => {
      return verifyingKey.verify(plaintext, signature).then(status => {
        expect(status).toBe(true);
      });
    });
  });
});
