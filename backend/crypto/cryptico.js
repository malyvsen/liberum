const seedrandom = require("seedrandom");
import BigInteger, { int2char } from "./jsbn.js";

/**
 *
 *  Secure Hash Algorithm (SHA256)
 *  http://www.webtoolkit.info/
 *
 *  Original code by Angel Marin, Paul Johnston.
 *
 **/

function SHA256(s) {
  var chrsz = 8;
  var hexcase = 0;

  function safe_add(x, y) {
    var lsw = (x & 0xffff) + (y & 0xffff);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }

  function S(X, n) {
    return (X >>> n) | (X << (32 - n));
  }
  function R(X, n) {
    return X >>> n;
  }
  function Ch(x, y, z) {
    return (x & y) ^ (~x & z);
  }
  function Maj(x, y, z) {
    return (x & y) ^ (x & z) ^ (y & z);
  }
  function Sigma0256(x) {
    return S(x, 2) ^ S(x, 13) ^ S(x, 22);
  }
  function Sigma1256(x) {
    return S(x, 6) ^ S(x, 11) ^ S(x, 25);
  }
  function Gamma0256(x) {
    return S(x, 7) ^ S(x, 18) ^ R(x, 3);
  }
  function Gamma1256(x) {
    return S(x, 17) ^ S(x, 19) ^ R(x, 10);
  }

  function core_sha256(m, l) {
    var K = new Array(
      0x428a2f98,
      0x71374491,
      0xb5c0fbcf,
      0xe9b5dba5,
      0x3956c25b,
      0x59f111f1,
      0x923f82a4,
      0xab1c5ed5,
      0xd807aa98,
      0x12835b01,
      0x243185be,
      0x550c7dc3,
      0x72be5d74,
      0x80deb1fe,
      0x9bdc06a7,
      0xc19bf174,
      0xe49b69c1,
      0xefbe4786,
      0xfc19dc6,
      0x240ca1cc,
      0x2de92c6f,
      0x4a7484aa,
      0x5cb0a9dc,
      0x76f988da,
      0x983e5152,
      0xa831c66d,
      0xb00327c8,
      0xbf597fc7,
      0xc6e00bf3,
      0xd5a79147,
      0x6ca6351,
      0x14292967,
      0x27b70a85,
      0x2e1b2138,
      0x4d2c6dfc,
      0x53380d13,
      0x650a7354,
      0x766a0abb,
      0x81c2c92e,
      0x92722c85,
      0xa2bfe8a1,
      0xa81a664b,
      0xc24b8b70,
      0xc76c51a3,
      0xd192e819,
      0xd6990624,
      0xf40e3585,
      0x106aa070,
      0x19a4c116,
      0x1e376c08,
      0x2748774c,
      0x34b0bcb5,
      0x391c0cb3,
      0x4ed8aa4a,
      0x5b9cca4f,
      0x682e6ff3,
      0x748f82ee,
      0x78a5636f,
      0x84c87814,
      0x8cc70208,
      0x90befffa,
      0xa4506ceb,
      0xbef9a3f7,
      0xc67178f2
    );
    var HASH = new Array(
      0x6a09e667,
      0xbb67ae85,
      0x3c6ef372,
      0xa54ff53a,
      0x510e527f,
      0x9b05688c,
      0x1f83d9ab,
      0x5be0cd19
    );
    var W = new Array(64);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;

    m[l >> 5] |= 0x80 << (24 - (l % 32));
    m[(((l + 64) >> 9) << 4) + 15] = l;

    for (var i = 0; i < m.length; i += 16) {
      a = HASH[0];
      b = HASH[1];
      c = HASH[2];
      d = HASH[3];
      e = HASH[4];
      f = HASH[5];
      g = HASH[6];
      h = HASH[7];

      for (var j = 0; j < 64; j++) {
        if (j < 16) W[j] = m[j + i];
        else
          W[j] = safe_add(
            safe_add(
              safe_add(Gamma1256(W[j - 2]), W[j - 7]),
              Gamma0256(W[j - 15])
            ),
            W[j - 16]
          );

        T1 = safe_add(
          safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]),
          W[j]
        );
        T2 = safe_add(Sigma0256(a), Maj(a, b, c));

        h = g;
        g = f;
        f = e;
        e = safe_add(d, T1);
        d = c;
        c = b;
        b = a;
        a = safe_add(T1, T2);
      }

      HASH[0] = safe_add(a, HASH[0]);
      HASH[1] = safe_add(b, HASH[1]);
      HASH[2] = safe_add(c, HASH[2]);
      HASH[3] = safe_add(d, HASH[3]);
      HASH[4] = safe_add(e, HASH[4]);
      HASH[5] = safe_add(f, HASH[5]);
      HASH[6] = safe_add(g, HASH[6]);
      HASH[7] = safe_add(h, HASH[7]);
    }
    return HASH;
  }

  function str2binb(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz) {
      bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - (i % 32));
    }
    return bin;
  }

  function Utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }

    return utftext;
  }

  function binb2hex(binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
      str +=
        hex_tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8 + 4)) & 0xf) +
        hex_tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8)) & 0xf);
    }
    return str;
  }

  s = Utf8Encode(s);
  return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
}

