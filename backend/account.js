export default class Account {
  constructor(name, publicKey, connections = []) {
    this.name = name;
    this.publicKey = publicKey;
    this.connections = connections;
  }
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
