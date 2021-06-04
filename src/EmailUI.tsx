import {
    Container,
    Tab,
    Tabs,
    TabList,
    TabPanel,
    TabPanels,
    Text,
} from "@chakra-ui/react";
import { SendMessagePane } from "./SendPane";

export function EmailUI() {
    return (
        <Container size="container.md">
            <Tabs variant="soft-rounded" colorScheme="orange">
                <TabList>
                    <Tab>Send</Tab>
                    <Tab>Read</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <SendMessagePane />
                    </TabPanel>
                    <TabPanel>
                        <Text>To be composed</Text>
                    </TabPanel>
                </TabPanels>
            </Tabs> 
        </Container>
    )
}