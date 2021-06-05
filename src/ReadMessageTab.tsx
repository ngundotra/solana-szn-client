import { Tab } from "@chakra-ui/tabs";
import * as React from "react"
import {
    Box,
    Text,
    VStack,
    HStack,
    Spacer,
    Button,

    // Table for reading messages
    Table,
    Tfoot,
    Tr,
    Td,
    Thead,
    Th,
    Tbody,
    TableCaption,
} from "@chakra-ui/react";

type ReadMessageTabProps = {
    address: string, // idk, probably get with DOM?
}

export function ReadMessageTab(prop: ReadMessageTabProps) {

    return (
        <VStack spacing={4}>
            <Table variant="striped">
                <TableCaption>Your Email Messages</TableCaption>
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
            <HStack align="center">
                <Button size="sm">
                    +
                </Button>
                <Text>
                    Add more addresses
                </Text>
                <Spacer />
            </HStack>
        </VStack>
    )
}