import { 
    Textarea,
    Input,
    InputGroup,
    VStack,
    Container, 
    InputLeftAddon,
    Text,
    Flex,
    Spacer,
    HStack
} from "@chakra-ui/react";
import React from "react";

type SendMessageTabProps = {
    estimatedFee: number,
    estimatedCommission: number,
    estimatedFeeUSD: number,
    estimatedCommissionUSD: number,
    textMessage: string,
    handleMessageChange: any,
}

export function SendMessageTab(props: SendMessageTabProps) {
    return  (
        <VStack spacing={4}>
            <InputGroup size="sm">
                <InputLeftAddon 
                    rounded="lg"
                    children="check address" />
                <Input
                    flex="1"
                    fontSize="sm"
                    placeholder="recipient address"
                /> 
            </InputGroup>
            <Textarea 
                rounded="lg"
                placeholder="m e s s a g e"
                size="md"
                resize="vertical"
                value={props.textMessage}
                onChange={props.handleMessageChange}
            />
            <Container>
                <Text fontSize="sm" align="left" color="gray.500" flex="1" marginLeft="-12px">
                    Estimated Fee: {props.textMessage.length} fee + {props.estimatedCommission} commission SOL
                </Text>
            </Container>
        </VStack>
    )
}