# Concero - V2 Networks Repository

This repository serves as a centralized database of blockchain networks supported by Concero V2. It contains network configurations for both mainnet and testnet environments that can be used across various Concero applications.

## Repository Structure

```
concero-v2-networks/
├── mainnet/
│   ├── network1.json
│   ├── network2.json
│   └── ...
├── testnet/
│   ├── network1.json
│   ├── network2.json
│   └── ...
├── mainnet.json
└── testnet.json
```

- `mainnet/`: Contains individual JSON files for each production network
- `testnet/`: Contains individual JSON files for each test network
- `mainnet.json`: An aggregated file with simplified information for all production networks
- `testnet.json`: An aggregated file with simplified information for all test networks

## Adding Your Network

To add your blockchain network to the Concero ecosystem, please follow these steps:

### 1. Create Individual Chain Files

Create a JSON file for your network with the following structure:

```json
{
    "name": "yourNetworkName",
    "chainId": 12345,
    "chainSelector": 12345,
    "rpcs": [
        "https://rpc1.yournetwork.com",
        "https://rpc2.yournetwork.com"
    ],
    "blockExplorers": [
        {
            "name": "YourExplorer",
            "url": "https://explorer.yournetwork.com",
            "apiUrl": "https://api.explorer.yournetwork.com/api"
        }
    ],
    "faucets": ["https://faucet.yournetwork.com/"]
}
```

File naming convention: Use camelCase for your network name (e.g., `arbitrumSepolia.json`, `baseSepolia.json`).

### 2. Add Entry to Aggregated Files

Add your network entry to either `mainnet.json` or `testnet.json` (or both, if applicable):

```json
{
    "existingNetwork1": {
        "chainId": 1111,
        "chainSelector": 1111
    },
    "yourNetworkName": {
        "chainId": 12345,
        "chainSelector": 12345
    }
}
```

### 3. Submit a Pull Request

Create a pull request with the following changes:

1. Add your individual chain file to the appropriate directory:
   - Production networks: Add to `mainnet/` directory
   - Test networks: Add to `testnet/` directory

2. Update the appropriate aggregated file:
   - Production networks: Update `mainnet.json`
   - Test networks: Update `testnet.json`


## Requirements

- Chain names should be in camelCase
- Chain IDs must be unique and match the actual network
- Chain selectors must be provided and match cross-chain protocols if applicable
- At least one block explorer should be provided
- RPCs array can be empty if no public RPC endpoints are available
- Faucets array is optional for mainnet networks

## Review Process

After submitting your pull request, the Concero team will review your submission. We may request changes or additional information before merging your network into the repository.

---

For any questions or further assistance, please open an issue in this repository or contact the Concero team.
