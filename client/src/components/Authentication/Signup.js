import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

export default function Signup() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [pic, setPic] = useState("");
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast()
  const navigate = useNavigate();
  
  const handleClick = () => { setShow(!show); }
  const handleClickConfirm = () => { setShowConfirm(!showConfirm); }
  const postDetails = async (photo) => {
    setLoading(true);
    if (photo === undefined) {
      toast({
        title: 'Please select an Image!',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: "bottom"
      })
      setLoading(false);
    }
    else if (photo.type === "image/jpeg" || photo.type === "image/png" || photo.type === "image/jpg") {
      setPic(photo);
    }
    else {
      toast({
        title: 'Please select an Image!',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: "bottom"
      })
    }
    setLoading(false);
  }

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPass) {
      toast({
        title: 'Please select all the Fields!',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: "bottom"
      })
    }
    else if (password !== confirmPass) {
      toast({
        title: 'Passwords does not match!',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: "bottom"
      })
    }
    else {
      try {
        const res = await axios.post('http://localhost:5000/api/user', { name, email, password }, 
        { header: 
          { "Content-type": "application/json" } 
        })
        if(pic)
        {
          const fdata = new FormData();
          fdata.append("file", pic);
          fdata.append("upload_preset", "talk-a-tive");
          fdata.append("cloudName", "dzsldctdl");
          const uploadImage = await fetch("https://api.cloudinary.com/v1_1/dzsldctdl/image/upload", {
            method: "POST",
            body: fdata
          })
          const {url} = await uploadImage.json();
          await axios.put(`http://localhost:5000/api/user/${res.data._id}`,{pic:url},{
            header:
            {
              "Content-type":"application/json"
            }
          });
          res.data.pic=uploadImage;
        }
        toast({
          title: "Registration Successfull",
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: "bottom"
        })
        localStorage.setItem('userinfo',JSON.stringify(res.data));
        navigate('/chats');
      }
      catch (error) {
        console.log("Error: ",error);
        toast({
          title: error.response.data,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: "bottom"
        })
      }
    }
    setLoading(false);
    setPic(null);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPass("");
  }

  return (
    <VStack spacing='5px' color="black">
      <FormControl id='first-name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type={"text"}
          placeholder='Enter your name'
          onChange={(e) => { setName(e.target.value) }}
          value={name}>
        </Input>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type={"email"}
          placeholder='Enter your email'
          onChange={(e) => { setEmail(e.target.value) }}
          value={email}>
        </Input>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder='Enter your password'
            onChange={(e) => { setPassword(e.target.value) }}
            value={password}>
          </Input>
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>{show ? "Hide" : "Show"}</Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={showConfirm ? "text" : "password"}
            placeholder='Confirm your password'
            onChange={(e) => { setConfirmPass(e.target.value) }}
            value={confirmPass}>
          </Input>
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClickConfirm}>{showConfirm ? "Hide" : "Show"}</Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl >
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => { postDetails(e.target.files[0]) }}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >Signup</Button>
    </VStack>
  )
}
