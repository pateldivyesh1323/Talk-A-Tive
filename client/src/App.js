import React from 'react';
import './App.css';
import {Routes, Route, useLocation } from "react-router-dom";
import HomePage from './Pages/HomePage';
import ChatPage from './Pages/ChatPage';
import ChatProvider from './Context/chatProvider';

export default function App() {

  const location = useLocation();

  return (
    <div className="App">
        <ChatProvider>
          <Routes> 
            <Route path='/' element={<HomePage key={location.pathname}/>} />
            <Route path='/chats' element={<ChatPage key={location.pathname}/>} />
          </Routes>
        </ChatProvider>
    </div>
  );
}
