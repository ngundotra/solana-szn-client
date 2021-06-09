
import * as React from "react";
import {
    Button, HStack, Text,
} from "@chakra-ui/react";
import {
    AtSignIcon
} from "@chakra-ui/icons";
import {
    getWalletBalance
} from "./Wallet";
import Wallet from '@project-serum/sol-wallet-adapter';
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

type WalletProps = {
    handleClick: any,
    walletBalance: number,
}

export function SolanaWallet(props: WalletProps) {
    return (
        <HStack>
            <Text>{(props.walletBalance >= 0) ? `Balance: ${props.walletBalance / LAMPORTS_PER_SOL} S◎L` : "click to connect wallet ->"  }</Text>
            <Button onClick={props.handleClick} size="sm"><AtSignIcon size="md"/></Button>
        </HStack>
    )
}