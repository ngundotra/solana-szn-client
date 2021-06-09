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
import { checkForInbox, payForMessage } from "./SolanaUtils";
import { createSolBox, getNumberOfFreeSlots, SolBox } from "./Sol2SolInstructions";
import { SolState, WalletState, SendState } from "./SPAEntry";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

type SendMessageTabProps = {
    handleMessageChange: any,
    handleRecipientChange: any,
    handleSolStateChange: any,
    solState: SolState,
    walletState: WalletState,
    sendState: SendState,
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
                recipientAddress={props.sendState.recipientAddress}
                handleRecipientChange={props.handleRecipientChange}
            />
            <Textarea 
                rounded="lg"
                placeholder="m e s s a g e"
                size="md"
                resize="vertical"
                value={props.sendState.textMessage}
                onChange={props.handleMessageChange}
            />
            <Container>
                <HStack marginLeft="-12px" marginRight="-12px">
                    <Text fontSize="sm" align="left" color="gray.500" flex="1" >
                        Estimated Fee: {(props.sendState.estimatedSolFee / LAMPORTS_PER_SOL).toFixed(9)} S◎L (~{(props.sendState.estimatedSolFee / LAMPORTS_PER_SOL*40).toFixed(2)} USD)
                    </Text>
                    <Button 
                        rounded="lg" 
                        size="sm"
                        onClick={() => {
                            payForMessage(props.sendState.textMessage, props.sendState.recipientAddress).then(
                                (success) => {
                                    if (!success) {
                                        toast({
                                            position: "top",
                                            isClosable: true,
                                            render: () => (
                                                <Alert rounded="lg" bg="red.400">
                                                    <Container>
                                                    <HStack>
                                                        <Text>No solBox configured</Text>
                                                        <Button 
                                                            rounded="xl" 
                                                            justifySelf="flex-end"
                                                            onClick={()=>console.log("Todo[ngundotra]Pay for message...")}
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
                        Pay & Send
                    </Button>
                </HStack>
            </Container>
            <Container>
                <HStack marginLeft="-12px" marginRight="-12px">
                    <Text fontSize="sm" align="left" color="gray.500" flex="1" >
                        S◎L messages left: {getNumberOfFreeSlots(props.solState.solBoxes)}
                    </Text>
                    <Button 
                        rounded="lg" 
                        size="sm"
                        onClick={() => {
                            createSolBox(props.walletState.wallet).then(
                                () => {
                                    checkForInbox(props.walletState.wallet).then(
                                        (solBoxes: Array<SolBox>) => {
                                            console.log("Completed checking for inboxes!")
                                            props.handleSolStateChange({solBoxes: solBoxes});
                                        },
                                    )
                                }
                            );
                    }}>
                        Add 20 Messages
                    </Button>
                </HStack>
            </Container>
        </VStack>
    )
}