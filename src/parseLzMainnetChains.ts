import { Address } from 'viem';
import * as fs from 'node:fs';
import { Networks } from './buildScript';
import { trimToUint24Digits } from './utils/trimToUint24Digits';

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

interface IChainListChain {
	name: string;
	chain: string;
	icon: string;
	rpc: string[];
	nativeCurrency: {
		name: string;
		symbol: string;
		decimals: number;
	};
	infoURL: string;
	shortName: string;
	chainId: number;
	networkId: number;
	slip44: number;
	ens: {
		registry: string;
	};
	explorers: [
		{
			name: string;
			url: string;
			standard: string;
		},
		{
			name: string;
			url: string;
			icon: string;
			standard: string;
		},
		{
			name: string;
			url: string;
			icon: string;
			standard: string;
		},
		{
			name: string;
			url: string;
			standard: string;
		},
	];
	tvl: number;
	chainSlug: string;
	isTestnet: boolean;
}

const mainnetChainsFilePath = __dirname + '/../networks/mainnet.json';

const blackList = ['solana', 'tron'];

export async function parseLzMainnetChains() {
	const [lzChainsResponse, chainlistChainsResponse] = await Promise.all([
		fetch('https://docs.layerzero.network/data/deploymentsV2.json'),
		fetch('https://chainlist.org/rpcs.json'),
	]);

	const [lzChains, chainlistChains]: [ILzChain[], IChainListChain[]] =
		await Promise.all([
			lzChainsResponse.json(),
			chainlistChainsResponse.json(),
		]);

	const conceroChains = JSON.parse(
		fs.readFileSync(mainnetChainsFilePath, 'utf-8')
	) as Networks;

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

		const chainName = lzChain.chainKey
			.split('-')
			.filter(Boolean)
			.map((part, i) =>
				i === 0 ? part : part[0].toUpperCase() + part.slice(1)
			)
			.join('');

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

	fs.writeFileSync(
		mainnetChainsFilePath,
		JSON.stringify(
			{
				...conceroChains,
				...chainsToPast,
			},
			null,
			2
		)
	);
}

parseLzMainnetChains();
