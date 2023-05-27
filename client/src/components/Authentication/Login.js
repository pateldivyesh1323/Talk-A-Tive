import React,{useState} from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = () => {setShow(!show);}
  const submitHandler = async() => {
    setLoading(true);
    if(!email || !password)
    {
      toast({
        title: 'Please enter Credentials!',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: "bottom"
      })
    }
    else
    {
      try{
        const res = await axios.post('http://localhost:5000/api/user/login',{email,password},{
          header:{
            "Content-type":"application/json"
          }
        })
        localStorage.setItem('userinfo',JSON.stringify(res.data));
        toast({
          title: 'Login Successfull',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: "bottom"
        })
        navigate('/chats'); 
      }
      catch(error)
      {
        console.log("Error:",error);
      }
    }
    setLoading(false);
  }

  return (
    <VStack spacing='5px' color="black">
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
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >Login</Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={()=>{
          setEmail("guest@example.com");
          setPassword("password");
        }}
      >Get Guest User Credentials</Button>
    </VStack>
  )
}
