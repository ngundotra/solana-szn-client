import { 
    Textarea,
    Input,
    InputGroup,
    VStack,
    Container, 
    InputLeftAddon,
    Box,
    Flex,
    Spacer,
    HStack
} from "@chakra-ui/react";
import React from "react";

export function SendMessagePane() {
    return  (
        <Container width="container.md">
            <VStack spacing={2.5}>
                <InputGroup size="sm">
                    <InputLeftAddon 
                        rounded="lg"
                        children="check address" />
                    <Input
                        flex="1"
                        size='sm'
                        placeholder="recipient address"
                    /> 
                </InputGroup>
                <Textarea 
                rounded="lg"
                placeholder="Long message"
                size="sm"
                resize="vertical"
                />
            </VStack>
        </Container>
    )
}