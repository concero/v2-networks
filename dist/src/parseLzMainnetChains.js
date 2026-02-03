"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLzMainnetChains = parseLzMainnetChains;
const fs = __importStar(require("node:fs"));
const trimToUint24Digits_1 = require("./utils/trimToUint24Digits");
const mainnetChainsFilePath = __dirname + '/../networks/mainnet.json';
const blackList = ['solana', 'tron', 'fantom'];
async function parseLzMainnetChains() {
    const [lzChainsResponse, chainlistChainsResponse] = await Promise.all([
        fetch('https://docs.layerzero.network/data/deploymentsV2.json'),
        fetch('https://chainlist.org/rpcs.json'),
    ]);
    const [lzChains, chainlistChains] = await Promise.all([
        lzChainsResponse.json(),
        chainlistChainsResponse.json(),
    ]);
    const conceroChains = JSON.parse(fs.readFileSync(mainnetChainsFilePath, 'utf-8'));
    const chainsToPast = {};
    for (const lzChain of lzChains) {
        if (lzChain.stage !== 'mainnet')
            continue;
        const conceroChainIntegrated = Object.values(conceroChains).find((c) => c.chainId === lzChain.nativeChainId);
        if (conceroChainIntegrated)
            continue;
        const chainlistInfo = chainlistChains.find((c) => c.chainId === lzChain.nativeChainId);
        if (!chainlistInfo || chainlistInfo?.isTestnet)
            continue;
        const chainName = lzChain.chainKey
            .split('-')
            .filter(Boolean)
            .map((part, i) => i === 0 ? part : part[0].toUpperCase() + part.slice(1))
            .join('');
        if (blackList.includes(chainName) || conceroChains[chainName])
            continue;
        chainsToPast[chainName] = {
            name: chainName,
            chainId: lzChain.nativeChainId,
            chainSelector: (0, trimToUint24Digits_1.trimToUint24Digits)(lzChain.nativeChainId),
            rpcs: [],
            blockExplorers: chainlistInfo?.explorers,
            faucets: [],
            nativeCurrency: chainlistInfo?.nativeCurrency,
        };
    }
    fs.writeFileSync(mainnetChainsFilePath, JSON.stringify({
        ...conceroChains,
        ...chainsToPast,
    }, null, 2));
}
parseLzMainnetChains();
