import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/chatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem'
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

export default function GroupChatModal({children}) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading,setLoading] = useState(false)
    const [searchResult,setSearchResults] = useState([]);
    
    const toast = useToast();
    const {user,chats,setChats} = ChatState();

    const handleSearch= async(query)=>{
        if(!query)
        {
            return;
        }
        setLoading(true);
        try{
          const config = {
            headers:{
                Authorization:user.token
              }
          };
          const {data} = await axios.get(`http://localhost:5000/api/user?search=${query}`,config);
          setSearchResults(data);
        }
        catch(error)
        {
          toast({
            title: error.message,
            status: 'error',
            duration:2000,
            isClosable: true,
            position: "bottom-left"
          })
        }
        setLoading(false);
    }

    const handleSubmit=async()=>{
      if(!groupChatName || !selectedUsers)
      {
        toast({
          title: 'Please fill all the fields!',
          status: 'warning',
          duration:2000,
          isClosable: true,
          position: "bottom-left"
        })
      }
      else
      {
        try{
          const config = {
            headers:{
                Authorization:user.token
              }
          };
          const {data} = await axios.post('http://localhost:5000/api/chat/group',{
            name:groupChatName,
            users:JSON.stringify(selectedUsers.map((u)=>u._id))
          },config);

          setChats([data,...chats]);
          onClose();
          toast({
            title: 'Group Chat Created!',
            status: 'success',
            duration:2000,
            isClosable: true,
            position: "bottom-left"
          })
        }
        catch(error)
        {
          toast({
            title: error.message,
            status: 'warning',
            duration:2000,
            isClosable: true,
            position: "bottom-left"
          })
        }
      }
    }

    const handleGroup=(userToAdd)=>{
      if(selectedUsers.includes(userToAdd))
      {
        toast({
          title: 'User already added!',
          status: 'warning',
          duration:2000,
          isClosable: true,
          position: "bottom-left"
        })
      }
      else
      {
        setSelectedUsers([...selectedUsers,userToAdd]);
      }
    }

    const handleDelete=(user)=>{
      setSelectedUsers(selectedUsers.filter((users)=>{return users._id!==user._id}));
    }

    return (
        <>
          <span onClick={onOpen}>{children}</span>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader fontSize='35px' fontFamily='Work Sans' display='flex' justifyContent='center'>Create Group Chat</ModalHeader>
              <ModalCloseButton />
              <ModalBody display='flex' flexDirection='column' alignItems='center'>
                <FormControl><Input placeholder='Group Name' mb={3} value={groupChatName} onChange={(e)=>setGroupChatName(e.target.value)}></Input></FormControl>
                <FormControl><Input placeholder='Add Users eg: John, Piyush, Jane' mb={1} onChange={(e)=>handleSearch(e.target.value)}></Input></FormControl>
                <div style={{maxHeight:"300px",overflow:'scroll',width:'100%'}}>
                <Box w='100%' display='flex' flexWrap='wrap'>{selectedUsers.map((user)=>{
                  return <UserBadgeItem key={user._id} user={user} handleFunction={()=>{handleDelete(user)}}/>
                })}</Box>
                {loading?<div>loading...</div>:(searchResult?.map((user)=>{
                  return <UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)}/>
                }))}</div>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme='blue' onClick={handleSubmit}>
                  Create Chat
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
    
}
