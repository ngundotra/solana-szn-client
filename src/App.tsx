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
  InputGroup,
  Stack,
  Input,
  InputLeftAddon,
  theme,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Logo } from "./Logo";
import { EmailUI } from "./EmailUI";

// export const App = () => (
//   <ChakraProvider theme={theme}>
//     <Box textAlign="center" fontSize="xl">
//       <Grid minH="100vh" p={3}>
//         <ColorModeSwitcher justifySelf="flex-end" />
//         <VStack spacing={8}>
//           <Logo h="40vmin" pointerEvents="none" />
//           <Text>
//             Edit <Code fontSize="xl">src/App.tsx</Code> and save to reload.
//           </Text>
//           <Link
//             color="teal.500"
//             href="https://chakra-ui.com"
//             fontSize="2xl"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Learn Chakra
//           </Link>
//         </VStack>
//       </Grid>
//     </Box>
//   </ChakraProvider>
// )
export const App = () => (
  <ChakraProvider theme={theme}>
    <Box textAlign="center">
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end"/>
        <VStack spacing={20}>
          <Heading size="4xl" justifySelf="top" marginBottom="-50px">
              S ◎ L 2 S ◎ L
          </Heading>
          <Text fontSize="md">
            Secure messaging on the Solana blockchain
          </Text>
          <EmailUI />
          {/* <Stack spacing={4}>
            <InputGroup>
              <InputLeftAddon children="Send" />
              <Input placeholder="message" />
            </InputGroup>
          </Stack> */}  
        </VStack>
      </Grid>
    </Box>
  </ChakraProvider>
)