import { keyPair } from "./crypto";

export default class Graph {
  constructor(savePath) {
    this.accounts = savePath || []; // TODO: load data from save
    this.currentAccount = "defaultAccount"; // TODO: make this read-only
  }
  logIn = async (account, password) => {
    const newKeyPair = await keyPair(password);
    if (newKeyPair.publicKey == account.publicKey) {
      this.currentAccount = account;
      this.currentAccount.privateKey = newKeyPair.privateKey;
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
