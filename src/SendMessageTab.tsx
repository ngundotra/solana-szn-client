import { 
    Textarea,
    Input,
    InputGroup,
    VStack,
    Container, 
    InputLeftAddon,
    Text,
    Button,
    HStack
} from "@chakra-ui/react";
import React from "react";

type SendMessageTabProps = {
    textMessage: string,
    handleMessageChange: any,
}

// estimatedFee: number,
// estimatedCommission: number,
// estimatedFeeUSD: number,
// estimatedCommissionUSD: number,

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
                <HStack marginLeft="-12px" marginRight="-12px">
                    <Text fontSize="sm" align="left" color="gray.500" flex="1" >
                        Estimated Fee: {props.textMessage.length} fee + {1} commission SOL
                    </Text>
                    <Button rounded="lg" size="sm">Pay</Button>
                </HStack>
            </Container>
        </VStack>
    )
}