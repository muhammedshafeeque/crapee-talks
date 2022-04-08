import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from 'axios'
import  {useNavigate} from 'react-router-dom'

function Signup() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPasssword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate()
  const toast = useToast();
  const handleClick = () => {
    setShow(!show);
  };
  const postDetails = (pic) => {
    setLoading(true);
    if (pic === undefined) {
      toast({
        title: "Pleas choos an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false)
      return;
    }
    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "crapee");
      fetch("https://api.cloudinary.com/v1_1/crapee/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
    
          setPic(data.url);
          
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Pleas choos an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false)
      return;
    }
  };
  const submitHandler = async() => {
    setLoading(true)
    if(!name||!password||!confirmPassword||!email){
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
      const {data}=await axios.post("/api/user/register",{name,email,password,pic},config)
      toast({
        title: "Sugnup Successfull",
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
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => {
            e.preventDefault();
            setName(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id="#email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => {
            e.preventDefault();
            setEmail(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id="#password" isRequired>
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
            <Button h="1.75rem " size={"sm"} onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Confirm Your Password"
            type={show ? "text" : "password"}
            onChange={(e) => {
              e.preventDefault();
              setConfirmPassword(e.target.value);
            }}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h="1.75rem " size={"sm"} onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type={"file"} 
          p="1.5"
          accept="image/*"
          onChange={(e) => {
            postDetails(e.target.files[0]);
          }}
        />
      </FormControl>

      <Button
        colorScheme={"blue"}
        width="100%"
        isLoading={loading}
        style={{ marginTop: 15 }}
        onClick={submitHandler}
      >
        {" "}
        Sign Up
      </Button>
    </VStack>
  );
}

export default Signup;
