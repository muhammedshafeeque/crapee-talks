import { Box, Button, Stack, useToast,Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading  from '../ChatLoading/ChatLoading'
import {getSender} from '../../Config/ChatLogic'
import GroupeChatModal from "../Miscellaneous/groupChatModal/GroupeChatModal";
function MyChats({fetchAgain}) {
  const [loggedUser, setLogedUser] = useState();
  const { user, setSelectedChat, chat, setChat, selectedChat } = ChatState();
  const toast = useToast();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChat(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    setLogedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    
  }, [fetchAgain]);
  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box 
        pb={3}
        px={3}
        fontSize={{ base: "18px", md: "22px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupeChatModal>
        <Button
          d="flex"
          fontSize={{ base: "17px", md: "10px", lg: "17px" }}
          rightIcon={<AddIcon />}
        >
          New Groupe
        </Button>
        </GroupeChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >

        {chat?<Stack overflowY={'scroll'}>
            {chat.map((single)=>{
             return <Box
              onClick={() => setSelectedChat(single)}
                cursor="pointer"
                bg={selectedChat === single ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === single ? "white " : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={single._id}
              >
                <Text>
                  
                  {!single.isGroupChat?getSender(loggedUser,single.users):single.chatName}
                </Text>
              </Box>
            })}
        </Stack>:(
          <ChatLoading/>
        )}
      </Box>
    </Box>
  );
}

export default MyChats;
