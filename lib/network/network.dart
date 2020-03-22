import 'package:liberum/crypto/key.dart';
import 'package:liberum/crypto/password.dart';
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

  Network.create(Account account, Password password) {
    // TODO: initialize the stuffsies
  }

  Network.logIn(Account account, Password password) {
    if (password != Password.load(account.key.publicFingerprint)) {
      throw BadPasswordException();
    }
    this.loggedInAccount = Account.logIn(account.key.publicFingerprint);
    // TODO: load connections etc
  }

  // used during synchronization
  Network.merge(Network a, Network b) {
    // TODO
  }

  void save() {
    // TODO
  }
}