import 'package:liberum/network/account.dart';

class Link {
  List<Account> accounts;
  List<String> signatures;

  Link(this.accounts, this.signatures, this._validFrom, {bool verify=true}) {
    if (this.accounts.length != this.signatures.length) {
      throw ArgumentError('Accounts and signatures lists must have the same length');
    }
    if (verify) {
      for (int i = 0; i < this.accounts.length; i++) {
        if (!this.accounts[i].key.verify(this.signable, this.signatures[i])) {
          throw new ArgumentError('Forged signature');
        }
      }
    }
  }

  DateTime _validFrom;
  DateTime get validFrom => _validFrom;

  DateTime get validUntil => validFrom.add(Duration(days: 30));

  bool get isValid => DateTime.now().isBefore(this.validUntil);


  String get signable => _accountStrings + '|' + _validFrom.hashCode.toRadixString(16);
  String get _accountStrings => accounts.map((account) => account.key.publicFingerprint).join('|');
}