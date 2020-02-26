import 'package:liberum/graph/account.dart';

class Graph {
  final accounts = <Account>[];
  Account currentAccount;

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