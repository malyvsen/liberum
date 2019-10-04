import { keyLength } from "./Config";
import RSAKey from "./RSAKey";
import * as Hash from "./Hash";

export default class Key {
  constructor({ publicKey, username, password, secret }) {
    if (publicKey && (secret || username || password))
      throw new Error(
        "make up your mind, do you want to generate a key or create a locked one?"
      );
    if (!(publicKey || secret || (username && password)))
      throw new Error(
        "you must provide a public key or means of generating a private key"
      );
    if (publicKey) {
      this.#publicKey = publicKey;
    } else {
      this.unlock({ username: username, password: password, secret: secret });
    }
  }

  get locked() {
    return !this.#rsaKey;
  }

  unlock({ username, password, secret }) {
    if (!this.locked) throw new Error("cannot unlock already unlocked key");
    if ((username || password) && secret)
      throw new Error(
        "do you want to unlock with username+password or secret?"
      );
    if (!((username && password) || secret))
      throw new Error("provide either username+password or secret!");
    if (!secret) {
      secret = Hash.strong(password, username);
    }
    this.#rsaKey = RSAKey.fromSeed(keyLength, secret);
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
