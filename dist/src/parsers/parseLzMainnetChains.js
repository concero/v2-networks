"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLzMainnetChains = parseLzMainnetChains;
const trimToUint24Digits_1 = require("../utils/trimToUint24Digits");
const fetchChainListChains_1 = require("../resources/fetchChainListChains");
const readConceroChains_1 = require("../resources/readConceroChains");
const normalizeName_1 = require("../utils/normalizeName");
const writeConceroChains_1 = require("../resources/writeConceroChains");
const mainnetChainsFilePath = __dirname + '/../networks/mainnet.json';
const blackList = ['solana', 'tron', 'fantom'];
async function parseLzMainnetChains() {
    const [lzChainsResponse, chainlistChains] = await Promise.all([
        fetch('https://docs.layerzero.network/data/deploymentsV2.json'),
        (0, fetchChainListChains_1.fetchChainListChains)(),
    ]);
    const [lzChains] = await Promise.all([
        lzChainsResponse.json(),
    ]);
    const conceroChains = (0, readConceroChains_1.readConceroChains)('mainnet');
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
        const chainName = (0, normalizeName_1.normalizeName)(lzChain.chainKey);
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
    (0, writeConceroChains_1.writeConceroChains)({
        ...conceroChains,
        ...chainsToPast,
    }, 'mainnet');
}
parseLzMainnetChains();
