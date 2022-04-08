import { useDisclosure } from '@chakra-ui/hooks'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  Input,
  Box,
  
} from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { ChatState } from '../../../Context/ChatProvider'
import UserBadgeItem from '../../userAvathar/UserBadgeItem/UserBadgeItem'
import UserListItem from '../../userAvathar/UserLIstItem/UserListItem'
import {FormControl} from '@chakra-ui/form-control'
function GroupeChatModal({children}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupchatName,setGroupeChatName]=useState()
  const [selectedUsers,setSelectedUsers]=useState([])
  const [search,setSearch]=useState("")
  const [searchResults,setSearchResults]=useState()
  const [loading,setLoading]=useState()
  const toast =useToast()
  const {user,chat,setChat} = ChatState()
  const handleGroup=(userToAdd)=>{
  
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  } 
  const handleSearch=async(query)=>{
    setSearch(query)
    if(!query){
       return 
    }
    try{
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data}=await axios.get(`/api/user/all-users?search=${query}`,config)
    
      setSearchResults(data)
      setLoading(false)
    }catch(error){
      toast({
        title: "Error Occured",
        description:"Failed To Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",

      });
    }
  }
  const handleDelete=(delUser)=>{
  
    setSelectedUsers(selectedUsers.filter((sel)=>sel._id !==delUser._id))
  }
  const handleSubmit=async()=>{
    if(!groupchatName||!selectedUsers){
      toast({
        title: "Pleas Fill All the Field",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",

      });
      return
    }
    try{
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data}=await axios.post('/api/chat/group',{
        name:groupchatName,
        users: JSON.stringify(selectedUsers.map((u) => u._id))
      },config)

      setChat([data,...chat])
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return
    }catch(error){
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }
 
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          
          d='flex'
          justifyContent={'center'}
          >Create Groupe Chat </ModalHeader>
          <ModalCloseButton />
            <ModalBody d={'flex'} flexDirection='column' alignItems={'center'}>
              <FormControl>
                <Input placeholder='Group Name' mb={3} onChange={(e)=>{
                  setGroupeChatName(e.target.value)

                }} 
              />
              </FormControl>
              <FormControl>
                <Input placeholder='Add users:' mb={1} onChange={(e)=>{
                  handleSearch(e.target.value)

                }} 
                value={search}/>
              </FormControl>
              <Box  w='100%' d='flex' flexWrap={'wrap'}>
              {selectedUsers.map((u)=>{
                return <UserBadgeItem key={u._id} user={u} handleFunction={()=>handleDelete(u)} />
              })}
              </Box>
              
              {loading?<div>Loading..</div>:(
                searchResults?.slice(0,4).map((User)=>{
                  return <UserListItem key={User._id} user={User} handleFunction={()=>handleGroup(User)}/>
                })
              )}
            </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue'  onClick={handleSubmit}>
              Create
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupeChatModal