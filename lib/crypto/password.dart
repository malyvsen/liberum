import 'dart:math';

class Password {
  static const chars = '0123456789';
  static const length = 4;

  static String random() {
    final random = Random.secure();
    return List<String>.generate(
      length,
      (_) => chars[random.nextInt(chars.length)]
    ).join();
  }
}

class BadPasswordException implements Exception {
  BadPasswordException();
}