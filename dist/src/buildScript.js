"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const INPUT_FILE = path.join(__dirname, '../', 'networks', 'testnet.json');
const OUTPUT_DIR = path.join(__dirname, '../', 'networks', 'testnet');
function main() {
    if (!fs.existsSync(INPUT_FILE)) {
        console.error(`Input file not found ${INPUT_FILE}`);
        process.exit(1);
    }
    const raw = fs.readFileSync(INPUT_FILE, 'utf-8');
    let networks;
    try {
        networks = JSON.parse(raw);
    }
    catch (err) {
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
            rpcs: [],
            blockExplorers: [],
            faucets: [],
        };
        try {
            fs.writeFileSync(outFilePath, JSON.stringify(result, null, 2), {
                encoding: 'utf-8',
            });
            console.log(`File ${outFileName} has been created successfully.`);
        }
        catch (err) {
            console.error(err);
        }
    }
}
main();
