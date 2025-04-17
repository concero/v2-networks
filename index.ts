import fs from 'fs';
import path from 'path';
import { NetworkConfig, NetworkSummary, BlockExplorer } from './networks/types';

import mainnetSummary from './networks/mainnet.json';
import testnetSummary from './networks/testnet.json';

function loadNetworkConfigs(
	directoryPath: string
): Record<string, NetworkConfig> {
	const networks: Record<string, NetworkConfig> = {};

	try {
		const fullPath = path.resolve(__dirname, directoryPath);
		if (fs.existsSync(fullPath)) {
			const files = fs.readdirSync(fullPath);

			files.forEach((file) => {
				if (file.endsWith('.json')) {
					const networkName = path.basename(file, '.json');
					const networkConfig = require(path.join(fullPath, file));
					networks[networkName] = networkConfig;
				}
			});
		}
	} catch (error) {
		console.error(
			`Error loading network configurations from ${directoryPath}:`,
			error
		);
	}

	return networks;
}

const mainnetNetworks = loadNetworkConfigs('./networks/mainnet');
const testnetNetworks = loadNetworkConfigs('./networks/testnet');

export { NetworkConfig, NetworkSummary, BlockExplorer };
export { mainnetSummary, testnetSummary };
export { mainnetNetworks, testnetNetworks };
