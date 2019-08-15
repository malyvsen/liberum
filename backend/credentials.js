export default class Engine {
  get accounts() {
    return [];
  }
  get currentAccount() {
    return null;
  }
  logIn(account, password) {
    console.log(account, password);
  }
  syncWith(account) {
    console.log(account);
  }
  linkWith(account) {
    console.log(account);
  }
}
