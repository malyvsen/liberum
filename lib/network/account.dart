import 'package:liberum/crypto/key.dart';
import 'package:liberum/network/link.dart';


class Account {
  String name;
  Key key;
  List<SignedLink> links = <SignedLink>[];

  Account(this.name, {Key key}) {
    // TODO: generate key if needed
  }

  Account.fromPublicData(this.name, String publicKey) {
    this.key = Key.fromPublicKey(publicKey);
  }

  Account.fromJson(Map<String, dynamic> json) {
    this.name = json['name'];
    this.key = Key.fromJson(json['key']);
  }

  Map<String, dynamic> toJson() => {
    'name': this.name,
    'key': this.key.toJson()
  };

  double getTrustOf(Account other) {
    return 0.5; // TODO: trust allocation algorithm
  }
}