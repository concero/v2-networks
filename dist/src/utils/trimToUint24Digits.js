"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimToUint24Digits = trimToUint24Digits;
function trimToUint24Digits(x) {
    const MAX = 0xffffff; // 16777215
    // if (!Number.isFinite(x)) throw new TypeError('x must be a finite number');
    const sign = x < 0 ? -1 : 1;
    let n = Math.trunc(Math.abs(x));
    while (n > MAX)
        n = Math.trunc(n / 10);
    return sign * n;
}
