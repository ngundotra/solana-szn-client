import * as React from "react"
import {
    // Formatting / sizing
    Container,
    // Animation
    Collapse,
    // Rendering tabs
    Tab,
    Tabs,
    TabList,
    TabPanel,
    TabPanels,
    useProps,
} from "@chakra-ui/react";
import { SendMessageTab } from "./SendMessageTab";
import { ReadMessageTab } from "./ReadMessageTab";
import { SolState, WalletState, SendState } from "./SPAEntry";

export type EmailUIProps = {
    handleMessageChange: any,
    handleRecipientChange: any,
    handleSolStateChange: any,
    solState: SolState,
    walletState: WalletState,
    sendState: SendState,
}

export function EmailUI(props: EmailUIProps) {
    // const {isOpen, onToggle} = useDisclosure()
    const [tabIndex, setTabIndex] = React.useState(0)
    const sendOpen = (tabIndex === 0)
    const readOpen = (tabIndex === 1)
    return (
        <Container borderWidth={1} p={3} rounded="xl" minWidth="md">
            <Tabs 
                variant="soft-rounded" 
                colorScheme="orange"
                onChange={(i) => setTabIndex(i)}
            >
                <TabList paddingX={4}>
                    <Tab>Send</Tab>
                    <Tab>Read</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Collapse animateOpacity={true} in={sendOpen}>
                            <SendMessageTab
                                handleMessageChange={props.handleMessageChange}
                                handleRecipientChange={props.handleRecipientChange}
                                handleSolStateChange={props.handleSolStateChange}
                                solState={props.solState}
                                sendState={props.sendState}
                                walletState={props.walletState}
                                // or just {...props}
                            />
                        </Collapse>
                    </TabPanel>
                    <TabPanel>
                        <Collapse animateOpacity={true} in={readOpen}>
                            <ReadMessageTab address={props.walletState.wallet?.publicKey.toString() ?? ""} />
                        </Collapse>
                    </TabPanel>
                </TabPanels>
            </Tabs> 
        </Container>
    )
}