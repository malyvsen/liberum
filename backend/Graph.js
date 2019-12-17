export default class Graph {
  constructor(savePath) {
    this.accounts = savePath || []; // TODO: load data from save
  }

  get loggedIn() {
    return this.currentAccount != null;
  }

  logIn(account, password) {
    if (!this.accounts.includes(account))
      throw new Error("cannot log into unknown account");
    if (this.loggedIn)
      throw new Error("must log out first before loggin back in");
    account.unlock(password);
    this.#currentAccount = account;
  }

  logOut() {
    if (!this.loggedIn) throw new Error("cannot log out when not logged in");
    this.currentAccount.lock();
    this.#currentAccount = null;
  }

  linkWith = async accountName => {
    if (!this.loggedIn) throw new Error("must log in before linking");
    console.log("linking with " + accountName); // TODO
  };

  get currentAccount() {
    return this.#currentAccount;
  }

  #currentAccount = null;
}
