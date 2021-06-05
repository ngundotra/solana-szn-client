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
} from "@chakra-ui/react";
import { SendMessageTab } from "./SendMessageTab";
import { ReadMessageTab } from "./ReadMessageTab";

export type EmailUIProps = {
    textMessage: string,
    handleMessageChange: any,
}

export function EmailUI(props: EmailUIProps) {
    // const {isOpen, onToggle} = useDisclosure()
    const [tabIndex, setTabIndex] = React.useState(0)
    const sendOpen = (tabIndex === 0)
    const readOpen = (tabIndex === 1)
    return (
        <Container size="container.md" borderWidth={1} p={3} rounded="xl">
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
                                textMessage={props.textMessage}
                                // or just {...props}
                            />
                        </Collapse>
                    </TabPanel>
                    <TabPanel>
                        <Collapse animateOpacity={true} in={readOpen}>
                            <ReadMessageTab address="" />
                        </Collapse>
                    </TabPanel>
                </TabPanels>
            </Tabs> 
        </Container>
    )
}