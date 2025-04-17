"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testnetNetworks = exports.mainnetNetworks = exports.testnetSummary = exports.mainnetSummary = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mainnet_json_1 = __importDefault(require("./networks/mainnet.json"));
exports.mainnetSummary = mainnet_json_1.default;
const testnet_json_1 = __importDefault(require("./networks/testnet.json"));
exports.testnetSummary = testnet_json_1.default;
function loadNetworkConfigs(directoryPath) {
    const networks = {};
    try {
        const fullPath = path_1.default.resolve(__dirname, directoryPath);
        if (fs_1.default.existsSync(fullPath)) {
            const files = fs_1.default.readdirSync(fullPath);
            files.forEach((file) => {
                if (file.endsWith('.json')) {
                    const networkName = path_1.default.basename(file, '.json');
                    const networkConfig = require(path_1.default.join(fullPath, file));
                    networks[networkName] = networkConfig;
                }
            });
        }
    }
    catch (error) {
        console.error(`Error loading network configurations from ${directoryPath}:`, error);
    }
    return networks;
}
const mainnetNetworks = loadNetworkConfigs('./networks/mainnet');
exports.mainnetNetworks = mainnetNetworks;
const testnetNetworks = loadNetworkConfigs('./networks/testnet');
exports.testnetNetworks = testnetNetworks;
