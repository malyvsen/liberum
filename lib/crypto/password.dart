import 'dart:math';

class Password {
  Password(this._string);

  Password.load(String fingerprint) {
    this._string = 'lemons'; // TODO: loading from secure storage
  }

  Password.generate() {
    final random = Random.secure();
    this._string = allowedChars.map(
      (chars) => chars[random.nextInt(chars.length)]
    ).join();
  }

  bool operator ==(other) {
    return this._string == other._string;
  }

  int get hashCode {
    return this._string.hashCode;
  }

  String _string;

  static const allowedChars = [
    '😀😂😋😎😍🤗🤩🙄🤐😴🤑🤯😱😬🤮🥳',
    '👕👖👗👙👞🧦🧣🎩🧢👑💍👜🎒🕶🥽🌂',
    '🐰🦊🐻🐼🦁🐮🐷🐸🐵🐔🐴🐝🦋🐞🐢🐍',
    '💩💨🌪🌙🌍⭐️🔥🌈☀️⚡️☁️❄️⛄️💧🎃☠️'
  ];
}

class BadPasswordException implements Exception {
  BadPasswordException();
}