import { PublicKey } from "@solana/web3.js";
import * as Layout from './Layout';
import * as BufferLayout from "@solana/buffer-layout";

export const SolBoxLayout = BufferLayout.struct([
    BufferLayout.u8('tag'),
    Layout.publicKey('owner'),
    Layout.publicKey('nextBox'),
    Layout.publicKey('prevBox'),
    BufferLayout.u32('numSpots'),
    BufferLayout.u32('numInUse'),
    BufferLayout.u8('isInitialized'),
    Layout.messageSlot('messageSlots'),
]);

export function createWriteMessageInstructionData(
    programId: PublicKey,
    owner: PublicKey,
    recipient: PublicKey,
    solBoxAccount: PublicKey,
    messageAccount: PublicKey,
    message: string,
): Buffer {
    // Todo(ngundotra): have a better way of allocating Buffer size 
    const dataLayout = Layout.getDataLayout();
    const data = Buffer.alloc(133 + message.length);
    // console.log("[writeMessageIxData]Buffer size is: ", 133 + message.length);

    // Encode the message to Utf8 byte array
    let textEncoder = new TextEncoder();
    const messageBytes = textEncoder.encode(message);
    // console.log("[writeMessageIxData]messageBytes: ", messageBytes); 

    // Format the arguments into a struct that fits into the buffer
    dataLayout.encode(
        {
            instruction: 0x1,
            sender: pubkeyToBuffer(owner),
            recipient: pubkeyToBuffer(recipient),
            messagePubkey: pubkeyToBuffer(messageAccount),
            solBoxPubkey: pubkeyToBuffer(solBoxAccount),
            msgSize: messageBytes.length,
            message: messageBytes,
        },
        data,
    );

    return data;
}

/**
 * Unfortunately, BufferLayout.encode uses an `instanceof` check for `Buffer`
 * which fails when using `publicKey.toBuffer()` directly because the bundled `Buffer`
 * class in `@solana/web3.js` is different from the bundled `Buffer` class in this package
 */
export function pubkeyToBuffer(publicKey: PublicKey): Buffer {
    return Buffer.from(publicKey.toBuffer());
}
