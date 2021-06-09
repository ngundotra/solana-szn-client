import * as React from "react";
import { 
    Connection, 
    SystemProgram, 
    Transaction, 
    clusterApiUrl,
    AccountInfo,
    PublicKey,
    Keypair,
} from '@solana/web3.js';
import {
    Alert,
    useToast
} from '@chakra-ui/react';
import Wallet from '@project-serum/sol-wallet-adapter';
import { AppState } from "./SPAEntry";
import {
    SolBox,
    decodeSolBoxState
} from './Sol2SolInstructions';

const programId = "9K6veQjPEMQfEkT3mvMkMQupG7Wp7cFMj1g47eqYNpNd";
export const ProgramPubkey = new PublicKey("9K6veQjPEMQfEkT3mvMkMQupG7Wp7cFMj1g47eqYNpNd");

export async function checkForEmailAddress(address: string): Promise<boolean> {
    try {
        let pubkey = new PublicKey(address);
        let connection = getDevConnection();
        connection.getBalance(pubkey).then(
            (accountBalance) => console.log("Address has %s sol on %s", accountBalance, 'devnet')
        );
        return true;
    } catch (error) {
        console.error("Unable to create PublicKey from: ", address);
        return false;
    }
}

export async function checkForInbox(wallet: Wallet): Promise<Array<SolBox>> {
    let solBoxIds = await filterSolBoxesFor(wallet.publicKey);
    // if (solBoxIds.length < 1) {
    //     let inboxAddress = await createSolBox(wallet);
    //     if (inboxAddress !== wallet.publicKey) {
    //         console.log(`[checkForInbox]Created new solbox for ${wallet.publicKey} @ ${inboxAddress}`);
    //         return [inboxAddress];
    //     }
    //     console.log(`[checkForInbox]Failed to create solbox for ${wallet.publicKey}`);
    //     return [];
    // }
    console.log(`[checkForInbox]Found ${solBoxIds.length} inboxes for ${wallet.publicKey}`);
    return solBoxIds.map((ledgerData: LedgerAccountData) => decodeSolBoxState(ledgerData.account.data));
}

type LedgerAccountData = {
    pubkey: PublicKey,
    account: AccountInfo<Buffer>
}

async function filterSolBoxesFor(pubkey: PublicKey): Promise<Array<LedgerAccountData>> {
    let connection = getDevConnection();
    let accounts = await connection.getProgramAccounts(ProgramPubkey);
    console.log("Found accounts associated with programId: ", accounts);
    console.log(`[decoding]Looking for solbox with owner: ${pubkey}`);
    let solBoxes = accounts.filter(
        (accountData: LedgerAccountData, index: number) => {
            let accountInfo = accountData.account;
            let solBoxState = decodeSolBoxState(accountInfo.data);
            let solBoxOwner: PublicKey = solBoxState.owner;
            console.log(`[decoding]Solbox has owner: ${solBoxOwner}`);
            return (solBoxOwner.equals(pubkey));
        }
    )
    return solBoxes;
}

export async function payForMessage(message: string, toAddress: string): Promise<boolean> {
    let inboxAddress = getCookie('solBoxAddress');
    if (inboxAddress.length < 1) {
        console.log("Routing to create solBoxAddress");
        // inboxAddress = await payForSolBox();
        await payForSolBox();
        return false;
    } 
    return true;
    // else {
    //     try {
    //         let inboxPubkey = new PublicKey(inboxAddress);
    //         let cluster = 'devnet';
    //         let connection = new Connection(clusterApiUrl(cluster));
    //         connection.getAccountInfo(inboxPubkey).then(
    //             (accountInfo) => console.log("Found inbox with: ", accountInfo),
    //         );
    //         return true;
    //     } catch (error) {
    //         console.error(error);
    //         return false;
    //     }
    // }
}

export async function payForSolBox() {
    let newSolBoxKeypair = new Keypair();
    let connection = getDevConnection();
    let transaction = new Transaction();
    transaction = transaction.add(
        SystemProgram.createAccount({
            fromPubkey: newSolBoxKeypair.publicKey,
            newAccountPubkey: newSolBoxKeypair.publicKey,
            lamports: 10000,
            space: 10000,
            programId: newSolBoxKeypair.publicKey,
        }),
    )

    return new Keypair();
}

export async function getProgramInfo(connection: Connection): Promise<AccountInfo> {
    // Taken from deployment log
    const programInfo = await connection.getAccountInfo(ProgramPubkey);
    if (programInfo === null) {
        throw new Error(`Program needs to be built and deployed`);
    } else if (!programInfo.executable){
        throw new Error(`Program is not executable...`);
    }
    console.log(`Using program ${ProgramPubkey.toBase58()}`);
    return programInfo;
}

export function getDevConnection(): Connection {
    let cluster = 'devnet';
    return new Connection(clusterApiUrl(cluster));
}

function getCookie(key: string): string {
    var b: any = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
}