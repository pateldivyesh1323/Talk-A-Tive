import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast, Spinner } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/chatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';

export default function UpdateGroupChat({ fetchAgain, setFetchAgain }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {user,selectedChat,setSelectedChat} = ChatState();
    const [groupChatName,setGroupChatName] = useState();
    const [search,setSearch] = useState("");
    const [searchResults,setSearchResults] = useState([]);
    const [loading,setLoading] = useState(false);
    const [renameLoading,setRenameLoading] = useState(false);
    const toast = useToast();

    const handleRemove=async(user1)=>{
        if(selectedChat.groupAdmin._id !== user._id && user1._id!==user._id)
        {
            toast({
                title: "Only admin can remove the users!",
                status: 'warning',
                duration:2000,
                isClosable: true,
                position: "bottom-left"
            })
            return;
        }
        setLoading(true);
        try {
            const config={
                headers:{
                    Authorization:user.token,
                }
            }    

            const {data} = await axios.put('http://localhost:5000/api/chat/groupRemove',{chatId:selectedChat._id,userId:user1._id},config);
            user1._id===user._id ? setSelectedChat():setSelectedChat(data);
            setSelectedChat(data);
            setFetchAgain(fetchAgain);
        } catch (error) {
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

    const handleAddUser=async(user1)=>{
        if(selectedChat.users.find((u)=>u._id===user1._id))
        {
            toast({
                title: "User already in the group!",
                status: 'warning',
                duration:2000,
                isClosable: true,
                position: "bottom-left"
            })
            return;
        }
        if(selectedChat.groupAdmin._id !== user._id)
        {
            toast({
                title: "Only admin can add the users!",
                status: 'warning',
                duration:2000,
                isClosable: true,
                position: "bottom-left"
            })
            return;
        }
        setLoading(true);
        try 
        {
            const config={
                headers:{
                    Authorization:user.token,
                }
            }    

            const {data} = await axios.put('http://localhost:5000/api/chat/groupAdd',{chatId:selectedChat._id,userId:user1._id},config);

            setSelectedChat(data);
            setFetchAgain(fetchAgain);
        } catch (error) {
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

    const handleRename=async()=>{
        if(!groupChatName)
        {
            return;
        }
        setRenameLoading(true);
        try {
            const config={
                headers:{
                    Authorization:user.token
                }
            }
            const {data} = await axios.put('http://localhost:5000/api/chat/rename',{
                chatId:selectedChat._id,
                chatName:groupChatName
            },config);

            setSelectedChat(data);
            setFetchAgain(fetchAgain);
        } catch (error) {
            toast({
                title: error.message,
                status: 'error',
                duration:2000,
                isClosable: true,
                position: "bottom-left"
              })
        }
        setRenameLoading(false);
        setGroupChatName("");
    }

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

    return (
        <>
            <IconButton display={{base:'flex'}} icon={<ViewIcon/>} onClick={onOpen}/>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w='100%' display='flex' flexWrap='wrap' pb={3}>{selectedChat.users.map((user)=>{
                            return (<UserBadgeItem key={user._id} user={user} handleFunction={()=>{handleRemove(user)}}/>)
                        })}
                        </Box>
                        <FormControl display='flex'>
                            <Input placeholder="Rename Group" mb={3} value={groupChatName} onChange={(e)=>{setGroupChatName(e.target.value)}}/>
                            <Button variant="solid" colorScheme="teal" ml={1} isLoading={renameLoading} onClick={handleRename}>
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input placeholder="Add user to group" mb={1} onChange={(e)=>{handleSearch(e.target.value)}}></Input>
                        </FormControl>
                        <div style={{maxHeight:"300px",overflow:'scroll',width:'100%'}}>
                        {loading ? (<Spinner size='lg'/>)
                        :(searchResults?.map((user)=>{
                            return <UserListItem key={user._id} user={user} handleFunction={()=>handleAddUser(user)}/>
                        }))}</div>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={()=>{handleRemove(user)}} colorScheme="red">
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
