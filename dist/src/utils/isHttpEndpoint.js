"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHttpEndpoint = isHttpEndpoint;
function isHttpEndpoint(url) {
    return url.startsWith('http://') || url.startsWith('https://');
}
