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

type AppState = {
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

  return (
    <Box textAlign="center">
      <Grid minH="100vh" p={3}>
        <Box justifySelf="flex-end">
            {/* Todo(ngundotra): replace w metamask icon */}
            <SolanaWallet />
            <ColorModeSwitcher />
        </Box>
        <VStack spacing={10}>
            <Heading size="4xl" justifySelf="top" marginBottom="-30px">
                    S ◎ L 2 S ◎ L
            </Heading>
            <Text fontSize="md">
                Secure messaging on the Solana blockchain
            </Text>
            <EmailUI 
                textMessage={appState.sendState.textMessage} 
                handleMessageChange={handleMessage}
            />
        </VStack>
      </Grid>
    </Box>
  )
}