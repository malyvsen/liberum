import RSAKey from "./RSAKey";
import * as hash from "./Hash";

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
      this.unlock({ secret: secret, bitLength: bitLength });
    }
  }

  get locked() {
    return !this.#rsaKey;
  }

  unlock({ username, password, secret, bitLength = 2048 }) {
    if (!this.locked) throw new Error("cannot unlock already unlocked key");
    if ((username || password) && secret)
      throw new Error(
        "do you want to unlock with username+password or secret?"
      );
    if (!((username && password) || secret))
      throw new Error("provide either username+password or secret!");
    if (!secret) {
      secret = hash.strong(password, username);
    }
    this.#rsaKey = RSAKey.fromSeed(bitLength, secret);
    if (this.#publicKey) {
      if (this.#rsaKey.publicToString() != this.#publicKey) {
        throw new Error(
          "generated key: " +
            this.#rsaKey.publicToString() +
            " does not match known public key: " +
            this.#publicKey
        );
      }
      this.#publicKey = null;
    }
  }

  lock() {
    if (this.locked) throw new Error("cannot lock already locked key");
    this.#publicKey = this.publicKey;
    this.#rsaKey = null;
  }

  sign(plaintext) {
    if (this.locked) throw new Error("cannot use locked key to sign");
    return this.#rsaKey.sign(plaintext);
  }

  verify(plaintext, signature) {
    return RSAKey.publicFromString(this.publicKey).verify(plaintext, signature);
  }

  get publicKey() {
    return this.#publicKey || this.#rsaKey.publicToString();
  }

  #rsaKey = null;
  #publicKey = null;
}
