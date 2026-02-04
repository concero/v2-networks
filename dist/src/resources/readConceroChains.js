"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readConceroChains = readConceroChains;
const node_fs_1 = __importDefault(require("node:fs"));
function readConceroChains(type) {
    const chainsFilePath = __dirname + `/../../networks/${type}.json`;
    return JSON.parse(node_fs_1.default.readFileSync(chainsFilePath, 'utf-8'));
}
