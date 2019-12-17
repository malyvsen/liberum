export default class Link {
  constructor(accounts, validFrom, signatures = {}) {
    this.accounts = accounts;
    this.validFrom = validFrom;
    this.signatures = signatures;
    if (
      Object.keys(this.signatures).some(
        publicKey =>
          !this.accounts.map(account => account.publicKey).includes(publicKey)
      )
    )
      throw new Error("all signing accounts must be part of link");
  }

  addSignature(account, signature, verify = true) {
    if (!(account in this.accounts))
      throw new Error("signing account must be part of link");
    if (verify) {
      if (!account.key.verify(this.toSign, signature))
        throw new Error("invalid signature!");
    }
    if (this.signatures[account.key.publicKey])
      throw new Error("link already signed by account");
    this.signatures[account.key.publicKey] = signature;
  }

  /** Assumes validity of signatures, only checks if signed by all parties and not expired. */
  get valid() {
    if (Object.keys(this.signatures).length !== this.accounts.length)
      return false;
    return Date.now() < this.validUntil;
  }

  get validUntil() {
    return this.validFrom + validityPeriod;
  }

  /** String that should be signed by accounts, the same for everyone. */
  get toSign() {
    const accountNames = this.accounts.map(account => account.name).sort();
    const publicKeys = this.accounts.map(account => account.name).sort();
    return [accountNames.join(":"), publicKeys.join(":"), this.validFrom].join(
      "&"
    );
  }
}

const validityPeriod = 30 * 24 * 60 * 60 * 1000;
