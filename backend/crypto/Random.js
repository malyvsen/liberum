const seedrandom = require("seedrandom");

export function float32(seed) {
  return seedrandom(seed).quick;
}

export function int32(seed) {
  return seedrandom(seed).int32;
}
