export default class Signature {
  constructor(account, privateKey) {
    this.account = account;
    this.signature = privateKey ? "somekindofit" : "nope";
  }
  verify() {
    console.log("that was easy");
    return true;
  }
}
