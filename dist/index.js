"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testnetNetworks = exports.mainnetNetworks = void 0;
const mainnet_json_1 = __importDefault(require("./networks/mainnet.json"));
exports.mainnetNetworks = mainnet_json_1.default;
const testnet_json_1 = __importDefault(require("./networks/testnet.json"));
exports.testnetNetworks = testnet_json_1.default;
