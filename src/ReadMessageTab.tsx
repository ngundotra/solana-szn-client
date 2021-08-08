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
import { RepeatIcon, SmallAddIcon } from "@chakra-ui/icons";
import { filterMessageDataForAddress } from './SolanaUtils';
import {
    SolMessage
} from './Sol2SolInstructions';
import {
    PublicKey
} from '@solana/web3.js';

type ReadMessageTabProps = {
    address: string, // idk, probably get with DOM?
}

type SolMessageFields = {
    fromAddress: string,
    message: string,
    timeSent: string,
}

let solMessagesForWallet: Array<SolMessage> = [];

export function ReadMessageTab(prop: ReadMessageTabProps) {
    let extraData = filterMessageDataForAddress(prop.address);
    extraData.then(
        (solMessages: SolMessage[]) => solMessagesForWallet = solMessages,
    );
    
    const messageData: SolMessage[] = solMessagesForWallet;
    
    // messageData.then((value: LedgerAccountData[]) => renderMessageData(messages));
    // const messageData = [
    //     { 
    //         fromAddress: "0xRickAstley",
    //         message: "Never going to give you up...",
    //         timeSent: "Yesterday"
    //     },
    //     {
    //         fromAddress: "0xDefinitelyRick",
    //         message: "Never going to let you down...",
    //         timeSent: "Yesterday"
    //     },
    //     {
    //         fromAddress: "0xNotNoah",
    //         message: "..or hurt you..",
    //         timeSent: "Yesterday"
    //     },
    // ];

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
    
    return (
        <VStack spacing={4}>
            <Table variant="striped">
                <Thead>
                    <Tr>
                        <Th>From</Th>
                        <Th>Message</Th>
                        <Th>Timesent</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {renderMessageData(messageData)}
                </Tbody>
            </Table>
            <Spacer minHeight="20px"/>
            <Container>
                <HStack align="center" spacing={3}>
                    <Circle size="35px" overflow="hidden">
                        <Button>
                            <SmallAddIcon />
                        </Button> 
                    </Circle>
                    <Text>
                        Add more addresses
                    </Text>
                    <Spacer />
                    <Circle size="35px" overflow="hidden">
                        <Button>
                            <RepeatIcon />
                        </Button> 
                    </Circle>
                </HStack>
            </Container>
        </VStack>
    )
}