export default class Account {
  constructor(name, publicKey, links) {
    this.name = name;
    this.publicKey = publicKey;
    this.links = links || [];
  }
  getTrustOf(account) {
    return account;
  }
  iterateAccounts() {
    return [];
  }
  addLink(link) {
    return [link];
  }
}

/* testing */
// const newAccount = new Account("malyvsen", "AAAA-BBBB-CCCC");
// console.log(newAccount);
