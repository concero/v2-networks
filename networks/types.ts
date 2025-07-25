/** BlockExplorer interface defines the structure for block explorer data */
export interface BlockExplorer {
	name: string;
	url: string;
	apiUrl: string;
}

/** NativeCurrency interface for native token details */
export interface NativeCurrency {
	name: string;
	symbol: string;
	decimals: number;
}

/** NetworkSummary interface represents the simplified data in summary JSON files */
export interface NetworkSummary {
	chainId: number;
	chainSelector: number;
}

/**
 * NetworkConfig interface represents the complete data in individual network
 * JSON files
 */
export interface NetworkConfig {
	name: string;
	chainId: number;
	chainSelector?: number;
	rpcUrls: string[];
	blockExplorers: BlockExplorer[];
	faucets?: string[];
	nativeCurrency?: NativeCurrency;
	finalityConfirmations: number;
}
