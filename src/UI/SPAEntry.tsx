import * as React from "react"

import {
    Box,
    Text,
    HStack,
    Spacer,
    Heading,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { EmailUI, EmailUIProps } from "./EmailUI";
import { SolanaWallet } from "./SolanaWallet";
import { Wallet } from "@project-serum/sol-wallet-adapter";
import { signInWithSollet } from "../utils/Wallet";
import { getMinBalanceForMessage, SolBox } from "../utils/Sol2SolInstructions";

export type WalletState = {
    wallet: Wallet,
    balance: number,
}

export type SolState = {
    solBoxes: Array<SolBox>,
}

export function SPAEntry() {
    const [walletState, setWalletState] = React.useState({
        wallet: null,
        balance: -1,
    });
    const [solState, setSolState] = React.useState({
        solBoxes: Array<SolBox>(),
    });

    const attachWallet = () => signInWithSollet(walletState, setWalletState);

    return (
        <Box textAlign="center">
            <Box>
                <HStack>
                    <Spacer />
                    <HStack>
                    <SolanaWallet walletBalance={walletState.balance} handleClick={attachWallet} />
                    <ColorModeSwitcher />
                    </HStack>
                    <Spacer />
                </HStack>
            </Box>
            <Box marginTop="100px">
                <Heading size="4xl" justifySelf="top" marginBottom="-30px">
                        S ◎ L 2 S ◎ L
                </Heading>
            </Box>
            <Box marginTop="50px">
                <Text fontSize="md">
                    Secure messaging on the Solana blockchain
                </Text>
            </Box>
            <Box marginTop="50px"> 
                <EmailUI 
                    handleSolStateChange={setSolState}
                    solState={solState}
                    walletState={walletState}
                />
            </Box>
            <Box minHeight="20" />
        </Box>
    )
}