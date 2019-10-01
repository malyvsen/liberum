import cryptico from "./cryptico.js";

export default class Key {
  constructor(crypticoKey) {
    this.crypticoKey = crypticoKey || null;
  }

  generate = async (password, bitLength = 2048) => {
    this.crypticoKey = cryptico.generateRSAKey(password, bitLength);
    if (this.#publicKey) {
      if (cryptico.publicKeyString(this.crypticoKey) != this.#publicKey) {
        throw new Error("generated key does not match known key!");
      }
      this.#publicKey = null;
    }
  };

  sign = async plaintext => {
    if (!this.crypticoKey) {
      throw new Error("cannot decrypt without private key");
    }
    return cryptico.sign(plaintext, this.crypticoKey);
  };

  verify = async (plaintext, signature) => {
    return cryptico.verify(plaintext, signature, this.publicKey);
  };

  get publicKey() {
    return this.#publicKey || cryptico.publicKeyString(this.crypticoKey);
  }

  set publicKey(publicKey) {
    if (this.crypticoKey) {
      throw new Error("cannot set public key when full keypair known");
    }
    this.#publicKey = publicKey;
  }

  #publicKey = null;
}
