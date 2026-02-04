"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeConceroChains = writeConceroChains;
const node_fs_1 = __importDefault(require("node:fs"));
function writeConceroChains(chains, type) {
    const chainsFilePath = __dirname + `/../../networks/${type}.json`;
    node_fs_1.default.writeFileSync(chainsFilePath, JSON.stringify(chains, null, 2));
}
