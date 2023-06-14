import {createContext, useState,useEffect, useContext} from 'react'
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({children}) =>{
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const [selectedChat,setSelectedChat] = useState();
    const [chats,setChats] = useState([]);
    const [notification,setNotification] = useState([]);

    useEffect(() => {
        const userdata = JSON.parse(localStorage.getItem('userinfo'));
        setUser(userdata);
        if(userdata)
        {
            navigate('/chats');
        }
        // eslint-disable-next-line
    }, [])
    return(
        <ChatContext.Provider value={{user,setUser,setSelectedChat,selectedChat,chats,setChats,notification,setNotification}}>{children}</ChatContext.Provider>
    )
}

export const ChatState=()=>{
    return (useContext(ChatContext));
}

export default ChatProvider;