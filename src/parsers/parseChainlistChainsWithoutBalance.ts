import { fetchChainListChains } from '../resources/fetchChainListChains';
import { readConceroChains } from '../resources/readConceroChains';
import { createPublicClient, fallback, http } from 'viem';
import { trimToUint24Digits } from '../utils/trimToUint24Digits';
import { normalizeName } from '../utils/normalizeName';

import fs from 'node:fs';
import { isHttpEndpoint } from '../utils/isHttpEndpoint';
import { DEPLOYER_ADDRESS } from '../constants';

async function parseChainlistChainsWithoutBalance() {
	const chainListChains = await fetchChainListChains();
	const conceroChains = readConceroChains('mainnet');

	const promises = [];
	for (const chainListChain of chainListChains) {
		if (
			chainListChain.isTestnet ||
			chainListChain?.status === 'incubating'
		) {
			continue;
		}

		const httpRpcs = chainListChain.rpc.filter(
			(r) => r.url && isHttpEndpoint(r.url)
		);

		if (!httpRpcs?.length) continue;

		// TODO: move to contract-utils publicClient
		const publicClient = createPublicClient({
			transport: fallback(
				chainListChain.rpc.reduce((acc, r) => {
					if (r.url && isHttpEndpoint(r.url)) {
						acc.push(http(r.url, { timeout: 5_000 }));
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
			} catch {}
		};

		promises.push(getBalance());
	}

	const results = await Promise.all(promises);

	const chainsWithoutBalance = results.filter((r) => r?.balance === 0n);

	if (!chainListChains.length) {
		throw new Error('Chains with balance not found');
	}

	const chainsToWrite: Record<string, any> = {};

	for (const chainWithBalance of chainsWithoutBalance) {
		if (!chainWithBalance) continue;

		const { chain: chainListChain } = chainWithBalance;

		const isChainExists = Boolean(
			Object.values(conceroChains).find((conceroChain) => {
				return conceroChain.chainId === chainListChain.chainId;
			})
		);

		if (isChainExists) continue;

		const chainName = normalizeName(chainListChain.shortName);

		if (conceroChains[chainName]) {
			console.log(`Chain with name: ${chainName} already exists`);
			continue;
		}

		chainsToWrite[chainName] = {
			name: chainName,
			chainId: chainListChain.chainId,
			chainSelector: trimToUint24Digits(chainListChain.chainId),
			rpcs: [] as string[],
			blockExplorers: chainListChain?.explorers,
			faucets: [],
			nativeCurrency: chainListChain?.nativeCurrency,
		};
	}

	if (!Object.values(chainsToWrite).length) {
		console.log('No chains to merge');
		return;
	}

	const chainsFilePath =
		__dirname + `/../../networks/chainsWithoutBalances.json`;
	fs.writeFileSync(chainsFilePath, JSON.stringify(chainsToWrite, null, 2));

	console.log(`Added ${Object.values(chainsToWrite).length} chains`);
}

parseChainlistChainsWithoutBalance();
