import 'package:liberum/crypto/key.dart';
import 'package:liberum/network/link.dart';


class Account {
  String name;
  Key key;
  List<Link> links = <Link>[];

  Account(this.name, {Key key}) {
    // TODO: generate key if needed
  }

  Account.fromPublicData(this.name, String publicKey) {
    this.key = Key.fromPublicKey(publicKey);
  }

  Account.logIn(String fingerprint) {
    this.name = 'Cave Johnson'; // TODO: load from storage
    this.key = Key.fromSecureStorage(fingerprint);
  }

  Account.load(String fingerprint) {
    this.name = 'Boris Johnson'; // TODO: load from storage
  }

  double getTrustOf(Account other) {
    return 0.5; // TODO
  }
}