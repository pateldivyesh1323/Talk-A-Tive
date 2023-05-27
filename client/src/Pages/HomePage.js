import React from 'react'
import { Container, Box, Text, TabList, Tabs, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Signup from '../components/Authentication/Signup'
import Login from '../components/Authentication/Login'

export default function HomePage() {
    return (
        <Container maxW='xl' centerContent>
            <Box
                d='flex'
                justifyContent='center'
                alignItems='center'
                p={3}
                bg="white"
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px">
                <Text fontSize="4xl" fontFamily='work sans' color="black" textAlign="center">Talk-A-Tive</Text>
            </Box>
            <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px" color="black">
                <Tabs variant='soft-rounded' colorScheme='gray'>
                    <TabList md="1em">
                        <Tab width="50%">Login</Tab>
                        <Tab width="50%">Signup</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>{<Login />}</TabPanel>
                        <TabPanel>{<Signup />}</TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}
