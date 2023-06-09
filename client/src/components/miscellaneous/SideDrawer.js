import { Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure ,useToast} from '@chakra-ui/react';
import React, { useState } from 'react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Avatar } from '@chakra-ui/avatar';
import { ChatState } from '../../Context/chatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import ChatLoading from './ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';

export default function SideDrawer() {
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const { user ,setSelectedChat, chats,setChats} = ChatState();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const handleLogOut = () => {
        localStorage.removeItem('userinfo');
        navigate('/');
    }

    const handleSearch= async()=>{
        if(!search)
        {
            toast({
                title:"Please enter something in Search",
                status:"warning",
                duration:2000,
                isClosable:true,
                position:'bottom-left'
            })
            return;
        }
        setLoading(true);
        try {
            
            const config = {
                headers:{
                    Authorization:user.token
                }
            }
            const {data} = await axios.get(`http://localhost:5000/api/user?search=${search}`,config);
            setSearchResult(data);
        } catch (error) {
            toast({
                title:error.message,
                status:"error",
                duration:2000,
                isClosable:true,
                position:'bottom-left'
            })
        }
        setLoading(false);
    }

    const handleChange=(e)=>{
        setSearch(e.target.value);
    }

    const accessChat=async(userId)=>{
        setLoadingChat(true);
        try{
            const config = {
                headers:{
                    'Content-type':'application/json',
                    Authorization:user.token
                }    
            }
            const {data} = await axios.post('http://localhost:5000/api/chat',{userId},config);
            console.log("Chats : ",chats);
            console.log("Data : ",data);
            if(!chats.find(c=>{return c._id === data._id}))
            {
                console.log(chats);
                setChats([data,...chats]);
            }
            setSelectedChat(data);
            onClose();  
        } catch (error) {
            toast({
                title:error.message,
                status:"error",
                duration:2000,
                isClosable:true,
                position:'bottom-left'
            })
        }
        setLoadingChat(false);
    }

    return (<>
        <Box display='flex' justifyContent='space-between' alignItems='center' bg='white' w='100%' p='5px 10px 5px 10px' borderWidth='5px' color='black'>
            <Tooltip label='Search users to chat' hasArrow placement='bottom-end'>
                <Button variant='ghost' onClick={onOpen}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <Text display={{ base: 'none', md: 'flex' }} px='4'>Search User</Text>
                </Button>
            </Tooltip>
            <Text fontSize='2xl' fontFamily='Work Sans'>Talk-A-Tive</Text>
            <div><Menu>
                <MenuButton p='1'><BellIcon fontSize='2xl' m='1' /></MenuButton>
            </Menu><Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}><Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} /></MenuButton>
                    <MenuList>
                        <ProfileModal user={user}>
                            <MenuItem>My Profile</MenuItem>
                        </ProfileModal>
                        <MenuDivider></MenuDivider>
                        <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                    </MenuList>
                </Menu></div>
            <Drawer placement='left' onClose={onClose} isOpen={isOpen} >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box display='flex' pb={2}>
                            <Input placeholder="Search by name or Email" mr={2} value={search} onChange={handleChange}></Input>
                            <Button type='submit'
                             onClick={handleSearch}
                            >Go</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading/>
                        ):(
                            searchResult.map((user)=>{
                                return (<UserListItem key={user.email} user={user} handleFunction={()=>{accessChat(user._id)}}/>)
                            })
                        )}
                        {loadingChat && <Spinner ml='auto' display='flex'/>}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    </>)
}
