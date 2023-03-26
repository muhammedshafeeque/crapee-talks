import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from 'axios'
import  {useNavigate} from 'react-router-dom'

function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPasssword] = useState();
  const [loading,setLoading]=useState(false)
  const navigate=useNavigate()
  const toast = useToast();
  const handleClick = () => {
    setShow(!show);
  };
  const submitHandler = async() => {
    setLoading(true)
    if(!password||!email){
      toast({
        title: "Pleas enter all fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",

      });
      setLoading(false)
      return
    }
    try{
      const config={
        headers:{
          "Content-type":"application/json"
        }
        
      }
      const {data}=await axios.post("/api/user/login",{email,password},config)
      toast({
        title: "Login Successfull",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",

      });
      localStorage.setItem("userInfo",JSON.stringify(data))
      navigate('/chat')
      setLoading(false)
      
    }catch(error){
      toast({
        title: "Error Occured!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",

      });
      setLoading(false  )
    }
  };
  return (
    <VStack spacing={"5px"} color="black">
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => {
            e.preventDefault();
            setEmail(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Enter Your Password"
            type={show ? "text" : "password"}
            onChange={(e) => {
              e.preventDefault();
              setPasssword(e.target.value);
            }}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h="1.75rem " size={"sm"} isLoading={loading} onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme={"blue"}
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
      >
        Login
      </Button>
      {/* <Button
      variant={'solid'}
        colorScheme={"red"}
        width="100%"
        style={{ marginTop: 15 }}
          isLoading={loading}
        onClick={()=>{
            setEmail('guest@example.com')
            setPasssword('123456789')
        }}
      >
        Get Guest user Creditionals
      </Button> */}
    </VStack>
  );
}

export default Login;
