import React, { useState } from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  IconButton,
  useToast,
  Input,
  Box,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../../Context/ChatProvider";
import UserListItem from "../../userAvathar/UserLIstItem/UserListItem";
import UserBadgeItem from "../../userAvathar/UserBadgeItem/UserBadgeItem";
import { FormControl } from "@chakra-ui/form-control";
import axios from "axios";
function UpdateGeoupeChatModal({fetchMessage, fetchAgain, setFetchAgain }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [groupchatName, setGroupeChatName] = useState();
  const [selectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState();
  const [loading, setLoading] = useState();
  const [renameLoading, setRenameLoading] = useState();
  const toast = useToast();

  const handleAddUser =async (user1) => {
    console.log('running')
    if (selectedChat.users.find((u)=>u._id===user1._id)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if(selectedChat.groupAdmin._id!==user._id){
      toast({
        title: "only Admin Can add someOne",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return
    }

    try{
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data}=await axios.put('/api/chat/groupeadd',{
        chatId:selectedChat._id,
        userId:user1._id
      },config)
      setSelectedChat(data)
      
      setFetchAgain(!fetchAgain)
      setLoading(false)
    }catch(error){
      toast({
        title: "error occured ",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return
    }
  };
  const handleremove = async(user1) => {
    if(selectedChat.groupAdmin._id!==user._id&&user1._id!==user._id){
      toast({
        title: "Only Admin can remove Someone! ",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      
    }
    try{
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data}=await axios.put('/api/chat/grouperemove',{
        chatId:selectedChat._id,
        userId:user1._id
      },config)
      user1._id===user._id? setSelectedChat():setSelectedChat(data)
      setLoading(false)
      fetchMessage()
      setFetchAgain(!fetchAgain)
       
    }catch(error){
      toast({
        title: "Error occured ",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false)
      return
      
    }
  };
  const handleRename=async ()=>{
    if(!groupchatName) return
    try{
        setRenameLoading(true)
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const {data}=await axios.put('/api/chat/rename',{
          chatId:selectedChat._id, 
          chatName:groupchatName
        },config)

        setSelectedChat(data)
        setFetchAgain(!fetchAgain)
        setRenameLoading(false)
    }catch(error){
      toast({
        title: "Error Occured",
        description:error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      renameLoading(false)
    }
  }
  
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/user/all-users?search=${query}`,
        config
      );

      setSearchResults(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed To Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader d="flex" justifyContent={"center"}>
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ModalBody d={"flex"} flexDirection="column" alignItems={"center"}>
              <Box d="flex" flexWrap={"wrap"}>
                {selectedChat.users.map((u) => {
                  return (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      handleFunction={() => handleremove(u)}
                    />
                  );
                })}
              </Box>
              <FormControl d='flex'>
                <Input
                  placeholder="Group Name"
                  mb={3}
                  onChange={(e) => {
                    setGroupeChatName(e.target.value);
                  }}
                />
                <Button
                variant={'solid'}
                colorScheme='teal'
                isLoading={renameLoading}
                ml={1}
                onClick={handleRename}
                >
                  Update
                </Button>
              </FormControl>
              <FormControl>
                <Input
                  placeholder="Add user to groupe"
                  mb={1}
                  onChange={(e) => {
                    handleSearch(e.target.value);
                  }}
                  value={search}
                />
              </FormControl>
              <Box w="100%" d="flex" flexWrap={"wrap"}>
                {selectedUsers.map((u) => {
                  return (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      handleFunction={() => handleremove(u)}
                    />
                  );
                })}
              </Box>

              {loading ? (
                <div>Loading..</div>
              ) : (
                searchResults?.slice(0, 4).map((User) => {
                  return (
                    <UserListItem
                      key={User._id}
                      user={User}
                      handleFunction={() => handleAddUser(User)}
                    />
                  );
                })
              )}
            </ModalBody>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={()=>handleremove(user)}>
              Leave  from Groupe
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateGeoupeChatModal;
