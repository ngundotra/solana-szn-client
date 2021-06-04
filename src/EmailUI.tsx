import * as React from "react"
import {
    // Formatting / sizing
    Container,
    Text,
    // Animation
    Collapse,
    useDisclosure,
    // Rendering tabs
    Tab,
    Tabs,
    TabList,
    TabPanel,
    TabPanels,
} from "@chakra-ui/react";
import { SendMessageTab } from "./SendMessageTab";
import { isJsxOpeningElement } from "typescript";

export function EmailUI() {
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
                            <SendMessageTab />
                        </Collapse>
                    </TabPanel>
                    <TabPanel>
                        <Collapse animateOpacity={true} in={readOpen}>
                            <Text>To be composed</Text>
                        </Collapse>
                    </TabPanel>
                </TabPanels>
            </Tabs> 
        </Container>
    )
}