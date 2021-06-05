import * as React from "react"
import {
  ChakraProvider,
  theme,
} from "@chakra-ui/react";
import { SPAEntry } from "./SPAEntry";

export const App = () => (
  <ChakraProvider theme={theme}>
    <SPAEntry />
  </ChakraProvider>
)