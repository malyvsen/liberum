const seedrandom = require("seedrandom");
const sha256 = require("js-sha256").sha256;
import BigInteger, { int2char } from "./jsbn.js";

// Depends on jsbn.js and rng.js
// Version 1.1: support utf-8 encoding in pkcs1pad2 (which has been deleted in last-id)
// convert a (hex) string to a bignum object

function parseBigInt(str, r) {
  return new BigInteger(str, r);
}

function linebrk(s, n) {
  var ret = "";
  var i = 0;
  while (i + n < s.length) {
    ret += s.substring(i, i + n) + "\n";
    i += n;
  }
  return ret + s.substring(i, s.length);
}

function byte2Hex(b) {
  if (b < 0x10) return "0" + b.toString(16);
  else return b.toString(16);
}

// "empty" RSA key constructor
function RSAKey() {
  this.n = null;
  this.e = 0;
  this.d = null;
  this.p = null;
  this.q = null;
  this.dmp1 = null;
  this.dmq1 = null;
  this.coeff = null;
}

// Set the public key fields N and e from hex strings
function RSASetPublic(N, E) {
  if (N != null && E != null && N.length > 0 && E.length > 0) {
    this.n = parseBigInt(N, 16);
    this.e = parseInt(E, 16);
  } else alert("Invalid RSA public key");
}

// Perform raw public operation on "x": return x^e (mod n)

function RSADoPublic(x) {
  return x.modPowInt(this.e, this.n);
}

// protected
RSAKey.prototype.doPublic = RSADoPublic;

// public
RSAKey.prototype.setPublic = RSASetPublic;

// Set the private key fields N, e, and d from hex strings
function RSASetPrivate(N, E, D) {
  if (N != null && E != null && N.length > 0 && E.length > 0) {
    this.n = parseBigInt(N, 16);
    this.e = parseInt(E, 16);
    this.d = parseBigInt(D, 16);
  } else alert("Invalid RSA private key");
}

// Set the private key fields N, e, d and CRT params from hex strings
function RSASetPrivateEx(N, E, D, P, Q, DP, DQ, C) {
  if (N != null && E != null && N.length > 0 && E.length > 0) {
    this.n = parseBigInt(N, 16);
    this.e = parseInt(E, 16);
    this.d = parseBigInt(D, 16);
    this.p = parseBigInt(P, 16);
    this.q = parseBigInt(Q, 16);
    this.dmp1 = parseBigInt(DP, 16);
    this.dmq1 = parseBigInt(DQ, 16);
    this.coeff = parseBigInt(C, 16);
  } else alert("Invalid RSA private key");
}

// Generate a new random private key B bits long, using public expt E
function RSAGenerate(B, E, rng) {
  var qs = B >> 1;
  this.e = parseInt(E, 16);
  var ee = new BigInteger(E, 16);
  for (;;) {
    for (;;) {
      this.p = new BigInteger(B - qs, 1, rng);
      if (
        this.p
          .subtract(BigInteger.ONE)
          .gcd(ee)
          .compareTo(BigInteger.ONE) == 0 &&
        this.p.isProbablePrime(10, rng)
      )
        break;
    }
    for (;;) {
      this.q = new BigInteger(qs, 1, rng);
      if (
        this.q
          .subtract(BigInteger.ONE)
          .gcd(ee)
          .compareTo(BigInteger.ONE) == 0 &&
        this.q.isProbablePrime(10, rng)
      )
        break;
    }
    if (this.p.compareTo(this.q) <= 0) {
      var t = this.p;
      this.p = this.q;
      this.q = t;
    }
    var p1 = this.p.subtract(BigInteger.ONE);
    var q1 = this.q.subtract(BigInteger.ONE);
    var phi = p1.multiply(q1);
    if (phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
      this.n = this.p.multiply(this.q);
      this.d = ee.modInverse(phi);
      this.dmp1 = this.d.mod(p1);
      this.dmq1 = this.d.mod(q1);
      this.coeff = this.q.modInverse(this.p);
      break;
    }
  }
}

// Perform raw private operation on "x": return x^d (mod n)
function RSADoPrivate(x) {
  if (this.p == null || this.q == null) return x.modPow(this.d, this.n);
  // TODO: re-calculate any missing CRT params
  var xp = x.mod(this.p).modPow(this.dmp1, this.p);
  var xq = x.mod(this.q).modPow(this.dmq1, this.q);
  while (xp.compareTo(xq) < 0) xp = xp.add(this.p);
  return xp
    .subtract(xq)
    .multiply(this.coeff)
    .mod(this.p)
    .multiply(this.q)
    .add(xq);
}

// protected
RSAKey.prototype.doPrivate = RSADoPrivate;

// public
RSAKey.prototype.setPrivate = RSASetPrivate;
RSAKey.prototype.setPrivateEx = RSASetPrivateEx;
RSAKey.prototype.generate = RSAGenerate;

//
// rsa-sign.js - adding signing functions to RSAKey class.
//
//
// version: 1.0 (2010-Jun-03)
//
// Copyright (c) 2010 Kenji Urushima (kenji.urushima@gmail.com)
//
// This software is licensed under the terms of the MIT License.
// http://www.opensource.org/licenses/mit-license.php
//
// The above copyright and license notice shall be
// included in all copies or substantial portions of the Software.
//
// Depends on:
//   function sha1.hex(s) of sha1.js
//   jsbn.js
//   jsbn2.js
//   rsa.js
//   rsa2.js
//
// keysize / pmstrlen
//  512 /  128
// 1024 /  256
// 2048 /  512
// 4096 / 1024
const _RSASIGN_DIHEAD = "3031300d060960864801650304020105000420";

// ========================================================================
// Signature Generation
// ========================================================================

function _rsasign_getHexPaddedDigestInfoForString(s, keySize) {
  var pmStrLen = keySize / 4;
  var sHashHex = sha256(s);

  var sHead = "0001";
  var sTail = "00" + _RSASIGN_DIHEAD + sHashHex;
  var sMid = "";
  var fLen = pmStrLen - sHead.length - sTail.length;
  for (var i = 0; i < fLen; i += 2) {
    sMid += "ff";
  }
  sPaddedMessageHex = sHead + sMid + sTail;
  return sPaddedMessageHex;
}

function _rsasign_signString(s) {
  var hPM = _rsasign_getHexPaddedDigestInfoForString(s, this.n.bitLength());
  var biPaddedMessage = parseBigInt(hPM, 16);
  var biSign = this.doPrivate(biPaddedMessage);
  var hexSign = biSign.toString(16);
  return hexSign;
}

// ========================================================================
// Signature Verification
// ========================================================================

function _rsasign_getHashFromHexDisgestInfo(hDigestInfo) {
  var len = _RSASIGN_DIHEAD.length;
  return hDigestInfo.substring(len);
}

function _rsasign_verifyString(sMsg, hSig) {
  hSig = hSig.replace(/[ \n]+/g, "");
  var biSig = parseBigInt(hSig, 16);
  var biDecryptedSig = this.doPublic(biSig);
  var hDigestInfo = biDecryptedSig.toString(16).replace(/^1f+00/, "");
  var diHashValue = _rsasign_getHashFromHexDisgestInfo(hDigestInfo);
  var msgHashValue = sha256(sMsg);
  return diHashValue == msgHashValue;
}

RSAKey.prototype.signString = _rsasign_signString;
RSAKey.prototype.verifyString = _rsasign_verifyString;

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
