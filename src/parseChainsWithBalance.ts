import { fetchChainListChains } from './resources/fetchChainListChains';
import { readConceroChains } from './resources/readConceroChains';
import { createPublicClient, fallback, http } from 'viem';
import { trimToUint24Digits } from './utils/trimToUint24Digits';
import { normalizeName } from './utils/normalizeName';
import { writeConceroChains } from './resources/writeConceroChains';

const DEPLOYER_ADDRESS = '0x1D218D445b69c7eFa20be0DC120B8d001440f15C';

function isHttpEndpoint(url: string): boolean {
	return url.startsWith('http://') || url.startsWith('https://');
}

async function parseChainsWithBalance() {
	const chainListChains = await fetchChainListChains();
	const conceroChains = readConceroChains('mainnet');

	const promises = [];
	for (const chainListChain of chainListChains) {
		if (chainListChain.isTestnet) continue;

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

	const chainsWithBalance = results.filter(
		(r) => r?.balance && r.balance > 0n
	);

	if (!chainListChains.length) {
		throw new Error('Chains with balance not found');
	}

	const chainsToMerge: Record<string, any> = {};

	for (const chainWithBalance of chainsWithBalance) {
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

		chainsToMerge[chainName] = {
			name: chainName,
			chainId: chainListChain.chainId,
			chainSelector: trimToUint24Digits(chainListChain.chainId),
			rpcs: [] as string[],
			blockExplorers: chainListChain?.explorers,
			faucets: [],
			nativeCurrency: chainListChain?.nativeCurrency,
		};
	}

	if (!Object.values(chainsToMerge).length) {
		console.log('No chains to merge');
		return;
	}

	writeConceroChains({ ...conceroChains, ...chainsToMerge }, 'mainnet');

	console.log(`Added ${Object.values(chainsToMerge).length} chains`);
}

parseChainsWithBalance();
