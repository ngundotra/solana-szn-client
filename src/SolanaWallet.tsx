
import * as React from "react";
import {
    Button, propNames,
} from "@chakra-ui/react";
import {
    AtSignIcon
} from "@chakra-ui/icons";

type WalletProps = {
    handleClick: any,
}

export function SolanaWallet(props: WalletProps) {
    return (
        <Button onClick={props.handleClick} size="sm"><AtSignIcon size="md"/></Button>
    )
}