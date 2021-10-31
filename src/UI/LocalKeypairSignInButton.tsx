import React, { useEffect } from 'react';
import {
    Button,
} from "@chakra-ui/react";
import {
    Keypair
} from '@solana/web3.js';

function getKeypair(fileData: ArrayBuffer): Keypair {
    let decoder = new TextDecoder("utf-8"); 
    let fileStr = decoder.decode(fileData);
    console.log(fileStr);

    let secretKeyNumbers = JSON.parse(fileStr.toString());
    let secretKey = Uint8Array.from(secretKeyNumbers);

    let keypair = Keypair.fromSecretKey(secretKey);
    console.log(keypair.publicKey.toString());
    return(keypair)
}

export function LocalKeypairSignInButton() {
    const [keypairFileSelected, setKeypairFileSelected] = React.useState<File>();
    const [keypair, setKeypair] = React.useState<Keypair>();
    const keypairFile = React.createRef<HTMLInputElement>();

    function showOpenKeypairDlg() {
        keypairFile!.current!.click();
    }

    useEffect( () => {
        console.log("are we connected? ", document.isConnected);
    }, []);

    function onChangeKeypairFile(event: React.ChangeEvent<HTMLInputElement>) {
        console.log("keypair file changed!");
        console.log(event);
        event.stopPropagation();
        event.preventDefault();

        console.log(event.target);
        var file = event!.target!.files![0];
        console.log(file);
        setKeypairFileSelected(file); /// if you want to upload latter
        file.arrayBuffer().then(
            (arrayBuffer) => {
                console.log("Loaded array buffer: ", arrayBuffer);
                setKeypair(getKeypair(arrayBuffer));
            },
            (reason) => {
                console.error("Unable to read file uploaded: ", reason);
            }
        )
        // return () => URL.revokeObjectURL(objectURL);
    }

    return (
        <div>
            <input type='file' id='keypairFile' ref={keypairFile} onChange={onChangeKeypairFile} style={{display: 'none'}}/>
            <Button size='sm' onClick={showOpenKeypairDlg}>upload keypair</Button>
        </div>
    )

}
