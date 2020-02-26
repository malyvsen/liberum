import 'package:liberum/graph/account.dart';

class Link {
  List<Account> accounts;

  Link(this.accounts, this._validFrom) {
    // TODO
  }

  DateTime _validFrom;
  DateTime get validFrom => _validFrom;

  DateTime get validUntil => validFrom.add(Duration(days: 30)); // TODO

  void addSignature(Account account, String signature, {bool verify = true}) {
    // TODO
  }
}