// Adapted for use in last-id from:
// https://en.wikipedia.org/wiki/RSA_(cryptosystem)#Code
// https://github.com/wwwtyro/cryptico
// Cryptico could not be used as is because of security and dependency issues
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
import * as Hash from "./Hash";
import * as Random from "./Random";

export default class RSAKey {
  constructor(mod, privateExp = null) {
    this.mod = bigInt(mod);
    this.privateExp = bigInt(privateExp);
  }

  static fromSeed(bitLength, seed) {
    const rng = Random.float32(seed); // 32 bits is enough - BigInteger.js internally uses base 10^7
    return RSAKey.fromRNG(bitLength, rng);
  }

  static fromRNG(bitLength, rng) {
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

  static publicFromString(string) {
    return new RSAKey(bigInt(string, 16));
  }

  publicToString() {
    return this.mod.toString(16);
  }

  sign(plaintext) {
    return decryptHex(Hash.fast(plaintext), this.mod, this.privateExp);
  }

  verify(plaintext, signature) {
    return encryptHex(signature, this.mod) == Hash.fast(plaintext);
  }
}

const publicExp = bigInt(65537);

function encryptHex(hexString, mod) {
  return bigInt(hexString, 16)
    .modPow(publicExp, mod)
    .toString(16);
}

function decryptHex(hexString, mod, privateExp) {
  return bigInt(hexString, 16)
    .modPow(privateExp, mod)
    .toString(16);
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
