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

test("forged signature is identified as such", () => {
  const signingKey = new Key();
  const verifyingKey = new Key();
  const password = "Moo";
  const plaintext = "Text someone wants to mess with";
  return signingKey.generate(password, 1024).then(() => {
    verifyingKey.publicKey = signingKey.publicKey;
    return signingKey.sign(plaintext).then(signature => {
      const forgedSignature = signature
        .split("")
        .reverse()
        .join("");
      return verifyingKey.verify(plaintext, forgedSignature).then(status => {
        expect(status).toBe(false);
      });
    });
  });
});

test("the same passwords yields the same key across runs", () => {
  const key = new Key();
  const password = "Here we go!";
  return key.generate(password).then(() => {
    console.log(key.publicKey);
    expect(key.publicKey).toBe(
      "hGsN2fJJOCqbM8eZsrJzBbLGYMhUIWMe5gQcpuSRaMr/3mJr/6ZfmpYNGdX2iwS/b295D0lE0y5Eqs24AK3jmjb/3mqyhrP64r6YN/umduFRTutqL+xZHsMP5TTjgv8CzFwzlqGO267ZJ4XT9kJ5oeIHUaVWdz1jHQ3PPZaTRgGgGWhILWoGPkLJ3CKukIPaHP4jJxYnOTx6EB01Ain24BMcGHqV21Ptvwcl3kmoQsOQ9iUZGh1RKkJe4RQm1JSPBvn8S6wz0oWELAVxsHBs13y0ZBHZZDcDwo46CW0cfI4+/sXI4SOQRkpwpoVzYB4u4FMvTQiPQ+UxQ7O9GG5X9Q=="
    );
  });
});
