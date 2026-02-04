"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetchChainListChains_1 = require("./resources/fetchChainListChains");
const readConceroChains_1 = require("./resources/readConceroChains");
const viem_1 = require("viem");
const trimToUint24Digits_1 = require("./utils/trimToUint24Digits");
const normalizeName_1 = require("./utils/normalizeName");
const writeConceroChains_1 = require("./resources/writeConceroChains");
const DEPLOYER_ADDRESS = '0x1D218D445b69c7eFa20be0DC120B8d001440f15C';
function isHttpEndpoint(url) {
    return url.startsWith('http://') || url.startsWith('https://');
}
async function parseChainsWithBalance() {
    const chainListChains = await (0, fetchChainListChains_1.fetchChainListChains)();
    const conceroChains = (0, readConceroChains_1.readConceroChains)('mainnet');
    const promises = [];
    for (const chainListChain of chainListChains) {
        if (chainListChain.isTestnet)
            continue;
        const httpRpcs = chainListChain.rpc.filter((r) => r.url && isHttpEndpoint(r.url));
        if (!httpRpcs?.length)
            continue;
        // TODO: move to contract-utils publicClient
        const publicClient = (0, viem_1.createPublicClient)({
            transport: (0, viem_1.fallback)(chainListChain.rpc.reduce((acc, r) => {
                if (r.url && isHttpEndpoint(r.url)) {
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
                        address: DEPLOYER_ADDRESS,
                    }),
                };
            }
            catch { }
        };
        promises.push(getBalance());
    }
    const results = await Promise.all(promises);
    const chainsWithBalance = results.filter((r) => r?.balance && r.balance > 0n);
    if (!chainListChains.length) {
        throw new Error('Chains with balance not found');
    }
    const chainsToMerge = {};
    for (const chainWithBalance of chainsWithBalance) {
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
        chainsToMerge[chainName] = {
            name: chainName,
            chainId: chainListChain.chainId,
            chainSelector: (0, trimToUint24Digits_1.trimToUint24Digits)(chainListChain.chainId),
            rpcs: [],
            blockExplorers: chainListChain?.explorers,
            faucets: [],
            nativeCurrency: chainListChain?.nativeCurrency,
        };
    }
    if (!Object.values(chainsToMerge).length) {
        console.log('No chains to merge');
        return;
    }
    (0, writeConceroChains_1.writeConceroChains)({ ...conceroChains, ...chainsToMerge }, 'mainnet');
    console.log(`Added ${Object.values(chainsToMerge).length} chains`);
}
parseChainsWithBalance();
