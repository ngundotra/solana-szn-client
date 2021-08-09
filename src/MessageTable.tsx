
import * as React from "react"
import {
    Text,
    VStack,
    HStack,
    Spacer,
    Button,
    Container,
    Circle,

    // Table for reading messages
    Table,
    Tr,
    Td,
    Thead,
    Th,
    Tbody,
} from "@chakra-ui/react";
import {
    SolMessage
} from './Sol2SolInstructions';
import {
    PublicKey
} from '@solana/web3.js';

export type MessageProps = {
    messageData: SolMessage[]
};

function renderMessageData(messages: Array<SolMessage>) {
    return messages.map((solMessage, index) => {
        const fromAddress = new PublicKey(solMessage.sender);
        const message = new String(solMessage.message);
        //const {fromAddress, message, timeSent} = solMessage;
        return (
            <Tr key={index}>
                <Td>{fromAddress.toString()}</Td>
                <Td>{message}</Td>
                <Td>{"no time"}</Td>
            </Tr>
        )
    })
}

export function MessageTable(props: MessageProps) {
    return (
    <Table variant="striped"> 
        <Thead>
            <Tr>
                <Th>From</Th>
                <Th>Message</Th>
                <Th>Timesent</Th>
            </Tr>
        </Thead>
        <Tbody>
            {renderMessageData(props.messageData)}
        </Tbody>
    </Table> );
};