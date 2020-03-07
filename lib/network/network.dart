import 'package:liberum/network/account.dart';

class Network {
  final accounts = <Account>[];
  Account currentAccount;

  static List<Account> get savedAccounts {
    return [
      Account.fromPublicData('Cave Johnson', 'secret key'),
      Account.fromPublicData('Julius Caesar', 'ides of march')
    ]; // TODO: this is a mock
  }

  Network.logIn(Account account, String password) {
    this.currentAccount = Account.logIn(account.key.publicFingerprint, password);
    // TODO: load connections etc
  }

  void logOut() {
    // TODO
  }

  // used during synchronization
  void merge(Network other) {
    // TODO
  }
}