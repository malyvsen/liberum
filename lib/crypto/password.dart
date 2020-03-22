import 'dart:math';

class Password {
  Password(this._string);

  Password.generate() {
    final random = Random.secure();
    this._string = allowedChars.map(
      (chars) => chars[random.nextInt(chars.length)]
    ).join();
  }

  Password.fromJson(Map<String, dynamic> json) {
    this._string = json['string'];
  }

  Map<String, dynamic> toJson() => {
    'string': this._string
  };

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