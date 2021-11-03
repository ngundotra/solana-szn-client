import * as React from "react"
import {
  ChakraProvider,
  theme,
  ColorModeScript,
} from "@chakra-ui/react";
import { SPAEntry } from "./SPAEntry";
import {
  getPhantomWallet,
} from '@solana/wallet-adapter-wallets';
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { getClusterEndpoint } from '../utils/Cluster';

export function App(): React.ReactElement {
  const wallets = [getPhantomWallet()];

  return (
  <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ConnectionProvider endpoint={getClusterEndpoint()}>
        <WalletProvider wallets={wallets} autoConnect>
          <SPAEntry />
        </WalletProvider>
      </ConnectionProvider>
    </ChakraProvider>
  )
}