const seedrandom = require("seedrandom");
import BigInteger, { int2char } from "./jsbn.js";
import RSAKey from "./rsa_sign.js";

// Adapted for use in last-id from https://github.com/wwwtyro/cryptico
// Cryptico could not be used as is because of security and dependency issues

export default {
  sign: function(plaintext, key) {
    return b16to64(key.signString(plaintext));
  },

  verify: function(plaintext, signature, publicKeyString) {
    const publicKey = publicKeyFromString(publicKeyString);
    const signature16 = b64to16(signature);
    return publicKey.verifyString(plaintext, signature16);
  },

  generateRSAKey: function(password, bitLength) {
    const rng = seedrandom.alea(password);
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

function b256to64(t) {
  var a, c, n;
  var r = "",
    l = 0,
    s = 0;
  var tl = t.length;
  for (n = 0; n < tl; n++) {
    c = t.charCodeAt(n);
    if (s == 0) {
      r += base64Chars.charAt((c >> 2) & 63);
      a = (c & 3) << 4;
    } else if (s == 1) {
      r += base64Chars.charAt(a | ((c >> 4) & 15));
      a = (c & 15) << 2;
    } else if (s == 2) {
      r += base64Chars.charAt(a | ((c >> 6) & 3));
      l += 1;
      r += base64Chars.charAt(c & 63);
    }
    l += 1;
    s += 1;
    if (s == 3) s = 0;
  }
  if (s > 0) {
    r += base64Chars.charAt(a);
    l += 1;
    r += "=";
    l += 1;
  }
  if (s == 1) {
    r += "=";
  }
  return r;
}

function b64to256(t) {
  var c, n;
  var r = "",
    s = 0,
    a = 0;
  var tl = t.length;
  for (n = 0; n < tl; n++) {
    c = base64Chars.indexOf(t.charAt(n));
    if (c >= 0) {
      if (s) r += String.fromCharCode(a | ((c >> (6 - s)) & 255));
      s = (s + 2) & 7;
      a = (c << s) & 255;
    }
  }
  return r;
}

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

// Converts a string to a byte array.
function string2bytes(string) {
  var bytes = new Array();
  for (var i = 0; i < string.length; i++) {
    bytes.push(string.charCodeAt(i));
  }
  return bytes;
}

// Converts a byte array to a string.
function bytes2string(bytes) {
  var string = "";
  for (var i = 0; i < bytes.length; i++) {
    string += String.fromCharCode(bytes[i]);
  }
  return string;
}

// Returns a XOR b, where a and b are 16-byte byte arrays.
function blockXOR(a, b) {
  var xor = new Array(16);
  for (var i = 0; i < 16; i++) {
    xor[i] = a[i] ^ b[i];
  }
  return xor;
}

// Returns a copy of bytes with zeros appended to the end
// so that the (length of bytes) % 16 == 0.
function pad16(bytes) {
  var newBytes = bytes.slice(0);
  var padding = (16 - (bytes.length % 16)) % 16;
  for (i = bytes.length; i < bytes.length + padding; i++) {
    newBytes.push(0);
  }
  return newBytes;
}

// Removes trailing zeros from a byte array.
function depad(bytes) {
  var newBytes = bytes.slice(0);
  while (newBytes[newBytes.length - 1] == 0) {
    newBytes = newBytes.slice(0, newBytes.length - 1);
  }
  return newBytes;
}

// Wraps a string to 60 characters.
function wrap60(string) {
  var outstr = "";
  for (var i = 0; i < string.length; i++) {
    if (i % 60 == 0 && i != 0) outstr += "\n";
    outstr += string[i];
  }
  return outstr;
}

function publicKeyFromString(string) {
  var N = b64to16(string.split("|")[0]);
  var E = "03";
  var rsa = new RSAKey();
  rsa.setPublic(N, E);
  return rsa;
}
