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
    TableCaption,
} from "@chakra-ui/react";
import { RepeatIcon, SmallAddIcon } from "@chakra-ui/icons";

type ReadMessageTabProps = {
    address: string, // idk, probably get with DOM?
}

export function ReadMessageTab(prop: ReadMessageTabProps) {

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
                    <Tr>
                        <Td>0xRickAstley</Td>
                        <Td>Never going to give you up...</Td>
                        <Td>Yesterday</Td>
                    </Tr>
                    <Tr>
                        <Td>0xDefinitelyRick</Td>
                        <Td>Never going to let you down...</Td>
                        <Td>Yesterday</Td>
                    </Tr>
                    <Tr paddingBottom="10px">
                        <Td>0xNotNoah</Td>
                        <Td>..or hurt you..</Td>
                        <Td>Yesterday</Td>
                    </Tr>
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