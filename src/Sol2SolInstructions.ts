
import {Buffer} from 'buffer';
import assert from 'assert';
import BN from 'bn.js';
import * as BufferLayout from '@solana/buffer-layout';
import * as Layout from './Layout';
import {
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
    TransactionInstruction,
    SYSVAR_RENT_PUBKEY,
    LAMPORTS_PER_SOL,
    sendAndConfirmTransaction
} from '@solana/web3.js';
import type {
    Commitment,
    TransactionSignature
} from '@solana/web3.js';
import Wallet from '@project-serum/sol-wallet-adapter';
import {
    ProgramPubkey,
    getDevConnection,
} from './SolanaUtils';
import {
    pubkeyToBuffer,
    createWriteMessageInstructionData,
    SolBoxLayout,
} from './InstructionUtils';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import bs58 from 'bs58';

/**
 * 32-bit value
 */
 export class u32 extends BN {
    /**
     * Convert to Buffer representation
     */
    toBuffer(): typeof Buffer {
        const a = super.toArray().reverse();
        const b = Buffer.from(a);
        if (b.length === 4) {
        return b;
        }
        assert(b.length < 4, 'u64 too large');

        const zeroPad = Buffer.alloc(4);
        b.copy(zeroPad);
        return zeroPad;
    }
  
    /**
     * Construct a u64 from Buffer representation
     */
    static fromBuffer(buffer: typeof Buffer): u32 {
        assert(buffer.length === 4, `Invalid buffer length: ${buffer.length}`);
        return new u32(
            [...buffer]
            .reverse()
            .map(i => `00${i.toString(16)}`.slice(-2))
            .join(''),
            16,
        );
    }
}

type InstructionType =
  | 'InitializeSolBox'
  | 'WriteMessage'
  | 'DeleteMessage';

const InstructionTypeCodes = {
    InitializeSolBox: 0,
    WriteMessage: 1,
    DeleteMessage: 2,
};

/**
 * Information about the SolBox
 */
export type SolBox = {
    /// Who owns this SolBox
    owner: PublicKey,
    /// Where to go looking for more messages
    nextBox: PublicKey,
    /// Where to go looking for more messages
    prevBox: PublicKey,
    /// How many messages this box stores
    numSpots: number,
    /// How many messages have been used
    numInUse: number,
    /// Has been initialized?
    isInitialized: boolean,
    /// The message pubkeys (const # only 20)
    messageSlots: Array<PublicKey>,
};

/**
 * Information about the SolBox
 */
 export type SolMessage = {
    /// Who owns this SolBox
    recipient: PublicKey,
    /// Where to go looking for more messages
    sender: PublicKey,
    /// How long the rest of the message is
    msgSize: u32,
    /// The message pubkeys (const # only 20)
    message: string,
};

export const FixedSolMessageLayout: BufferLayout.Structure = BufferLayout.struct([
    Layout.publicKey('recipient'),
    Layout.publicKey('sender'),
    BufferLayout.u32('msgSize'),
]);

export function decodeSolBoxState(buffer: Buffer): SolBox | undefined {
    // let tag = new BufferLayout.u8(
    //     [...buffer.slice(0,1)]
    //     .reverse()
    //     .map(i => `00${i.toString(16)}`.slice(-2))
    //     .join(''),
    //     16,);
    // console.log("[decode]Tag is: ", tag);
    // if (tag === 0) {
    //     return undefined;
    // }
    // buffer = buffer.slice(1);
    let state = SolBoxLayout.decode(buffer);
    // console.log(state.numSpots);
    // console.log(state.numInUse);
    // console.log(state.isInitialiized);
    return {
        owner: new PublicKey(bs58.encode(state.owner)),
        nextBox: new PublicKey(state.nextBox),
        prevBox: new PublicKey(state.prevBox),
        numSpots: state.numSpots,
        numInUse: state.numInUse,
        isInitialized: state.isInitialized !== 0,
        messageSlots: Array<PublicKey>()
    };
}

async function getMinBalanceForSolBox(): Promise<number> {
    return await getDevConnection().getMinimumBalanceForRentExemption(
        SolBoxLayout.span + 1,
    );
}

var cachedMinBalanceForMessageLength = new Map<number,number>();

export async function getMinBalanceForMessage(message: string): Promise<number> {
    if (cachedMinBalanceForMessageLength.has(message.length)) {
        return cachedMinBalanceForMessageLength.get(message.length)!;
    }
    let newBalance = await getDevConnection().getMinimumBalanceForRentExemption(
        getMessageStateSpan(message),
    );
    cachedMinBalanceForMessageLength.set(message.length, newBalance);
    return newBalance;
}

