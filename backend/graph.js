import Key from "./crypto/key.js";

export default class Graph {
  constructor(savePath) {
    this.accounts = savePath || []; // TODO: load data from save
    this.currentAccount = null; // TODO: make this read-only
  }

  logIn = async (account, password) => {
    const keyFromPassword = new Key();
    keyFromPassword.generate(password);
    if (keyFromPassword.publicKey == account.key.publicKey) {
      this.currentAccount = account;
      this.currentAccount.key = keyFromPassword;
    } else {
      throw new Error("keys don't match!");
    }
  };

  syncWith = async account => {
    console.log("syncing with " + account.name); // TODO
  };

  linkWith = async account => {
    console.log("linking with " + account.name); // TODO
  };
}
