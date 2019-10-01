import cryptico from "./cryptico.js";

export default class Key {
  constructor({ publicKey, secret, bitLength }) {
    if (publicKey && secret)
      throw new Error(
        "make up your mind, do you want to generate a key or create a locked one?"
      );
    if (!(publicKey || secret))
      throw new Error("you must provide a public key or secret");
    if (publicKey) {
      this.#publicKey = publicKey;
    } else {
      this.unlock(secret, bitLength);
    }
  }

  get locked() {
    return !this.#crypticoKey;
  }

  unlock(secret, bitLength = 2048) {
    if (!this.locked) throw new Error("cannot unlock already unlocked key");
    this.#crypticoKey = cryptico.generateRSAKey(secret, bitLength);
    if (this.#publicKey) {
      if (cryptico.publicKeyString(this.#crypticoKey) != this.#publicKey) {
        throw new Error(
          "generated key does not match! this is likely due to an incorrect secret"
        );
      }
      this.#publicKey = null;
    }
  }

  lock() {
    if (this.locked) throw new Error("cannot lock already locked key");
    this.#publicKey = this.publicKey;
    this.#crypticoKey = null;
  }

  sign(plaintext) {
    if (this.locked) throw new Error("cannot use locked key to sign");
    return cryptico.sign(plaintext, this.#crypticoKey);
  }

  verify(plaintext, signature) {
    return cryptico.verify(plaintext, signature, this.publicKey);
  }

  get publicKey() {
    return this.#publicKey || cryptico.publicKeyString(this.#crypticoKey);
  }

  #crypticoKey = null;
  #publicKey = null;
}
