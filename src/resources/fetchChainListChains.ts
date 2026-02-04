export interface IChainListChain {
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
	explorers: {
		name: string;
		url: string;
		standard: string;
	}[];
	tvl: number;
	chainSlug: string;
	isTestnet: boolean;
	status?: string;
}

export async function fetchChainListChains(): Promise<IChainListChain[]> {
	return (await fetch('https://chainlist.org/rpcs.json')).json();
}
