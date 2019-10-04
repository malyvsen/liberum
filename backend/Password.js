const seedrandom = require("seedrandom");
import { positiveMod } from "./Utils";

export function random(seed) {
  const rng = seedrandom(seed).int32;
  var result = "";
  for (var i = 0; i < length; i++) {
    result += alphabet[positiveMod(rng(), alphabet.length)];
  }
  return result;
}

export function isValid(password) {
  return (
    password.split("").every(letter => alphabet.includes(letter)) &&
    password.length == length
  );
}

export const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
export const length = 7; // 36 ^ 7 = 78,364,164,096 combinations
