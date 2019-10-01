// Adapted for use in last-id from https://github.com/wwwtyro/cryptico
// Original comment follows

// Depends on jsbn.js and rng.js
// Version 1.1: support utf-8 encoding in pkcs1pad2 (which has been deleted in last-id)
// convert a (hex) string to a bignum object

const bigInt = require("big-integer");

// "empty" RSA key constructor
export default function RSAKey() {
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
    this.n = bigInt(N, 16);
    this.e = parseInt(E, 16);
  } else alert("Invalid RSA public key");
}

// Perform raw public operation on "x": return x^e (mod n)

function RSADoPublic(x) {
  return x.modPow(this.e, this.n);
}

// protected
RSAKey.prototype.doPublic = RSADoPublic;

// public
RSAKey.prototype.setPublic = RSASetPublic;

// Set the private key fields N, e, and d from hex strings
function RSASetPrivate(N, E, D) {
  if (N != null && E != null && N.length > 0 && E.length > 0) {
    this.n = bigInt(N, 16);
    this.e = parseInt(E, 16);
    this.d = bigInt(D, 16);
  } else alert("Invalid RSA private key");
}

// Set the private key fields N, e, d and CRT params from hex strings
function RSASetPrivateEx(N, E, D, P, Q, DP, DQ, C) {
  if (N != null && E != null && N.length > 0 && E.length > 0) {
    this.n = bigInt(N, 16);
    this.e = parseInt(E, 16);
    this.d = bigInt(D, 16);
    this.p = bigInt(P, 16);
    this.q = bigInt(Q, 16);
    this.dmp1 = bigInt(DP, 16);
    this.dmq1 = bigInt(DQ, 16);
    this.coeff = bigInt(C, 16);
  } else alert("Invalid RSA private key");
}

// Generate a new random private key B bits long, using public expt E
function RSAGenerate(B, E, rng) {
  const qs = B >> 1;
  const maxQ = bigInt(2)
    .pow(qs)
    .subtract(bigInt.one);
  const maxP = bigInt(2)
    .pow(B - qs)
    .subtract(bigInt.one);
  this.e = parseInt(E, 16);
  var exponentBigInt = bigInt(this.e);
  for (;;) {
    this.p = guessRelativePrime(exponentBigInt, maxP, rng);
    this.q = guessRelativePrime(exponentBigInt, maxQ, rng);
    if (this.p.compareTo(this.q) <= 0) {
      var t = this.p;
      this.p = this.q;
      this.q = t;
    }
    var p1 = this.p.subtract(bigInt.one);
    var q1 = this.q.subtract(bigInt.one);
    var phi = p1.multiply(q1);
    if (bigInt.gcd(phi, exponentBigInt).compareTo(bigInt.one) == 0) {
      this.n = this.p.multiply(this.q);
      this.d = exponentBigInt.modInv(phi);
      this.dmp1 = this.d.mod(p1);
      this.dmq1 = this.d.mod(q1);
      this.coeff = this.q.modInv(this.p);
      break;
    }
  }
}

function guessRelativePrime(relativeTo, maxValue, rng) {
  for (;;) {
    var result = primify(bigInt.randBetween(0, maxValue, rng));
    if (
      bigInt
        .gcd(result.subtract(bigInt.one), relativeTo)
        .compareTo(bigInt.one) == 0 &&
      result.isProbablePrime(10, rng)
    )
      return result;
  }
}

// makes a bigInt not divisible by 2 or 3
// if the bigInt was to be rejected when divisible by 2 or 3, as is the case with guessRelativePrime,
// primify does not affect the distribution from which bigInts are sampled - only speeds up sampling
// see relevant proof on wiki
function primify(value) {
  const masks = [1, 0, 3, 2, 7, 0];
  return value.xor(masks[value.mod(6)]);
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
