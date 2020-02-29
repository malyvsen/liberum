import 'package:test/test.dart';
import 'package:liberum/crypto/key.dart';


void main() {
  Key generatedKey;
  String plainText;

  setUp(() async {
    generatedKey = Key.generate();
    plainText = 'When life gives you lemons, don\'t make lemonade!';
  });

  test('Matching keys verify succesfully', () {
    Key otherKey = Key.fromPublicKey(generatedKey.publicKey);
    expect(otherKey.verify(plainText, generatedKey.sign(plainText)), isTrue);
  });

  test('Two random keys are different', () {
    Key otherKey = Key.generate();
    expect(otherKey.publicKey, isNot(equals(generatedKey.publicKey)));
  });
}