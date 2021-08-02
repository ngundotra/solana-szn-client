// import {Buffer} from 'buffer';
// import BN from 'bn.js';
//import * as BufferLayout from '@solana/buffer-layout';
// import {getDataLayout} from '../Layout';
// const Layout = require('../Layout');
import { Keypair, PublicKey } from '@solana/web3.js';
import * as Layout from '../Layout';
import { 
    createWriteMessageInstructionData,
    pubkeyToBuffer,
    SolBoxLayout,
} from '../InstructionUtils';
import { assert } from 'console';
import bs58 from 'bs58';

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
    console.log("Data:\n", data.toString('hex').match(/../g)!.join(', 0x'), "\nDone.");
    //Array.from(data).forEach(x => console.log(String(x).toString('hex')));
    // console.log("Data bytes: ", Array.from(data));
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

function testInitSolBoxIx() {
    console.log("SolBox span: ", SolBoxLayout.span);
}

function testSolBoxState() {
    let ownerBytes = [0, 231, 56, 204, 7, 93, 211, 225, 175, 127, 20, 75, 205, 57, 53, 33, 60, 225, 63, 10, 30, 18, 34, 121, 135, 112, 14, 149, 246, 201, 138, 143];
    let ownerKey = new PublicKey(bs58.encode(ownerBytes));
    console.log('Key is:', ownerKey.toString());
}

// testWriteMessageIx();
// testInitSolBoxIx();
testSolBoxState();