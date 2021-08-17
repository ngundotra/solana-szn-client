import { Keypair, PublicKey } from '@solana/web3.js';
import * as Layout from '../utils/Layout';
import { 
    createWriteMessageInstructionData,
    pubkeyToBuffer,
    SolBoxLayout,
} from '../utils/InstructionUtils';
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
    console.log("Data:\n", data.toString('hex').match(/../g)!.join(', 0x'), "\nDone.");
    //Array.from(data).forEach(x => console.log(String(x).toString('hex')));
    // console.log("Data bytes: ", Array.from(data));
    let dataLayout = Layout.getWriteMessageIxLayout();
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
    let buff = Buffer.from(pubkeyToBuffer(new PublicKey("GZbQmKYYzwjP3nbdqRWPLn98ipAni9w5eXMGp7bmZbGB")));
    let pk = new PublicKey(buff);
    console.log(pk.toString());
}


// testWriteMessageIx();
testInitSolBoxIx();
// testSolBoxState();