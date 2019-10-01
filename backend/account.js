import Key from "./crypto/key.js";

export default class Account {
  constructor(name, publicKey, connections = []) {
    this.name = name;
    this.key = new Key();
    this.key.publicKey = publicKey;
    this.connections = connections;
  }

  unlock = async password => {
    await this.key.generate(this.name + password);
  };

  getTrustOf = async account => {
    return account.connections.length / (account.connections.length + 1);
  };

  iterateAccounts() {
    return []; // TODO
  }

  connect = async connection => {
    this.connections.push(connection); // TODO
  };
}
