import Wallet from '@project-serum/sol-wallet-adapter';
import { AppState } from "./SPAEntry";
import { checkForInbox, getDevConnection } from './SolanaUtils';
import SolBox from './Sol2SolInstructions';

export async function signInWithSollet(state: AppState, setState: (arg0: Object) => void) {
    // Todo(ngundotra): throw spinner on this page when sollet pops up

    let providerUrl = 'https://www.sollet.io';
    let wallet = new Wallet(providerUrl);
    wallet.on('connect', (publicKey) => console.log('Connected to ' + publicKey.toBase58()));
    wallet.on('disconnect', () => console.log("Disconnected from wallet"));
    await wallet.connect();
    console.log("Signed in!\n");

    let connection = getDevConnection();
    let balance = await connection.getBalance(wallet.publicKey);
    console.log(`[signInWithSollet]Wallet has balance: ${balance}`);
    if (balance === undefined || balance === null) {
        balance = -1;
    }

    let newState = {
        walletState: {
            wallet: wallet,
            balance: balance,
        },
        solState: state.solState,
        sendState: state.sendState,
    };
    setState(newState);

    checkForInbox(wallet).then(
        (solBoxes: Array<SolBox>) => {
            if (solBoxes === undefined) {
                console.log("[checkForInbox]No solboxes were found")
                return;
            }
            console.log(`[checkForInbox]Found ${solBoxes.length} solboxes belonging to ${wallet.publicKey}`);
            setState({
                walletState: newState.walletState,
                sendState: newState.sendState,
                solState: {
                    solBoxes: solBoxes,
                }
            });
        }
    );
}