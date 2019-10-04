// Adapted for use in last-id from https://github.com/wwwtyro/cryptico
// Cryptico could not be used as is because of security and dependency issues

// The functions here are wrappers intended to make changing to different signing scheme easier

const bigInt = require("big-integer");
const sha256 = require("js-sha256").sha256;
const seedrandom = require("seedrandom");
import RSAKey from "./RSAKey";

export default {
  sign: function(plaintext, key) {
    return key.sign(plaintext);
  },

  verify: function(plaintext, signature, publicKeyString) {
    const key = new RSAKey(bigInt(publicKeyString, 16));
    return key.verify(plaintext, signature);
  },

  generateKey: function(secret, bitLength) {
    const rng = seedrandom(secret).quick; // 32 bits is enough - BigInteger.js internally uses base 10^7
    return RSAKey.generate(bitLength, rng);
  },

  publicKeyString: function(rsakey) {
    return rsakey.mod.toString(16);
  },

  strongHash: function(plaintext, salt) {
    var carry = plaintext;
    for (var i = 0; i < hashDifficulty; i++) {
      carry = sha256(salt + carry);
    }
    return carry;
  }
};

const hashDifficulty = 2 ** 24;
