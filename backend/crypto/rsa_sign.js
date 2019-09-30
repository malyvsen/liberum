// Adapted for use in last-id from https://github.com/wwwtyro/cryptico
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

const sha256 = require("js-sha256").sha256;
const bigInt = require("big-integer");
import RSAKey from "./rsa_raw.js";

export default RSAKey;

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
  var biPaddedMessage = bigInt(hPM, 16);
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
  var biSig = bigInt(hSig, 16);
  var biDecryptedSig = this.doPublic(biSig);
  var hDigestInfo = biDecryptedSig.toString(16).replace(/^1f+00/, "");
  var diHashValue = _rsasign_getHashFromHexDisgestInfo(hDigestInfo);
  var msgHashValue = sha256(sMsg);
  return diHashValue == msgHashValue;
}

RSAKey.prototype.signString = _rsasign_signString;
RSAKey.prototype.verifyString = _rsasign_verifyString;
