export default class Link {
  constructor(accounts, validFrom) {
    this.accounts = accounts;
    this.validFrom = validFrom;
  }

  addSignature(account, signature, verify = true) {
    if (!(account in this.accounts))
      throw new Error("signing account must be part of link");
    if (verify) {
      if (!account.key.verify(this.toSign, signature))
        throw new Error("invalid signature!");
    }
    if (this.#signatures[account.key.publicKey])
      throw new Error("link already signed by account");
    this.#signatures[account.key.publicKey] = signature;
  }

  get valid() {
    if (Object.keys(this.#signatures).length !== this.accounts.length)
      return false;
    return Date.now() < this.validUntil;
  }

  get validUntil() {
    return this.validFrom + validityPeriod;
  }

  // string that should be signed by accounts, the same for everyone
  get toSign() {
    const accountNames = this.accounts.map(account => account.name).sort();
    const publicKeys = this.accounts.map(account => account.name).sort();
    return [accountNames.join(":"), publicKeys.join(":"), this.validFrom].join(
      "&"
    );
  }

  #signatures = {};
}

const validityPeriod = 30 * 24 * 60 * 60 * 1000;
