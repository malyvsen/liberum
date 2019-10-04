export const isProduction = false;
export const hashDifficulty = isProduction ? 2 ** 24 : 2 ** 16;
export const keyLength = isProduction ? 2048 : 512;
