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
import io from 'socket.io-client'

const ENDPOINT = "http://localhost:5000";
var socket,selectedChatCompare;

export default function SingleChat({fetchAgain,setFetchAgain}) {
    const toast = useToast();
    const {user,selectedChat,setSelectedChat,notification,setNotification} = ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage,setNewMessage] = useState("");
    const [socketConnected,setSocketConnected] = useState(false);
    const [typing,setTyping] = useState(false);
    const [isTyping,setIsTyping] = useState(false);
    
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
            socket.emit("join chat",selectedChat._id)
        } catch (error) {
            toast({
                title:error.message,
                status:"error",
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
            socket.emit("stop typing",selectedChat._id);
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
                socket.emit("new message",data);
                setMessages([...messages,data]);
            } catch (error) {
                toast({
                    title:error.message,
                    status:"error",
                    duration:2000,
                    isClosable:true,
                    position:"bottom-left"
                })
            }
        }
    }
    
    useEffect(()=>{
        socket = io(ENDPOINT);
        socket.emit("setup",user);
        socket.on("connected",()=>{setSocketConnected(true)});
        socket.on("typing",()=>{setIsTyping(true)})
        socket.on("stop typing",()=>{setIsTyping(false)})
    },[])

    useEffect(() => {
        fetchMessages();
        selectedChatCompare=selectedChat;
    }, [selectedChat])
    
    useEffect(()=>{
        socket.on("message recieved",(newMessage)=>{
            if(!selectedChatCompare || selectedChatCompare._id !== newMessage.chat._id)
            {
                if(!notification.includes(newMessage))
                {
                    setNotification([newMessage,...notification]);
                    setFetchAgain(!fetchAgain);
                }
            }
            else
            {
                setMessages([...messages,newMessage]);
            }
        });
    })
    
    const typingHandler=(e)=>{
        setNewMessage(e.target.value);
        if(!socketConnected)return;
        if(!typing)
        {
            setTyping(true);
            socket.emit("typing",selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        let timerLength = 2000;
        setTimeout(()=>{
            let timeNow = new Date().getTime();
            let timeDiff= timeNow - lastTypingTime;
            if(timeDiff>=timerLength && typing)
            {
                socket.emit("stop typing",selectedChat._id);
                setTyping(false);
            }
        },timerLength);
    }

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
                {isTyping?<div><lottie-player src="https://assets2.lottiefiles.com/private_files/lf30_ibig1tjo.json"  background="transparent"  speed="1"  style={{width:"60px",height:"30px"}}  loop autoplay></lottie-player></div>:<></>}
                <Input variant="filled" bg="#E0E0E0" placeholder='Enter a message....' value={newMessage} onChange={typingHandler}></Input>
            </FormControl>
        </Box>
        </>)
        :(<><Box display="flex" alignItems='center' justifyContent="center" h='100%'>
        <Text fontSize='3xl' pb={3} fontFamily="Work sans">Click on a user to start chatting.</Text></Box></>)}
    </>
  )
}
