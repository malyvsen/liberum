import utils from "./Utils";

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
    return !this.#rsaKey;
  }

  unlock(secret, bitLength = 2048) {
    if (!this.locked) throw new Error("cannot unlock already unlocked key");
    this.#rsaKey = utils.generateKey(secret, bitLength);
    if (this.#publicKey) {
      if (utils.publicKeyString(this.#rsaKey) != this.#publicKey) {
        throw new Error(
          "generated key: " +
            utils.publicKeyString(this.#rsaKey) +
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
    return utils.sign(plaintext, this.#rsaKey);
  }

  verify(plaintext, signature) {
    return utils.verify(plaintext, signature, this.publicKey);
  }

  get publicKey() {
    return this.#publicKey || utils.publicKeyString(this.#rsaKey);
  }

  #rsaKey = null;
  #publicKey = null;
}