var sha256 = {};
sha256.hex = function(s) {
  return SHA256(s);
};

/**
 *
 *  Secure Hash Algorithm (SHA1)
 *  http://www.webtoolkit.info/
 *
 **/

function SHA1(msg) {
  function rotate_left(n, s) {
    var t4 = (n << s) | (n >>> (32 - s));
    return t4;
  }

  function lsb_hex(val) {
    var str = "";
    var i;
    var vh;
    var vl;

    for (i = 0; i <= 6; i += 2) {
      vh = (val >>> (i * 4 + 4)) & 0x0f;
      vl = (val >>> (i * 4)) & 0x0f;
      str += vh.toString(16) + vl.toString(16);
    }
    return str;
  }

  function cvt_hex(val) {
    var str = "";
    var i;
    var v;

    for (i = 7; i >= 0; i--) {
      v = (val >>> (i * 4)) & 0x0f;
      str += v.toString(16);
    }
    return str;
  }

  function Utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }

    return utftext;
  }

  var blockstart;
  var i, j;
  var W = new Array(80);
  var H0 = 0x67452301;
  var H1 = 0xefcdab89;
  var H2 = 0x98badcfe;
  var H3 = 0x10325476;
  var H4 = 0xc3d2e1f0;
  var A, B, C, D, E;
  var temp;

  msg = Utf8Encode(msg);

  var msg_len = msg.length;

  var word_array = new Array();
  for (i = 0; i < msg_len - 3; i += 4) {
    j =
      (msg.charCodeAt(i) << 24) |
      (msg.charCodeAt(i + 1) << 16) |
      (msg.charCodeAt(i + 2) << 8) |
      msg.charCodeAt(i + 3);
    word_array.push(j);
  }

  switch (msg_len % 4) {
    case 0:
      i = 0x080000000;
      break;
    case 1:
      i = (msg.charCodeAt(msg_len - 1) << 24) | 0x0800000;
      break;

    case 2:
      i =
        (msg.charCodeAt(msg_len - 2) << 24) |
        (msg.charCodeAt(msg_len - 1) << 16) |
        0x08000;
      break;

    case 3:
      i =
        (msg.charCodeAt(msg_len - 3) << 24) |
        (msg.charCodeAt(msg_len - 2) << 16) |
        (msg.charCodeAt(msg_len - 1) << 8) |
        0x80;
      break;
  }

  word_array.push(i);

  while (word_array.length % 16 != 14) word_array.push(0);

  word_array.push(msg_len >>> 29);
  word_array.push((msg_len << 3) & 0x0ffffffff);

  for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
    for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
    for (i = 16; i <= 79; i++)
      W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

    A = H0;
    B = H1;
    C = H2;
    D = H3;
    E = H4;

    for (i = 0; i <= 19; i++) {
      temp =
        (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5a827999) &
        0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    for (i = 20; i <= 39; i++) {
      temp =
        (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ed9eba1) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    for (i = 40; i <= 59; i++) {
      temp =
        (rotate_left(A, 5) +
          ((B & C) | (B & D) | (C & D)) +
          E +
          W[i] +
          0x8f1bbcdc) &
        0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    for (i = 60; i <= 79; i++) {
      temp =
        (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xca62c1d6) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    H0 = (H0 + A) & 0x0ffffffff;
    H1 = (H1 + B) & 0x0ffffffff;
    H2 = (H2 + C) & 0x0ffffffff;
    H3 = (H3 + D) & 0x0ffffffff;
    H4 = (H4 + E) & 0x0ffffffff;
  }

  var temp =
    cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

  return temp.toLowerCase();
}

var sha1 = {};
sha1.hex = function(s) {
  return SHA1(s);
};

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
  var sHashHex = sha256.hex(s);

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

function _rsasign_signString(s, hashAlg) {
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
  var msgHashValue = sha256.hex(sMsg);
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
