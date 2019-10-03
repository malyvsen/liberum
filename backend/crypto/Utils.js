// Adapted for use in last-id from https://github.com/wwwtyro/cryptico
// Cryptico could not be used as is because of security and dependency issues

const bigInt = require("big-integer");
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

  generateKey: function(password, bitLength) {
    const rng = seedrandom(password).quick; // 32 bits is enough - BigInteger.js internally uses base 10^7
    return RSAKey.generate(bitLength, rng);
  },

  publicKeyString: function(rsakey) {
    return rsakey.mod.toString(16);
  }
};
