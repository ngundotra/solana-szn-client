import * as React from "react";
import {
    InputGroup,
    InputLeftAddon,
    Input,
    Box,
    Alert,
    useToast,
} from "@chakra-ui/react";
import { checkForEmailAddress } from "./SolanaUtils";

type RecipientAddressProps = {
    recipientAddress: string,
    handleRecipientChange: any,
    walletAddress: string,
}

export function RecipientBox(props: RecipientAddressProps) {
    // Todo(ngundotra): figure out why custom color schemes aren't loading
    const toast = useToast();

    async function validateRecipientAddress(address: string) {
        address = address.trim();
        var isValid = address.length >= 32
            || address.length <= 44;
        if (isValid) {
            isValid = await checkForEmailAddress(address);
        }
        if (!isValid) {
            // throw bad toast!
            toast({
                position: "top",
                isClosable: true,
                render: () => (
                    <Alert rounded="lg" bg="red.400" >
                        Invalid address: {address}
                    </Alert>
                )
            })
        } else {
            // throw good toast :)
            toast({
                position: "top",
                isClosable: true,
                render: () => (
                    <Alert rounded="lg" bg="green.200">
                        You're good to go!
                    </Alert>
                )
            })
        }
        console.log("Recipient address is: ", address);
    }

    return (
        <InputGroup size="sm">
            <InputLeftAddon 
                rounded="lg"
                children="check address"
                onClick={() => validateRecipientAddress(props.recipientAddress)}
            />
            <Input
                flex="1"
                fontSize="sm"
                // placeholder="recipient address"
                defaultValue={props.walletAddress}
                // value={props.walletAddress ?? props.recipientAddress}
                onChange={props.handleRecipientChange}
            /> 
        </InputGroup>
    )
}