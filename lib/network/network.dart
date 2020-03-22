import 'package:liberum/crypto/key.dart';
import 'package:liberum/network/account.dart';

class Network {
  final accounts = <Account>[];
  Account loggedInAccount;

  static List<Account> get loggableAccounts {
    return [
      Account.fromPublicData('Cave Johnson', Key.generate().publicKey),
      Account.fromPublicData('Julius Caesar', Key.generate().publicKey)
    ]; // TODO: this is a mock
  }

  Network.logIn(Account account, String password) {
    this.loggedInAccount = Account.logIn(account.key.publicFingerprint, password);
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