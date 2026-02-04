import fs from 'node:fs';
import { Networks } from '../buildScript';

export function readConceroChains(type: 'testnet' | 'mainnet') {
	const chainsFilePath = __dirname + `/../../networks/${type}.json`;
	return JSON.parse(fs.readFileSync(chainsFilePath, 'utf-8')) as Networks;
}
