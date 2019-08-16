import { keyPair } from "./crypto";

export default class Graph {
  constructor(savePath) {
    this.accounts = savePath || []; // TODO: load data from save
    this.currentAccount = null; // TODO: make this read-only
  }
  logIn = async (account, password) => {
    const newKeyPair = await keyPair(password);
    assert(newKeyPair.publicKey == account.publicKey);
    this.currentAccount = account;
    this.currentAccount.privateKey = newKeyPair.privateKey;
  };
  syncWith = async account => {
    console.log("syncing with " + account.name); // TODO
  };
  linkWith = async account => {
    console.log("linking with " + account.name); // TODO
  };
}
