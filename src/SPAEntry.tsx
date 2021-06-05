import * as React from "react"

import {
    ChakraProvider,
    Box,
    Text,
    Link,
    VStack,
    Code,
    Grid,
    Heading,
    Spacer,
    Button,
    theme,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Logo } from "./Logo";
import { EmailUI } from "./EmailUI";
import { SolanaWallet } from "./SolanaWallet";

export function SPAEntry() {
  const [value, setValue] = React.useState("")
  const handleMessage = (e) => setValue(e.target.value)

  return (
    <Box textAlign="center">
      <Grid minH="100vh" p={3}>
        <Box justifySelf="flex-end">
            {/* Todo(ngundotra): replace w metamask icon */}
            <SolanaWallet />
            <ColorModeSwitcher />
        </Box>
        <VStack spacing={20}>
          <Heading size="4xl" justifySelf="top" marginBottom="-50px">
              S ◎ L 2 S ◎ L
          </Heading>
          <Text fontSize="md">
            Secure messaging on the Solana blockchain
          </Text>
          <EmailUI textMessage={value} handleMessageChange={handleMessage}/>
          <Spacer minH="200px"/>
        </VStack>
      </Grid>
    </Box>
  )
}