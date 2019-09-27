import cryptico from "./cryptico.js";

export default class Key {
  constructor(crypticoKey) {
    this.crypticoKey = crypticoKey || null;
  }

  generate = async (password, bitLength = 2048) => {
    this.crypticoKey = cryptico.generateRSAKey(password, bitLength);
  };

  encrypt = async plaintext => {
    return cryptico.encrypt(plaintext, this.publicKey);
  };

  decrypt = async ciphertext => {
    if (!this.crypticoKey) {
      throw new Error("cannot decrypt without private key");
    }
    return cryptico.decrypt(ciphertext, this.crypticoKey);
  };

  #publicKey = null;

  get publicKey() {
    return this.#publicKey || cryptico.publicKeyString(this.crypticoKey);
  }

  set publicKey(publicKey) {
    if (this.crypticoKey) {
      throw new Error("cannot set public key when full keypair known");
    }
    this.#publicKey = publicKey;
  }
}
