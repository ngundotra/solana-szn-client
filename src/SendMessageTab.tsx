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
import { createSolBox, createNewMessage, getNumberOfFreeSlots, SolBox } from "./Sol2SolInstructions";
import { SolState, WalletState, SendState } from "./SPAEntry";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

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
                walletAddress={props.walletState.wallet ? props.walletState.wallet.publicKey : ""}
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
                            if (props.solState === undefined || props.solState.solBoxes.length === 0) {
                                toast({
                                    position: "top",
                                    isClosable: true,
                                    render: () => (
                                        <Alert rounded="lg" bg="red.400">
                                            <Text>No solBoxes configured. Please add below</Text>
                                        </Alert>
                                    )
                                });
                                return;
                            }
                            let recipientAddress = new PublicKey(props.sendState.recipientAddress);
                            if (recipientAddress === undefined) {
                                toast({
                                    position: "top",
                                    isClosable: true,
                                    render: () => (
                                        <Alert rounded="lg" bg="red.400">
                                            <Text>Invalid recipient address, please enter another</Text>
                                        </Alert>
                                    )
                                });
                                return;
                            }
                            console.log("Starting to write message!");
                            createNewMessage(
                                props.walletState.wallet, 
                                recipientAddress,
                                props.solState.solBoxes[0].nextBox, // hack: maps to itself for now
                                props.sendState.textMessage
                            );
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