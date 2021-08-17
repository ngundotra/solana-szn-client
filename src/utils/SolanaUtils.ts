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
import {
    SolBox,
    SolMessage
} from './Sol2SolInstructions';
import {
    SolBoxLayout
} from './InstructionUtils';
import { SolMessageLayout } from "./Layout";

// const programId = "9K6veQjPEMQfEkT3mvMkMQupG7Wp7cFMj1g47eqYNpNd";
// const programId = "FzNnL8BVSrSXtkiUCMfsiZaCBp7PXNTBfjCXPftvQLGA";
const programId = "FzNnL8BVSrSXtkiUCMfsiZaCBp7PXNTBfjCXPftvQLGA"; 
export const ProgramPubkey = new PublicKey(programId);
// const devConnection = new Connection(clusterApiUrl('devnet'));
const devConnection = new Connection("http://127.0.0.1:8899");

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
    let possibleSolBoxes: Array<SolBox | undefined> = solBoxIds.map((ledgerData: LedgerAccountData) => decodeSolBoxState(ledgerData.account.data));
    return possibleSolBoxes.filter((solBox) => solBox !== undefined);
}

type LedgerAccountData = {
    pubkey: PublicKey,
    account: AccountInfo<Buffer>
}

export function decodeSolBoxState(buffer: Buffer): SolBox | undefined {
    if (buffer.length < SolBoxLayout.span) {
        console.log('buffer length is too small: ', buffer.length);
        return undefined;
    }
    let state = SolBoxLayout.decode(buffer);
    console.log(state.numSpots);
    console.log(state.numInUse);
    console.log(state.isInitialized);
    console.log(`Tag is ${state.tag === 0 ? "true": "false"}`);
    if (state.tag !== 0)
    {
        return undefined;
    }
    
    return {
        owner: new PublicKey(state.owner),
        nextBox: new PublicKey(state.nextBox),
        prevBox: new PublicKey(state.prevBox),
        numSpots: state.numSpots,
        numInUse: state.numInUse,
        isInitialized: state.isInitialized !== 0,
        messageSlots: Array<PublicKey>()
    };
}


async function filterSolBoxesFor(pubkey: PublicKey): Promise<Array<LedgerAccountData>> {
    let connection = getDevConnection();
    let accounts = await connection.getProgramAccounts(ProgramPubkey);
    console.log("Found accounts associated with programId: ", accounts);
    console.log(`[decoding]Looking for solbox with owner: ${pubkey}`);

    let solBoxes = accounts.filter(
        (accountData: LedgerAccountData, index: number) => {
            let accountInfo = accountData.account;
            try {
                let solBoxState = decodeSolBoxState(accountInfo.data);
                if (solBoxState === undefined)
                    return false;
                let solBoxOwner: PublicKey = solBoxState.owner;
                console.log(`[decoding]Solbox has owner: ${solBoxOwner.toString()}`);
                return (solBoxOwner.equals(pubkey));
            } catch (error) {
                return false;
            }
        }
    )
    return solBoxes;
}

function decodeSolMessage(data: Buffer): SolMessage | undefined {
    let solMessageState = SolMessageLayout.decode(data.slice(1,))!;
    return solMessageState;
}

export async function filterMessageDataForAddress(recipientAddress: String): Promise<Array<SolMessage>> {
    if (recipientAddress.length == 0) {
        console.log("[FilterData] Unable to resolve address:", recipientAddress);
        return [];
    }

    let connection = getDevConnection();
    let address = new PublicKey(recipientAddress);
    let accounts = await connection.getProgramAccounts(ProgramPubkey);

    console.log("[solMessage]Found accounts associated with programId: ", accounts);
    console.log(`[solMessage]Looking for messageBox with owner: ${address}`);

    let solMessages: Array<SolMessage> = []; 
    accounts.forEach(
        (accountData: LedgerAccountData, index: number) => {
            let accountInfo = accountData.account;
            try {
                if (accountInfo.data[0] !== 1) {
                    console.log("[solMessage]not message box- skipping");
                    return false;
                }

                let solMessage = decodeSolMessage(accountInfo.data);
                if (solMessage === undefined)
                    return false;
                    
                let toAddress: PublicKey = new PublicKey(solMessage.recipient);
                console.log(`[decoding]Solmessage has recipient: ${toAddress}`);
                console.log(`[decoding]Solmessage is: ${solMessage.message}`);
                solMessages.push(solMessage);

            } catch (error) {
                return false;
            }
        }
    )
    return solMessages;
}

export async function payForMessage(message: string, toAddress: string): Promise<boolean> {
    let inboxAddress = getCookie('solBoxAddress');
    if (inboxAddress.length < 1) {
        console.log("Routing to create solBoxAddress");
        // inboxAddress = await payForSolBox();
        // await payForSolBox();
        return false;
    } 
    return true;
}

export async function getProgramInfo(connection: Connection): Promise<AccountInfo<Buffer>> {
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
    return devConnection;
}

function getCookie(key: string): string {
    var b: any = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
}