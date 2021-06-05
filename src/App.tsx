import * as React from "react"
import {
  ChakraProvider,
  theme,
  ColorModeScript,
} from "@chakra-ui/react";
import { SPAEntry } from "./SPAEntry";

export const App = (): React.ReactElement => (
  <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <SPAEntry />
  </ChakraProvider>
)