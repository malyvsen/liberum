import 'package:liberum/crypto/password.dart' show BadPasswordException;
import 'dart:math' show Random;
import 'dart:typed_data' show Uint8List;

import 'package:pointycastle/asymmetric/api.dart'
show RSAPrivateKey, RSAPublicKey;

import 'package:encrypt/encrypt.dart'
show RSAKeyParser, RSASignDigest, RSASigner, Signer;

import 'package:pointycastle/export.dart'
show FortunaRandom, KeyParameter, ParametersWithRandom, RSAKeyGenerator, RSAKeyGeneratorParameters;


/// Wrapper around various crypto algorithms, used to sign/verify links
class Key {
  Key.fromPublicKey(String publicKey) {
    this._init(publicKey);
  }

  Key.fromKeys(String publicKey, String privateKey) {
    this._init(publicKey, privateKey: privateKey);
  }

  Key.fromStorage(String publicFingerprint) {
    final publicKey = "should be read from SQLite"; // TODO
    this._init(publicKey);
  }

  Key.fromSecureStorage(String publicFingerprint) {
    final eliminateMe = Key.generate();
    final publicKey = eliminateMe.publicKey; // TODO: should be read from SQLite
    final privateKey = eliminateMe.privateKey; // TODO: should be read from secure storage
    this._init(publicKey, privateKey: privateKey);
  }

  /// Securely generate a two-way key.
  /// Takes several seconds, call asynchronously!
  Key.generate() {
    final seedSource = Random.secure();
    final seeds = List<int>.generate(32, (_) => seedSource.nextInt(256));
    final secureRandom = FortunaRandom();
    secureRandom.seed(KeyParameter(Uint8List.fromList(seeds)));

    final keyGen = RSAKeyGenerator();
    keyGen.init(
      ParametersWithRandom(
        RSAKeyGeneratorParameters(BigInt.parse('65537'), 2048, 64),
        secureRandom
      )
    );
    final keyPair = keyGen.generateKeyPair();
    this._publicKey = keyPair.publicKey;
    this._privateKey = keyPair.privateKey;
  }

  String sign(String plainText) => Signer(
    RSASigner(
      RSASignDigest.SHA256,
      publicKey: this._publicKey,
      privateKey: this._privateKey
    )
  ).sign(plainText).base16;

  bool verify(String plainText, String signature) => Signer(
    RSASigner(
      RSASignDigest.SHA256,
      publicKey: this._publicKey
    )
  ).verify16(plainText, signature);

  /// Short identifier for a public key.
  /// Can be safely displayed publicly.
  String get publicFingerprint {
    return _publicKey.modulus.toRadixString(16).substring(0, 16);
  }

  String get publicKey =>
    _publicKey.modulus.toRadixString(radix) + separator +
    _publicKey.exponent.toRadixString(radix);
  String get privateKey =>
    _privateKey.modulus.toRadixString(radix) + separator +
    _privateKey.exponent.toRadixString(radix) + separator +
    _privateKey.p.toRadixString(radix) + separator +
    _privateKey.q.toRadixString(radix);

  // private
  RSAPublicKey _publicKey;
  RSAPrivateKey _privateKey;

  void _init(String publicKey, {String privateKey}) {
    final publicInts = parseBigInts(publicKey);
    this._publicKey = RSAPublicKey(publicInts[0], publicInts[1]);
    if (privateKey != null) {
      final privateInts = parseBigInts(privateKey);
      if (privateInts[0] != publicInts[0]) {
        throw ArgumentError('Private and public keys don\'t match');
      }
      this._privateKey = RSAPrivateKey(privateInts[0], privateInts[1], privateInts[2], privateInts[3]);
    }
  }

  static const String separator = '|';
  static const int radix = 16;
  static List<BigInt> parseBigInts(String separated) =>
    separated.split(separator).map((x) => BigInt.parse(x, radix: radix)).toList();
}