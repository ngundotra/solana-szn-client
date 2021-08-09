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
    MessageTable
} from './MessageTable';
import { useState } from "react";

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
    const [messageData, setMessageData] = useState([])
    let extraData = filterMessageDataForAddress(prop.address)
    extraData.then(
        (solMessages: SolMessage[]) => { if (messageData.length != solMessages.length) { setMessageData(solMessages) } },
    )
    // const messageData = [];
     
    return (
        <VStack spacing={4}> 
            <MessageTable messageData={messageData}/>
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