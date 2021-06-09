import * as React from "react"

import {
    Box,
    Text,
    HStack,
    Spacer,
    // VStack,
    // Code,
    // Link,
    Heading,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { EmailUI, EmailUIProps } from "./EmailUI";
import { SolanaWallet } from "./SolanaWallet";
import { Wallet } from "@project-serum/sol-wallet-adapter";
import { signInWithSollet } from "./Wallet";
import { SolBox } from "./Sol2SolInstructions";

export type AppState = {
    walletState: WalletState,
    solState: SolState,
    sendState: {
        textMessage: string,
        recipientAddress: string,
    }
}

export type WalletState = {
    wallet: Wallet,
    balance: number,
}

export type SolState = {
    solBoxes: Array<SolBox>,
}

export function SPAEntry() {
  const [appState, setAppState] = React.useState({
    sendState: {
        textMessage: "",
        recipientAddress: "",
    },
    solState: {
        solBoxes: Array<SolBox>(),
    },
    walletState: { 
        wallet: null,
        balance: -1,
    },
  })

  const handleMessage = (e) => {
    const newState: AppState = {
        sendState: {
            textMessage: e.target.value,
            recipientAddress: appState.sendState.recipientAddress,
        },
        solState: appState.solState,
        walletState: appState.walletState,
    }
    setAppState(newState)
  }

  const handleRecipientChange = (e) => {
    const newState: AppState = {
        sendState: {
            textMessage: appState.sendState.textMessage,
            recipientAddress: e.target.value,
        },
        solState: appState.solState,
        walletState: appState.walletState,
    }
    setAppState(newState)
  }

  const attachWallet = () => signInWithSollet(appState, setAppState);

  return (
    <Box textAlign="center">
        <Box>
            <HStack>
                <Spacer />
                <HStack>
                <SolanaWallet walletBalance={appState.walletState.balance} handleClick={attachWallet} />
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
                textMessage={appState.sendState.textMessage} 
                handleMessageChange={handleMessage}
                recipientAddress={appState.sendState.recipientAddress}
                handleRecipientChange={handleRecipientChange}
                solState={appState.solState}
                walletState={appState.walletState}
            />
        </Box>
    </Box>
  )
}