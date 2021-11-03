import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from '@solana/web3.js';

export function getClusterNetwork() {
    return WalletAdapterNetwork.Devnet;
}

export function getClusterEndpoint() {
    return clusterApiUrl(getClusterNetwork());
}