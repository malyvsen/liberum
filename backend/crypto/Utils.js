// Adapted for use in last-id from https://github.com/wwwtyro/cryptico
// Cryptico could not be used as is because of security and dependency issues

const seedrandom = require("seedrandom");
import RSAKey from "./RSASign";

export default {
  sign: function(plaintext, key) {
    return b16to64(key.signString(plaintext));
  },

  verify: function(plaintext, signature, publicKeyString) {
    const publicKey = publicKeyFromString(publicKeyString);
    const signature16 = b64to16(signature);
    return publicKey.verifyString(plaintext, signature16);
  },

  generateKey: function(password, bitLength) {
    const rng = seedrandom(password).quick; // 32 bits is enough - BigInteger.js internally uses base 10^7
    var rsa = new RSAKey();
    rsa.generate(bitLength, "03", rng);
    return rsa;
  },

  publicKeyString: function(rsakey) {
    return b16to64(rsakey.n.toString(16));
  }
};

const base64Chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function b16to64(h) {
  var i;
  var c;
  var ret = "";
  if (h.length % 2 == 1) {
    h = "0" + h;
  }
  for (i = 0; i + 3 <= h.length; i += 3) {
    c = parseInt(h.substring(i, i + 3), 16);
    ret += base64Chars.charAt(c >> 6) + base64Chars.charAt(c & 63);
  }
  if (i + 1 == h.length) {
    c = parseInt(h.substring(i, i + 1), 16);
    ret += base64Chars.charAt(c << 2);
  } else if (i + 2 == h.length) {
    c = parseInt(h.substring(i, i + 2), 16);
    ret += base64Chars.charAt(c >> 2) + base64Chars.charAt((c & 3) << 4);
  }
  while ((ret.length & 3) > 0) ret += "=";
  return ret;
}

function b64to16(s) {
  var ret = "";
  var i;
  var k = 0;
  var slop;
  for (i = 0; i < s.length; ++i) {
    if (s.charAt(i) == "=") break;
    v = base64Chars.indexOf(s.charAt(i));
    if (v < 0) continue;
    if (k == 0) {
      ret += int2char(v >> 2);
      slop = v & 3;
      k = 1;
    } else if (k == 1) {
      ret += int2char((slop << 2) | (v >> 4));
      slop = v & 0xf;
      k = 2;
    } else if (k == 2) {
      ret += int2char(slop);
      ret += int2char(v >> 2);
      slop = v & 3;
      k = 3;
    } else {
      ret += int2char((slop << 2) | (v >> 4));
      ret += int2char(v & 0xf);
      k = 0;
    }
  }
  if (k == 1) ret += int2char(slop << 2);
  return ret;
}

function publicKeyFromString(string) {
  var N = b64to16(string.split("|")[0]);
  var E = "03";
  var rsa = new RSAKey();
  rsa.setPublic(N, E);
  return rsa;
}

function int2char(int) {
  return "0123456789abcdefghijklmnopqrstuvwxyz".charAt(int);
}
