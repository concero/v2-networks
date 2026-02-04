"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeName = normalizeName;
function normalizeName(name) {
    return name
        .toLowerCase()
        .split('-')
        .filter(Boolean)
        .map((part, i) => i === 0 ? part : part[0].toUpperCase() + part.slice(1))
        .join('');
}
