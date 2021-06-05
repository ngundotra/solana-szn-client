import { Connection, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js';
import Wallet from '@project-serum/sol-wallet-adapter';
import { AppState } from "./SPAEntry";

export async function signInWithSollet(state: AppState, setState: (arg0: Object) => void) {
    let connection = new Connection(clusterApiUrl('devnet'));
    let providerUrl = 'https://www.sollet.io';
    let wallet = new Wallet(providerUrl);
    wallet.on('connect', (publicKey) => console.log('Connected to ' + publicKey.toBase58()));
    wallet.on('disconnect', () => console.log("Disconnected from wallet"));
    await wallet.connect();
    console.log("Signed in!\n");

    setState({
        walletState: wallet,
        sendState: state.sendState,
    })
}