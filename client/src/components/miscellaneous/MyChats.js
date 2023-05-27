import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import {AddIcon} from '@chakra-ui/icons';
import React, { useEffect } from 'react'
import { ChatState } from '../../Context/chatProvider';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import {getSender} from '../../config/chatLogics' 
import GroupChatModal from './GroupChatModal';

export default function MyChats({fetchAgain}) {
  const { user, setSelectedChat, chats, setChats,selectedChat } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: user.token
        }
      };

      const { data } = await axios.get('http://localhost:5000/api/chat', config);
      setChats(data);
    }
    catch (error) {
      toast({
        title: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: 'bottom-left'
      })
    }
  }

  useEffect(() => {
    fetchChats();
  }, [fetchAgain])

  return (
    <Box  display={{base:selectedChat?'none':'flex',md:'flex'}} flexDirection='column' alignItems='center' p={3} bg='white' w={{base:'100%',md:'31%'}} borderRadius='lg' borderWidth='1px'>
      <Box pb={3} px={3} fontSize={{base:'28px',md:'30px'}} fontFamily='Work Sans' display='flex' w='100%' justifyContent='space-between' alignItems='center' color='black'>
        My Chats
        <GroupChatModal><Button d='flex' fontSize={{base:'17px',md:'10px',lg:'17px'}} rightIcon={<AddIcon/>}>New Group Chat</Button></GroupChatModal>
      </Box>
      <Box display='flex' flexDir='column' p={3} bg='F8F8F8' w='100%' h='100%' borderRadius='lg' overflowY='hidden'>
        {chats?(
          <Stack overflowY='scroll' >
            {chats.map((chat)=>{
              return (<Box onClick={()=>{setSelectedChat(chat)}} cursor='pointer' bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'} color={selectedChat === chat ? 'white' : 'black'} px={3} py={2} borderRadius='lg' key={chat._id}><Text>{!chat.isGroupChat?(getSender(user,chat.users)):(chat.chatName)}</Text></Box>)
            })}
          </Stack>):
          (<ChatLoading/>)}
      </Box>
    </Box>
  )
}
