class Key {
  Key(String publicKey) {
    // TODO
  }

  bool get locked {
    return false; // TODO
  }

  void unlock(String fileName, String password) {
    // TODO
  }

  void lock() {
    // TODO
  }

  String sign(String plainText) {
    return "NOT IMPLEMENTED"; // TODO
  }

  bool verify(String plainText, String signature) {
    return true; // TODO
  }

  String get publicKey {
    return "NOT IMPLEMENTED"; // TODO
  }
}