import { Address } from 'viem';
import { trimToUint24Digits } from '../utils/trimToUint24Digits';
import { fetchChainListChains } from '../resources/fetchChainListChains';
import { readConceroChains } from '../resources/readConceroChains';
import { normalizeName } from '../utils/normalizeName';
import { writeConceroChains } from '../resources/writeConceroChains';

export interface ILzChain {
	eid: string;
	chainKey: string;
	endpointV2: {
		address: Address;
	};
	readLib1002: {
		address: Address;
	};
	version: number;
	endpointV2View: {
		address: Address;
	};
	stage: string;
	executor: {
		address: Address;
	};
	deadDVN: {
		address: Address;
	};
	sendUln302: {
		address: Address;
	};
	lzExecutor: {
		address: Address;
	};
	blockedMessageLib: {
		address: Address;
	};
	receiveUln302: {
		address: Address;
	};
	nativeChainId: number;
	chainDisplayName: string;
}

const mainnetChainsFilePath = __dirname + '/../networks/mainnet.json';

const blackList = ['solana', 'tron', 'fantom'];

export async function parseLzMainnetChains() {
	const [lzChainsResponse, chainlistChains] = await Promise.all([
		fetch('https://docs.layerzero.network/data/deploymentsV2.json'),
		fetchChainListChains(),
	]);

	const [lzChains]: [ILzChain[]] = await Promise.all([
		lzChainsResponse.json(),
	]);

	const conceroChains = readConceroChains('mainnet');

	const chainsToPast: Record<string, any> = {};

	for (const lzChain of lzChains) {
		if (lzChain.stage !== 'mainnet') continue;

		const conceroChainIntegrated = Object.values(conceroChains).find(
			(c) => c.chainId === lzChain.nativeChainId
		);

		if (conceroChainIntegrated) continue;

		const chainlistInfo = chainlistChains.find(
			(c) => c.chainId === lzChain.nativeChainId
		);

		if (!chainlistInfo || chainlistInfo?.isTestnet) continue;

		const chainName = normalizeName(lzChain.chainKey);

		if (blackList.includes(chainName) || conceroChains[chainName]) continue;

		chainsToPast[chainName] = {
			name: chainName,
			chainId: lzChain.nativeChainId,
			chainSelector: trimToUint24Digits(lzChain.nativeChainId),
			rpcs: [] as string[],
			blockExplorers: chainlistInfo?.explorers,
			faucets: [],
			nativeCurrency: chainlistInfo?.nativeCurrency,
		};
	}

	writeConceroChains(
		{
			...conceroChains,
			...chainsToPast,
		},
		'mainnet'
	);
}

parseLzMainnetChains();
