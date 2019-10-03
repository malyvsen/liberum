// Adapted for use in last-id from:
// https://en.wikipedia.org/wiki/RSA_(cryptosystem)#Code
// https://github.com/wwwtyro/cryptico
// Original comment follows

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

const bigInt = require("big-integer");
const sha256 = require("js-sha256").sha256;

export default class RSAKey {
  constructor(mod, privateExp = null) {
    this.mod = bigInt(mod);
    this.privateExp = bigInt(privateExp);
  }

  /**
   * Generates a k-bit RSA public/private key pair
   *
   * @param   {bitLength} int, bit length of desired public key (should be even)
   * @param   {rng} function, used for generating randomness - should return values between 0 and 1
   * @returns {RSAKey} generated RSA key
   */
  static generate(bitLength, rng) {
    let p;
    let q;
    let lambda;

    // generate p and q such that lcm(p − 1, q − 1) is coprime with publicExponent and |p-q| >= 2^(keysize/2 - 100)
    do {
      p = randomPrime(bitLength / 2, rng);
      q = randomPrime(bitLength / 2, rng);
      lambda = bigInt.lcm(p.minus(1), q.minus(1));
    } while (
      bigInt.gcd(publicExp, lambda).notEquals(1) ||
      p
        .minus(q)
        .abs()
        .shiftRight(bitLength / 2 - 100)
        .isZero()
    );

    return new RSAKey(p.multiply(q), publicExp.modInv(lambda));
  }

  /**
   * Encrypt
   *
   * @param   {message} bigInt, message to be encrypted
   * @returns {bigInt} encrypted message
   */
  encrypt(message) {
    return message.modPow(publicExp, this.mod);
  }

  /**
   * Decrypt
   *
   * @param   {message} bigInt, message to be decrypted
   * @returns {bigInt} decrypted message
   */
  decrypt(message) {
    return message.modPow(this.privateExp, this.mod);
  }

  sign(s) {
    var hexPadded = getHexPaddedDigestInfoForString(s, this.mod.bitLength());
    return this.decrypt(bigInt(hexPadded, 16)).toString(16);
  }

  verify(sMsg, hSig) {
    hSig = hSig.replace(/[ \n]+/g, "");
    var biSig = bigInt(hSig, 16);
    var biDecryptedSig = this.encrypt(biSig);
    var hDigestInfo = biDecryptedSig.toString(16).replace(/^1f+00/, "");
    var diHashValue = hDigestInfo.substring(_RSASIGN_DIHEAD.length);
    var msgHashValue = sha256(sMsg);
    return diHashValue == msgHashValue;
  }
}

const publicExp = bigInt(65537);
const _RSASIGN_DIHEAD = "3031300d060960864801650304020105000420";

function getHexPaddedDigestInfoForString(s, keySize) {
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

function randomPrime(bitLength, rng) {
  const min = bigInt(6074001000).shiftLeft(bitLength - 33); // min = sqrt(2) * 2^(bitLength - 1)
  const max = bigInt.one.shiftLeft(bitLength).minus(1); // max = 2^(bitLength) - 1
  for (;;) {
    const result = primify(bigInt.randBetween(min, max, rng));
    if (result.isProbablePrime(10, rng)) {
      return result;
    }
  }
}

// makes a bigInt not divisible by 2 or 3
// security/statistics concerns? see relevant proof on wiki
function primify(value) {
  const masks = [1, 0, 3, 2, 1, 0];
  return value.xor(masks[value.mod(6)]);
}
