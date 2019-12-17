import { AsyncStorage } from "react-native";
import { Account } from "./Account";
import { Link } from "./Link";

/** The "universe": contains all known accounts, used to log in.
 * Must be initialized (either loaded from a save or seeded with a new account) before use.
 */
export default class Graph {
  constructor(accounts = []) {
    this.accounts = accounts;
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
    this.currentAccount.key.lock();
    this.#currentAccount = null;
  }

  linkWith = async accountName => {
    if (!this.loggedIn) throw new Error("must log in before linking");
    console.log("linking with " + accountName); // TODO
  };

  save = async path => {
    await AsyncStorage.setItem(
      path,
      JSON.stringify({
        saveSystemVersion: saveSystemVersion,
        accounts: this.accounts,
        links: this.links
      })
    );
  };

  load = async path => {
    if (this.accounts != [])
      throw new Error("cannot load when already not empty");
    const loaded = await AsyncStorage.getItem(path);
    const data = JSON.parse(loaded);

    if (data.saveSystemVersion != saveSystemVersion)
      throw new Error("mismatched save system version");

    this.accounts = data.accounts.map(
      accountData => new Account(accountData.name, accountData.publicKey)
    );

    for (let linkData of data.links) {
      const keys = Object.keys(linkData.signatures);
      const accounts = keys.map(key =>
        this.accounts.find(account => account.key.publicKey == key)
      );
      const link = new Link(accounts, linkData.validFrom, linkData.signatures);
      if (!link.valid) continue; // could be expired, for example

      for (let account of accounts) {
        account.links.push(link);
      }
    }
  };

  get accounts() {
    return this.accounts;
  }

  get links() {
    const withDuplicates = this.accounts.map(account => account.links).flat();
    return [...new Set(withDuplicates)]; // this compares references, so linked accounts must share link objects
  }

  get currentAccount() {
    return this.#currentAccount;
  }

  #currentAccount = null;
}

const saveSystemVersion = 0;
