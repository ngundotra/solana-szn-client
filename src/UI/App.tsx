import * as React from "react"
import {
  ChakraProvider,
  theme,
  Box,
  HStack,
  Spacer,
  ColorModeScript,
} from "@chakra-ui/react";
import { SPAEntry } from "./SPAEntry";
import {
  getPhantomWallet,
} from '@solana/wallet-adapter-wallets';
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { getClusterEndpoint } from '../utils/Cluster';
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

export function App(): React.ReactElement {
  const wallets = [getPhantomWallet()];

  return (
    <ConnectionProvider endpoint={getClusterEndpoint()}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <SPAEntry />
          </ChakraProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}