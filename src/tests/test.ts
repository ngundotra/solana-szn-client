// import {Buffer} from 'buffer';
// import BN from 'bn.js';
//import * as BufferLayout from '@solana/buffer-layout';
// import {getDataLayout} from '../Layout';
// const Layout = require('../Layout');
import { Keypair, PublicKey } from '@solana/web3.js';
import * as Layout from '../Layout';
import { 
    createWriteMessageInstructionData,
    pubkeyToBuffer
} from '../InstructionUtils';
import { assert } from 'console';

function testWriteMessageIx() {
    let programId = new Keypair().publicKey;
    let sender = new Keypair().publicKey;
    let recipient = new Keypair().publicKey;
    let solBoxPubkey = new Keypair().publicKey;
    let messagePubkey = new Keypair().publicKey;
    let msg = "hello world!";

    let data = createWriteMessageInstructionData(
        programId,
        sender,
        recipient,
        solBoxPubkey,
        messagePubkey,
        msg,
    );
    let dataLayout = Layout.getDataLayout();
    // console.log(dataLayout);
    let recreated = dataLayout.decode(data);
    let dec = new TextDecoder();
    let recreatedString = dec.decode(recreated.message);
    let enc = new TextEncoder();
    const expected: any = {
        instruction: 1,
        sender: pubkeyToBuffer(sender), 
        recipient: pubkeyToBuffer(recipient), 
        messagePubkey: pubkeyToBuffer(messagePubkey),
        solBoxPubkey: pubkeyToBuffer(solBoxPubkey),
        msgSize: msg.length,
        message: Buffer.from(enc.encode(msg)),
    };
    // let keys = ["sender", "recipient", "messagePubkey", "solBoxPubkey", "msgSize"];
    // keys.forEach( (key) => {
    //     assert(expected[key] === recreated[key]);
    // })
    assert(recreatedString === msg, "recreated string does not match");
    assert(recreated.instruction === expected.instruction, "recreated instruction does not match");
    assert(recreated.msgSize === expected.msgSize, "recreated msgsize does not match");
    // assert(recreated.sender === expected.sender, "recreated sender does not match");
    // assert(recreated.recipient === expected.recipiient, "recreated recipient does not match");
    console.log("Mine: ", expected);
    console.log("Got : ", recreated); 
    console.log("Got : ", recreatedString);
}

testWriteMessageIx();