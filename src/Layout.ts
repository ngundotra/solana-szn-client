import * as BufferLayout from '@solana/buffer-layout';

/**
 * Layout for a public key
 */
export const publicKey = (property: string = 'publicKey'): BufferLayout.Layout => {
    return BufferLayout.blob(32, property);
};

/**
 * Layout for a 32bit unsigned value
 */
export const messageSlot = (property: string = 'messageSlot'): BufferLayout.Layout => {
    return BufferLayout.blob(32*20, property);
};

export const messageBoxString = (property: string = 'messageBoxString') => {
    const msgBoxLayout = BufferLayout.struct(
        [
            BufferLayout.u32('msgSize'),
            BufferLayout.blob(BufferLayout.offset(BufferLayout.u32(), -8), 'message')
        ],
        property,
    );

    const _decode = msgBoxLayout.decode.bind(msgBoxLayout);
    const _encode = msgBoxLayout.encode.bind(msgBoxLayout);

    msgBoxLayout.decode = (buffer:any, offset:any) => {
        const data =  _decode(buffer, offset);
        return data['message'].tostring('utf8');
    };
    
    msgBoxLayout.encode = (str: any, buffer:any, offset:any) => {
        const data = {
            message: Buffer.from(str, 'utf8'),
        };
        return _encode(data, buffer, offset);
    };

    (msgBoxLayout as any).alloc = (str: any) => {
        return (
            BufferLayout.u32().span +
            Buffer.from(str, 'utf8').length
        );
    }

    return msgBoxLayout;
}

export function getWriteMessageIxLayout(): BufferLayout.Layout {
    const dataLayout = BufferLayout.struct([
        BufferLayout.u8('instruction'),
        publicKey('sender'),
        publicKey('recipient'),
        publicKey('messagePubkey'),
        publicKey('solBoxPubkey'),
        BufferLayout.u32('msgSize'),
        // BufferLayout.offset(BufferLayout.u32(), -133, 'message'),
        BufferLayout.blob(BufferLayout.offset(BufferLayout.u32(), -4), 'message')
    ]);
    return dataLayout;
};

export const SolMessageLayout: BufferLayout.Layout = BufferLayout.struct([
    publicKey('sender'),
    publicKey('recipient'),
    BufferLayout.u32('msgSize'),
    BufferLayout.blob(BufferLayout.offset(BufferLayout.u32(), -4), 'message')
]);