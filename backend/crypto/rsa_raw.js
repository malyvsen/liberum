// Adapted for use in last-id from https://github.com/wwwtyro/cryptico
// Original comment follows

// Depends on jsbn.js and rng.js
// Version 1.1: support utf-8 encoding in pkcs1pad2 (which has been deleted in last-id)
// convert a (hex) string to a bignum object

import BigInteger from "./jsbn.js";

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
    this.n = new BigInteger(N, 16);
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
    this.n = new BigInteger(N, 16);
    this.e = parseInt(E, 16);
    this.d = new BigInteger(D, 16);
  } else alert("Invalid RSA private key");
}

// Set the private key fields N, e, d and CRT params from hex strings
function RSASetPrivateEx(N, E, D, P, Q, DP, DQ, C) {
  if (N != null && E != null && N.length > 0 && E.length > 0) {
    this.n = new BigInteger(N, 16);
    this.e = parseInt(E, 16);
    this.d = new BigInteger(D, 16);
    this.p = new BigInteger(P, 16);
    this.q = new BigInteger(Q, 16);
    this.dmp1 = new BigInteger(DP, 16);
    this.dmq1 = new BigInteger(DQ, 16);
    this.coeff = new BigInteger(C, 16);
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
