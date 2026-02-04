"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchChainListChains = fetchChainListChains;
async function fetchChainListChains() {
    return (await fetch('https://chainlist.org/rpcs.json')).json();
}
