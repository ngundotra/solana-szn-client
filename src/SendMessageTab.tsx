import * as React from "react";
import { 
    Textarea,
    VStack,
    Container, 
    Text,
    Alert,
    Button,
    HStack,
    useToast,
} from "@chakra-ui/react";
import { RecipientBox } from "./RecipientBox";
import { payForMessage, payForSolBox } from "./SolanaUtils";

type SendMessageTabProps = {
    textMessage: string,
    handleMessageChange: any,
    recipientAddress: string,
    handleRecipientChange: any,
}

// estimatedFee: number,
// estimatedCommission: number,
// estimatedFeeUSD: number,
// estimatedCommissionUSD: number,

export function SendMessageTab(props: SendMessageTabProps) {
    const toast = useToast();

    return  (
        <VStack spacing={4}>
            <RecipientBox 
                recipientAddress={props.recipientAddress}
                handleRecipientChange={props.handleRecipientChange}
            />
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
                    <Button 
                        rounded="lg" 
                        size="sm"
                        onClick={() => {
                            payForMessage(props.textMessage, props.recipientAddress).then(
                                (success) => {
                                    if (!success) {
                                        toast({
                                            position: "top",
                                            render: () => (
                                                <Alert rounded="lg" bg="red.400">
                                                    <Container>
                                                    <HStack>
                                                        <Text>No solBox configured</Text>
                                                        <Button 
                                                            rounded="xl" 
                                                            justifySelf="flex-end"
                                                            onClick={()=>payForSolBox}
                                                        >
                                                            Fix
                                                        </Button>
                                                    </HStack>
                                                    </Container>
                                                </Alert>
                                            )
                                        })
                                    } else {
                                        console.log("paid successfully");
                                    }
                                }
                            )
                    }}>
                        Pay
                    </Button>
                </HStack>
            </Container>
        </VStack>
    )
}