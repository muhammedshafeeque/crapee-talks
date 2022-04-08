import React, { useEffect } from "react";
import "./Home.css";
import {
  Container,
  Box,
  Text,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import Login from "../../Components/Login/Login";
import Signup from "../../Components/signup/Signup";
import { useNavigate } from "react-router-dom";
function Home() {
  const navigate=useNavigate()
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("userInfo"))
    if(user){
      navigate('/chat')
    }
  },[navigate])
  return (
    <Container max="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p="3"
        bg="white"
        width="100%"
        m="40px 0 15px 0 "
        borderRadius="lg"
        borderWidth="1px"   
      >
        <Text fontSize="4xl" color="black" fontFamily="-moz-initial">
          Crapee Talk
        </Text>
      </Box>
      <Box
        bg={"white"}
        w="100%"
        p={4}
        borderRadius="lg"
        color={"black"}
        borderWidth={"1px"}
      >
        <Tabs variant="soft-rounded">
          <TabList marginBottom={"1em"}>
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Home;
