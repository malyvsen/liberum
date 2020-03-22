import 'package:liberum/network/account.dart';


class SignedLink extends Link {
  List<String> signatures;

  SignedLink(accounts, this.signatures, validFrom, {bool verify=true}) : super(accounts, validFrom) {
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

  DateTime get validUntil => validFrom.add(Duration(days: 30));
  bool get isValid => DateTime.now().isBefore(this.validUntil);
}


class UnsignedLink extends Link {
  UnsignedLink(accounts, validFrom) : super(accounts, validFrom);
  
  SignedLink sign(List<String> signatures, {bool verify=true}) {
    return SignedLink(this.accounts, signatures, this._validFrom, verify: verify);
  }
}


abstract class Link {
  List<Account> accounts;

  Link(this.accounts, this._validFrom);

  DateTime _validFrom;
  DateTime get validFrom => _validFrom;

  String get signable => _accountStrings + '|' + _validFrom.hashCode.toRadixString(16);
  String get _accountStrings => accounts.map((account) => account.key.publicFingerprint).join('|');
}