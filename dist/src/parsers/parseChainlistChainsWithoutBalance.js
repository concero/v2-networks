"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetchChainListChains_1 = require("../resources/fetchChainListChains");
const readConceroChains_1 = require("../resources/readConceroChains");
const viem_1 = require("viem");
const trimToUint24Digits_1 = require("../utils/trimToUint24Digits");
const normalizeName_1 = require("../utils/normalizeName");
const node_fs_1 = __importDefault(require("node:fs"));
const isHttpEndpoint_1 = require("../utils/isHttpEndpoint");
const constants_1 = require("../constants");
async function parseChainlistChainsWithoutBalance() {
    const chainListChains = await (0, fetchChainListChains_1.fetchChainListChains)();
    const conceroChains = (0, readConceroChains_1.readConceroChains)('mainnet');
    const promises = [];
    for (const chainListChain of chainListChains) {
        if (chainListChain.isTestnet ||
            chainListChain?.status === 'incubating') {
            continue;
        }
        const httpRpcs = chainListChain.rpc.filter((r) => r.url && (0, isHttpEndpoint_1.isHttpEndpoint)(r.url));
        if (!httpRpcs?.length)
            continue;
        // TODO: move to contract-utils publicClient
        const publicClient = (0, viem_1.createPublicClient)({
            transport: (0, viem_1.fallback)(chainListChain.rpc.reduce((acc, r) => {
                if (r.url && (0, isHttpEndpoint_1.isHttpEndpoint)(r.url)) {
                    acc.push((0, viem_1.http)(r.url, { timeout: 5000 }));
                }
                return acc;
            }, [])
            // { retryCount: 3 }
            ),
        });
        const getBalance = async () => {
            try {
                return {
                    chain: chainListChain,
                    balance: await publicClient.getBalance({
                        address: constants_1.DEPLOYER_ADDRESS,
                    }),
                };
            }
            catch { }
        };
        promises.push(getBalance());
    }
    const results = await Promise.all(promises);
    const chainsWithoutBalance = results.filter((r) => r?.balance === 0n);
    if (!chainListChains.length) {
        throw new Error('Chains with balance not found');
    }
    const chainsToWrite = {};
    for (const chainWithBalance of chainsWithoutBalance) {
        if (!chainWithBalance)
            continue;
        const { chain: chainListChain } = chainWithBalance;
        const isChainExists = Boolean(Object.values(conceroChains).find((conceroChain) => {
            return conceroChain.chainId === chainListChain.chainId;
        }));
        if (isChainExists)
            continue;
        const chainName = (0, normalizeName_1.normalizeName)(chainListChain.shortName);
        if (conceroChains[chainName]) {
            console.log(`Chain with name: ${chainName} already exists`);
            continue;
        }
        chainsToWrite[chainName] = {
            name: chainName,
            chainId: chainListChain.chainId,
            chainSelector: (0, trimToUint24Digits_1.trimToUint24Digits)(chainListChain.chainId),
            rpcs: [],
            blockExplorers: chainListChain?.explorers,
            faucets: [],
            nativeCurrency: chainListChain?.nativeCurrency,
        };
    }
    if (!Object.values(chainsToWrite).length) {
        console.log('No chains to merge');
        return;
    }
    const chainsFilePath = __dirname + `/../../networks/chainsWithoutBalances.json`;
    node_fs_1.default.writeFileSync(chainsFilePath, JSON.stringify(chainsToWrite, null, 2));
    console.log(`Added ${Object.values(chainsToWrite).length} chains`);
}
parseChainlistChainsWithoutBalance();
