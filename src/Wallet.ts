import Wallet from '@project-serum/sol-wallet-adapter';
import { AppState } from "./SPAEntry";
import { checkForInbox } from './SolanaUtils';

export async function signInWithSollet(state: AppState, setState: (arg0: Object) => void) {
    // Todo(ngundotra): throw spinner on this page when sollet pops up

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

    let inboxAddress = await checkForInbox(wallet);
    console.log(`Found inbox address: ${inboxAddress}`);
}