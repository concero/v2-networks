/*
	This script is a crutch that makes build before
	build to do less manual work due to suboptimal file structure.
 	to use it, first fill in the networks/testnet.json file with new chains and then
 	run this script with bun, and it will create files in networks/testnet/.
 */

import * as fs from 'fs';
import * as path from 'path';

export interface NetworkInfo {
	chainId: number;
	chainSelector: number;
}

export interface Networks {
	[key: string]: NetworkInfo;
}

const INPUT_FILE = path.join(__dirname, '../', 'networks', 'testnet.json');
const OUTPUT_DIR = path.join(__dirname, '../', 'networks', 'testnet');

function main() {
	if (!fs.existsSync(INPUT_FILE)) {
		console.error(`Input file not found ${INPUT_FILE}`);
		process.exit(1);
	}

	const raw = fs.readFileSync(INPUT_FILE, 'utf-8');
	let networks: Networks;

	try {
		networks = JSON.parse(raw);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}

	for (const [networkName, info] of Object.entries(networks)) {
		const outFileName = `${networkName}.json`;
		const outFilePath = path.join(OUTPUT_DIR, outFileName);

		if (fs.existsSync(outFilePath)) {
			console.log(`file ${outFileName} already exists, skipping...`);
			continue;
		}

		const result = {
			name: networkName,
			chainId: info.chainId,
			chainSelector: info.chainSelector,
			rpcs: [] as string[],
			blockExplorers: [],
			faucets: [],
		};

		try {
			fs.writeFileSync(outFilePath, JSON.stringify(result, null, 2), {
				encoding: 'utf-8',
			});
			console.log(`File ${outFileName} has been created successfully.`);
		} catch (err) {
			console.error(err);
		}
	}
}

main();
