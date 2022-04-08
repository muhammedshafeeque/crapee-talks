import { Box } from "@chakra-ui/react"
import { useState } from "react"
import ChatBox from "../../Components/ChatBox/ChatBox"
import SideDrawer from "../../Components/Miscellaneous/SideDrawer/SideDrawer"
import MyChats from "../../Components/MyChats/MyChats"
import { ChatState } from "../../Context/ChatProvider"
import './chat.css'
function Chat() {
   const {user}= ChatState()
   const [fetchAgain,setFetchAgain]=useState(false)
   
  return (

    <div className="chat_Home_page">
      {user&&<SideDrawer/>}
      <Box className="master_Box" >
        {user&&(<MyChats fetchAgain={fetchAgain} />)}
        {user&&(<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>) }
      </Box>
    </div>
  )
}

export default Chat