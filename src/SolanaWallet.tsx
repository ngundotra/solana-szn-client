
import * as React from "react";
import {
    Button,
} from "@chakra-ui/react";
import {
    AtSignIcon
} from "@chakra-ui/icons";

import { Connection, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js';
import Wallet from '@project-serum/sol-wallet-adapter';

export function SolanaWallet() {
    return (
        <Button onClick={signInWithSollet} size="sm"><AtSignIcon size="md"/></Button>
    )
}

async function signInWithSollet() {
    let connection = new Connection(clusterApiUrl('devnet'));
    let providerUrl = 'https://www.sollet.io';
    let wallet = new Wallet(providerUrl);
    wallet.on('connect', (publicKey) => console.log('Connected to ' + publicKey.toBase58()));
    wallet.on('disconnect', () => console.log("Disconnected from wallet"));
    await wallet.connect();
    console.log("Signed in!\n");
}