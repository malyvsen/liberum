import 'dart:math';

class Password {
  static const chars = '0123456789';
  static const length = 4;

  static String random() => List<String>.generate(
      length,
      (_) => chars[Random.secure().nextInt(chars.length)]
    ).join();
}