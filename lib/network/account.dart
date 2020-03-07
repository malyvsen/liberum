import 'package:liberum/crypto/key.dart';
import 'package:liberum/network/link.dart';


class Account {
  String name;
  Key key;
  List<Link> links = <Link>[];

  Account.fromPublicData(this.name, String publicKey) {
    this.key = Key.fromPublicKey(publicKey);
  }

  Account.logIn(String fingerprint, String password) {
    this.name = 'Cave Johnson'; // TODO: load from storage
    this.key = Key.fromSecureStorage(this.name, password); // TODO
  }

  double getTrustOf(Account other) {
    return 0.5; // TODO
  }
}