import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/chatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import ProfileModal from './ProfileModal';
import { getSender, getSenderFull } from '../../config/chatLogics';
import UpdateGroupChat from './UpdateGroupChat';
import axios from 'axios';
import './style.css';
import ScrollableChat from './ScrollableChat';

export default function SingleChat({fetchAgain,setFetchAgain}) {
    const toast = useToast();
    const {user,selectedChat,setSelectedChat} = ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage,setNewMessage] = useState("");
    
    const fetchMessages=async()=>{
        if(!selectedChat)
        {
            return;
        }
        setLoading(true);
        try {
            const config={
                headers:{
                    Authorization:user.token
                }
            };
            const {data}=await axios.get(`http://localhost:5000/api/message/${selectedChat._id}`,config);
            setMessages(data);
            setLoading(false);
        } catch (error) {
            toast({
                title:error.message,
                status:"Error",
                duration:2000,
                isClosable:true,
                position:"bottom-left"
            })
        }
        setLoading(false);
    }

    const sendMessage=async(e)=>{
        if(e.key==="Enter" && newMessage)
        {
            setNewMessage("");
            try {
                const config={
                    headers:{
                        "Content-type":"application/json",
                        Authorization:user.token
                    }
                };
                const {data}=await axios.post('http://localhost:5000/api/message',
                {
                    content:newMessage,
                    chatId:selectedChat._id
                },
                config);
                setMessages([...messages,data]);
                
            } catch (error) {
                toast({
                    title:error.message,
                    status:"Error",
                    duration:2000,
                    isClosable:true,
                    position:"bottom-left"
                })
            }
        }
    }
    const typingHandler=(e)=>{
        setNewMessage(e.target.value);
        // Typing Indicator Logic
    }

    useEffect(() => {
        fetchMessages();
    }, [selectedChat])
    
  
    return (<>
        {selectedChat ? 
        (<><Text fontSize={{base:"28px", md:"30px"}} pb={3} px={2} w="100%" fontFamily="Work sans" display="flex" justifyContent={{base:"space-between"}} alignItems="center">
            <IconButton display={{base:"flex", md:"none"}} icon={<ArrowBackIcon/>} onClick={()=>{setSelectedChat("")}}/>
            {!selectedChat.isGroupChat?(
            <>
            {getSender(user,selectedChat.users)}
            <ProfileModal user={getSenderFull(user,selectedChat.users)} />
            </>)
            :(<>
            {selectedChat.chatName.toUpperCase()}
            {<UpdateGroupChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}/>}
            </>)}
        </Text>
        <Box display="flex" flexDir='column' justifyContent='flex-end' p={3} bg='#E8E8E8' w='100%' h='100%' borderRadius='lg' overflowY='hidden'>
            {loading?(
                <Spinner size='xl' w={10} h={10} alignSelf="center" margin="auto"/>):(
                <div className="messages" >
                    <ScrollableChat messages={messages}/>
                </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                <Input variant="filled" bg="#E0E0E0" placeholder='Enter a message....' value={newMessage} onChange={typingHandler}></Input>
            </FormControl>
        </Box>
        </>)
        :(<><Box display="flex" alignItems='center' justifyContent="center" h='100%'>
        <Text fontSize='3xl' pb={3} fontFamily="Work sans">Click on a user to start chatting.</Text></Box></>)}
    </>
  )
}
