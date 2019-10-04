const sha256 = require("js-sha256").sha256;

export function fast(plaintext) {
  return "256a" + sha256(plaintext);
}

export function strong(plaintext, salt) {
  const difficulty = 2 ** 24;
  var carry = plaintext;
  for (var i = 0; i < difficulty; i++) {
    carry = sha256(salt + carry);
  }
  return "256b" + carry;
}
