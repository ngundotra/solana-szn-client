import * as React from "react"

import {
    Box,
    Text,
    VStack,
    // Code,
    // Link,
    Grid,
    SimpleGrid,
    Heading,
    Spacer,
    StatHelpText,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { EmailUI, EmailUIProps } from "./EmailUI";
import { SolanaWallet } from "./SolanaWallet";
import { Wallet } from "@project-serum/sol-wallet-adapter";
import { signInWithSollet } from "./SolanaWallet.ts";

export type AppState = {
    walletState: Wallet,
    sendState: {
        textMessage: string,
    }
}

export function SPAEntry() {
  const [appState, setAppState] = React.useState({
    sendState: {
        textMessage: "",
    },
    walletState: null,
  })

  const handleMessage = (e) => {
    const newState: AppState = {
        sendState: {
            textMessage: e.target.value,
        },
        walletState: appState.walletState,
    }
    setAppState(newState)
  }

  const attachWallet = () => signInWithSollet(appState, setAppState);

  return (
    <Box textAlign="center">
        <Box justifySelf="flex-end">
            {/* Todo(ngundotra): replace w metamask icon */}
            <SolanaWallet handleClick={attachWallet} />
            <ColorModeSwitcher />
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
            />
        </Box>
    </Box>
  )
}