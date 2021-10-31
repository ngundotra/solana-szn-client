import React, { useEffect } from "react";
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
import { checkForInbox } from "../utils/SolanaUtils";
import { createSolBox, createNewMessage, getNumberOfFreeSlots, SolBox } from "../utils/Sol2SolInstructions";
import { SolState, WalletState, SendState } from "./SPAEntry";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { trimTxId, showTransactionSent, showTransactionSucceeded, showTransactionFailed } from "./TransactionDialog";
import { getMinBalanceForMessage } from "../utils/Sol2SolInstructions";


type SendMessageTabProps = {
    handleSolStateChange: any,
    solState: SolState,
    walletState: WalletState,
}

export function SendMessageTab(props: SendMessageTabProps) {
    const [textMessage, setTextMessage] = React.useState<string>();
    const [recipientAddress, setRecipientAddress] = React.useState<string>();
    const [estimatedFee, setEstimatedFee] = React.useState<number>(0);

    const toast = useToast();

    useEffect(() => {
        getMinBalanceForMessage(textMessage ?? "").then(
            (estimatedFee: number) => {
                console.log("Retrieved min balance for message:", estimatedFee);
                setEstimatedFee(estimatedFee);
            }
        )
    }, [textMessage]);
    

    return  (
        <VStack spacing={4}>
            <RecipientBox 
                recipientAddress={recipientAddress ?? ""}
                handleRecipientChange={(e) => {setRecipientAddress(e.target.value)}}
                walletAddress={props.walletState.wallet ? props.walletState.wallet.publicKey : ""}
            />
            <Textarea 
                rounded="lg"
                placeholder="m e s s a g e"
                size="md"
                resize="vertical"
                onChange={(e) => {setTextMessage(e.target.value)}}
            />
            <Container>
                <HStack marginLeft="-12px" marginRight="-12px">
                    <Text fontSize="sm" align="left" color="gray.500" flex="1" >
                        Estimated Fee: {(estimatedFee / LAMPORTS_PER_SOL).toFixed(9)} S◎L (~{(estimatedFee / LAMPORTS_PER_SOL*40).toFixed(2)} USD)
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
                            let recipientKey = new PublicKey(recipientAddress ?? "");
                            if (recipientKey === undefined) {
                                toast({
                                    position: "top",
                                    isClosable: false,
                                    title: "Invalid recipient address",
                                    status: "error",
                                });
                                return;
                            }
                            console.log("Starting to write message!");
                            createNewMessage(
                                props.walletState.wallet, 
                                recipientKey,
                                props.solState.solBoxes[0].nextBox, // hack: maps to itself for now
                                textMessage ?? "",
                                (txid: string) => {
                                    showTransactionSent(toast, null, txid);
                                },
                                (txid) => {
                                    showTransactionSucceeded(toast, null, txid);
                                }
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
                            createSolBox(
                                props.walletState.wallet,
                                (txid: string) => toast({
                                    title: "Confirmed transaction",

                                }),
                                (reason: any) => 
                                    showTransactionFailed(toast, reason as string, null)
                                ).then(
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