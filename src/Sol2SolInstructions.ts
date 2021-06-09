
import {Buffer} from 'buffer';
import assert from 'assert';
import BN from 'bn.js';
import * as BufferLayout from 'buffer-layout';
import {
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
    TransactionInstruction,
    SYSVAR_RENT_PUBKEY,
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
import * as Layout from './Layout';
// import * as Layout from './layout';

/**
 * Unfortunately, BufferLayout.encode uses an `instanceof` check for `Buffer`
 * which fails when using `publicKey.toBuffer()` directly because the bundled `Buffer`
 * class in `@solana/web3.js` is different from the bundled `Buffer` class in this package
 */
function pubkeyToBuffer(publicKey: PublicKey): typeof Buffer {
    return Buffer.from(publicKey.toBuffer());
}

function isAccount(accountOrPublicKey: any): boolean {
    return 'publicKey' in accountOrPublicKey;
}

/**
 * 64-bit value
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
 type SolBox = {
    /// Who owns this SolBox
    owner: PublicKey,
    /// Where to go looking for more messages
    nextBox: PublicKey,
    /// Where to go looking for more messages
    prevBox: PublicKey,
    /// How many messages this box stores
    numSpots: u32,
    /// How many messages have been used
    numInUse: u32,
    /// Has been initialized?
    isInitialized: boolean,
    /// The message pubkeys (const # only 20)
    messageSlots: Array<PublicKey>,
};

export const SolBoxLayout: typeof BufferLayout.Structure = BufferLayout.struct([
    Layout.publicKey('owner'),
    Layout.publicKey('nextBox'),
    Layout.publicKey('prevBox'),
    BufferLayout.u32('numSpots'),
    BufferLayout.u32('numInUse'),
    BufferLayout.u8('isInitialized'),
    Layout.messageSlot('messageSlots'),
]);

export async function createSolBox(wallet: Wallet): Promise<PublicKey> {
    //todo(ngundotra): fill this with legimate brainpower
    const connection = getDevConnection();
    const balanceNeeded = await connection.getMinimumBalanceForRentExemption(
        SolBoxLayout.span,
    );
    console.log(`balance needed is: ~${(balanceNeeded * 0.000000001)* 40} USD`);
    const accountInfo = await connection.getAccountInfo(wallet.publicKey);
    console.log("Found walletInfo: ", accountInfo);
    if (accountInfo?.lamports < balanceNeeded) {
        console.log("Cannot continue... insufficient balance");
        return wallet.publicKey;
    } else {
        console.log("Account has enough lamports to continue!");
    }

    const solBoxAccount = new Keypair();
    const transaction = new Transaction();
    transaction.add(
        SystemProgram.createAccount({
            fromPubkey: wallet.publicKey,
            newAccountPubkey: solBoxAccount.publicKey,
            lamports: balanceNeeded,
            space: SolBoxLayout.span,
            programId: ProgramPubkey,
        }),
    );

    transaction.add(
        createInitSolBoxInstruction(
            ProgramPubkey,
            wallet.publicKey,
            solBoxAccount.publicKey
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

    return solBoxAccount.publicKey;
}

export function createInitSolBoxInstruction(
    programId: PublicKey,
    owner: PublicKey,
    solBoxAccount: PublicKey,
): TransactionInstruction {
    const keys = [
        {pubkey: solBoxAccount, isSigner: true, isWritable: false},
        {pubkey: owner, isSigner: false, isWritable: true},
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

// export function createWriteMessageInstruction(
//     programId: PublicKey,
//     owner: PublicKey,
//     account: PublicKey,
// ): TransactionInstruction {
//     // const keys = [
//     //     {pubkey: account, isSigner: true, isWritable: true},
//     //     {pubkey: owner, isSigner: true, isWritable: true},
//     //     {pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
//     // ];
//     // const dataLayout = BufferLayout.struct([
//     //     BufferLayout.u8('instruction'),
//     //     Layout.publicKey('owner'),
//     //     BufferLayout.u32('numSpots'),
//     //     Layout.publicKey('nextBox'),
//     //     Layout.publicKey('prevBox'),
//     // ]);
//     // const data = Buffer.alloc(dataLayout.span);
//     // dataLayout.encode(
//     //     {
//     //         instruction: 0,

//     //     },
//     //     data,
//     // );

//     return new TransactionInstruction({
//         keys,
//         programId,
//         data,
//     });
// }