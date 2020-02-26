import 'package:liberum/crypto/key.dart';
import 'package:liberum/graph/link.dart';


class Account {
  String name;
  Key key;
  List<Link> links = <Link>[];

  Account(this.name, String publicKey) {
    this.key = Key(publicKey);
  }

  void unlock(String password) {
    // TODO
  }

  double getTrustOf(Account other) {
    return 0.5; // TODO
  }
}