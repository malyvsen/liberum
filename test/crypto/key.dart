import 'package:test/test.dart';
import 'package:liberum/crypto/key.dart';


void main() {
  Key generatedKey;
  String plainText;

  setUp(() async {
    generatedKey = Key.generate();
    plainText = 'When life gives you lemons, don\'t make lemonade!';
  });

  test('The same key can be used to sign and verify', () {
    expect(generatedKey.verify(plainText, generatedKey.sign(plainText)), isTrue);
  });

  test('Two random keys are different', () {
    Key otherKey = Key.generate();
    expect(otherKey.publicKey, isNot(equals(generatedKey.publicKey)));
  });

  test('A signature forgery is detected', () {
    Key otherKey = Key.generate();
    expect(generatedKey.verify(plainText, otherKey.sign(plainText)), isFalse);
  });

  test('Public key can be stringified and parsed back', () {
    Key otherKey = Key.fromPublicKey(generatedKey.publicKey);
    expect(otherKey.publicKey, equals(generatedKey.publicKey));
  });

  test('Key pair can be stringified and parsed back', () {
    Key otherKey = Key.fromKeys(generatedKey.publicKey, generatedKey.privateKey);
    expect(otherKey.publicKey, equals(generatedKey.publicKey));
    expect(otherKey.privateKey, equals(generatedKey.privateKey));
  });

  test('Stringified and parsed key can be used for signing', () {
    Key otherKey = Key.fromKeys(generatedKey.publicKey, generatedKey.privateKey);
    expect(generatedKey.verify(plainText, otherKey.sign(plainText)), isTrue);
  });
}