import 'package:liberum/graph/account.dart';

class Graph {
  final accounts = <Account>[];
  Account currentAccount;

  List<Account> get savedAccounts {
    return [Account("Cave Johnson", "PUBLIC KEY GOES HERE")]; // TODO: this is a mock
  }

  bool logIn(Account account, String password) {
    return true; // TODO
  }

  void logOut() {
    // TODO
  }

  // used during synchronization
  void merge(Graph other) {
    // TODO
  }
}