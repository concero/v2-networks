import fs from 'node:fs';

export function writeConceroChains(chains: any, type: 'testnet' | 'mainnet') {
	const chainsFilePath = __dirname + `/../../networks/${type}.json`;
	fs.writeFileSync(chainsFilePath, JSON.stringify(chains, null, 2));
}
