/** BlockExplorer interface defines the structure for block explorer data */
export interface BlockExplorer {
	name: string;
	url: string;
	apiUrl: string;
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
	decimals?: number;
	rpcs: string[];
	blockExplorers: BlockExplorer[];
	faucets?: string[];
}
