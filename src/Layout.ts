import * as BufferLayout from 'buffer-layout';

/**
 * Layout for a public key
 */
export const publicKey = (property: string = 'publicKey'): Buffer => {
    return BufferLayout.blob(32, property);
};

/**
 * Layout for a 32bit unsigned value
 */
 export const messageSlot = (property: string = 'messageSlot'): Buffer => {
    return BufferLayout.blob(32*20, property);
};