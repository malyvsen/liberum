import expect from "expect";
import Key from "../../../backend/crypto/key.js";

test("same secrets give same public keys", () => {
  const key = new Key({ secret: "Here we go!", bitLength: 512 });
  const sameKey = new Key({ secret: "Here we go!", bitLength: 512 });
  expect(sameKey.publicKey).toBe(key.publicKey);
});

test("different secrets give different public keys", () => {
  const key = new Key({ secret: "Here we go!", bitLength: 512 });
  const differentKey = new Key({ secret: "No we don't", bitLength: 512 });
  expect(differentKey.publicKey).not.toBe(key.publicKey);
});

test("signatures can be verified using public key only", () => {
  const plaintext = "Plaintext to be signed";
  const signingKey = new Key({ secret: "Here we go!", bitLength: 512 });
  const verifyingKey = new Key({ publicKey: signingKey.publicKey });
  const signature = signingKey.sign(plaintext);
  const forgedSignature = signature
    .split("")
    .reverse()
    .join("");
  expect(verifyingKey.verify(plaintext, signature)).toBe(true);
});

test("forged signature is identified as such", () => {
  const plaintext = "Text someone wants to mess with";
  const signingKey = new Key({ secret: "Moo", bitLength: 512 });
  const verifyingKey = new Key({ publicKey: signingKey.publicKey });
  const signature = signingKey.sign(plaintext);
  const forgedSignature = signature
    .split("")
    .reverse()
    .join("");
  expect(verifyingKey.verify(plaintext, forgedSignature)).toBe(false);
});