export async function createSolBox(wallet: Wallet): Promise<PublicKey> {
    const connection = getDevConnection();
    const balanceNeeded = await getMinBalanceForSolBox();
    console.log(`balance needed is: ~${(balanceNeeded / LAMPORTS_PER_SOL)* 40} USD`);
    const accountInfo = await connection.getAccountInfo(wallet.publicKey);
    console.log("Found walletInfo: ", accountInfo);
    if (!accountInfo || accountInfo === undefined) {
        console.log("Cannot continue, pubkey address lacks corresponding AccountInfo");
    } else if (accountInfo!.lamports < balanceNeeded) {
        console.log("Cannot continue... insufficient balance");
        return wallet.publicKey;
    } else {
        console.log("Account has enough lamports to continue!");
    }

    const solBoxAccount = new Keypair();
    const transaction = new Transaction();
    // const hardcodedKey = new PublicKey("B766NZZoErqzL9SUGL4351Ca1y6tCjr1P7hiE7prbz3E");

    console.log("[debug] Program Pubkey: ", ProgramPubkey.toString())
    transaction.add(
        SystemProgram.createAccount({
            fromPubkey: wallet.publicKey,
            newAccountPubkey: solBoxAccount.publicKey,
            lamports: balanceNeeded,
            space: 746,     //SolBoxLayout.span,
            programId: ProgramPubkey,
        }),
    );

    transaction.add(
        createInitSolBoxInstruction(
            ProgramPubkey,
            wallet.publicKey,
            solBoxAccount.publicKey,
        )
    );

    console.log('[InitSolBox]Created transaction...');
    let {blockhash} = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;
    transaction.sign(solBoxAccount);
    let signed = await wallet.signTransaction(transaction);

    // signed.sign(solBoxAccount);
    let txid = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(txid);

    console.log("[InitSolBox]Completed!...", solBoxAccount.publicKey.toString());

    return solBoxAccount.publicKey;
}

function getMessageStateSpan(message: string): number {
    return FixedSolMessageLayout.span + message.length + 1;
}

export async function createNewMessage(
    wallet: Wallet, 
    recipient: PublicKey, 
    solBoxPubkey: PublicKey,
    message: string,
): Promise<PublicKey> {
    const connection = getDevConnection();
    const balanceNeeded = await getMinBalanceForMessage(message);
    console.log(`balance needed is: ~${(balanceNeeded / LAMPORTS_PER_SOL)* 40} USD`);
    const accountInfo = await connection.getAccountInfo(wallet.publicKey);

    if (!accountInfo || accountInfo === undefined) {
        throw new Error("no account info for given wallet pubkey");
    } else if (accountInfo!.lamports < balanceNeeded) {
        console.log("Cannot continue... insufficient balance");
        return wallet.publicKey;
    } else {
        console.log("Account has enough lamports to continue!");
    }

    const messageAccount = new Keypair();
    const transaction = new Transaction();
    transaction.add(
        SystemProgram.createAccount({
            fromPubkey: wallet.publicKey,
            newAccountPubkey: messageAccount.publicKey,
            lamports: balanceNeeded,
            space: getMessageStateSpan(message),
            programId: ProgramPubkey,
        }),
    );

    transaction.add(
        createWriteMessageInstruction(
            ProgramPubkey,
            wallet.publicKey,
            recipient,
            solBoxPubkey,
            messageAccount.publicKey,
            message,
        )
    );

    console.log('[WriteMessage]Created transaction...');
    let {blockhash} = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;
    transaction.sign(messageAccount);
    // console.log("Program pubkey:", ProgramPubkey);
    // console.log("")

    let signed = await wallet.signTransaction(transaction);
    // signed.sign(solBoxPubkey);
    let txid = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(txid);

    let messageAccountInfo = await connection.getAccountInfo(messageAccount.publicKey);
    // console.log("Message account info: ", messageAccountInfo);
    // console.log("programPubkey:", ProgramPubkey);
    // console.log("messageAccountInfo.owner: ", messageAccountInfo!.owner);
    // assert(messageAccountInfo!.owner.equals(ProgramPubkey));

    return messageAccount.publicKey;
}

export function getNumberOfFreeSlots(solBoxes: Array<SolBox>): number {
    let numFree = solBoxes.map((solBox: SolBox) => solBox.numSpots);
    console.log(`[getNumberOfFreeSlots]Found spots: ${numFree}`);
    var total = 0;
    numFree.forEach((num) => {
        total += num;
    });
    return total;
}

export function createInitSolBoxInstruction(
    programId: PublicKey,
    owner: PublicKey,
    solBoxAccount: PublicKey,
): TransactionInstruction {
    const keys = [
        {pubkey: solBoxAccount, isSigner: true, isWritable: true},
        {pubkey: owner, isSigner: true, isWritable: true},
        {pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
    ];
    const dataLayout = BufferLayout.struct([
        BufferLayout.u8('instruction'),
        Layout.publicKey('owner'),
        BufferLayout.u32('numSpots'),
        Layout.publicKey('nextBox'),
        Layout.publicKey('prevBox'),
    ]);
    const data = Buffer.alloc(dataLayout.span);
    console.log(`InitSolBox span length is: ${dataLayout.span}`);
    dataLayout.encode(
        {
            instruction: 0,
            owner: pubkeyToBuffer(owner),
            numSpots: 20,
            nextBox: pubkeyToBuffer(solBoxAccount),
            prevBox: pubkeyToBuffer(solBoxAccount),
        },
        data,
    );

    return new TransactionInstruction({
        keys,
        programId,
        data,
    });
}

export function createWriteMessageInstruction(
    programId: PublicKey,
    owner: PublicKey,
    recipient: PublicKey,
    solBoxAccount: PublicKey,
    messageAccount: PublicKey,
    message: string,
): TransactionInstruction {
    const keys = [
        {pubkey: messageAccount, isSigner: false, isWritable: true},
        {pubkey: solBoxAccount, isSigner: false, isWritable: true},
        {pubkey: owner, isSigner: false, isWritable: true},
        {pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
        {pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
    ];

    const data = createWriteMessageInstructionData(
        programId,
        owner,
        recipient,
        solBoxAccount,
        messageAccount,
        message
    );

    return new TransactionInstruction({
        keys,
        programId,
        data,
    });
}