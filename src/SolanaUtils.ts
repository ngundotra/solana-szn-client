import { 
    Connection, 
    SystemProgram, 
    Transaction, 
    clusterApiUrl,
    PublicKey,
} from '@solana/web3.js';
import Wallet from '@project-serum/sol-wallet-adapter';
import { AppState } from "./SPAEntry";

export async function checkForEmailAddress(address: string): Promise<boolean> {
    try {
        let pubkey = new PublicKey(address);
        let cluster = 'devnet';
        let connection = new Connection(clusterApiUrl(cluster));
        connection.getBalance(pubkey).then(
            (accountBalance) => console.log("Address has %s sol on %s", accountBalance, cluster)
        );
        return true;
    } catch (error) {
        console.error("Unable to create PublicKey from: ", address);
        return false;
    }
}