const express = require("express");
const dotenv=require("dotenv")
const chats=require('./Data/Data')
const connectDB=require('./Config/db')
const colors=require('colors')
const userRouter=require('./Routes/userRouter')
const chatRouter=require('./Routes/chatRouter')
const messageRouter=require('./Routes/messageRouter')
const {notFound,errorHandler} =require('./middleware/errorMiddleware');
const path =require('path')
dotenv.config()
connectDB()
const app = express();  
app.use(express.json())



app.get("/api/chat/:id",(req,res)=>{

})
app.use('/api/user',userRouter)
app.use('/api/chat',chatRouter)
app.use('/api/message',messageRouter)
// -------------Deployement ------------------
const __dirname1=path.resolve()
if(process.env.NODE_ENV==='production'){
  app.use(express.static(path.join(__dirname1,'/frondend/build')))
  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname1,"frondend","build","index.html"))
  })
}else{
  app.get('/',(req,res)=>{
    res.json("Api is running")
  })
}
// -------------Deployement ------------------
app.use(notFound)
app.use(errorHandler)
const PORT=process.env.PORT||5000
const Server= app.listen(PORT, () => { 
  console.log("Server running".yellow.bold);
});
const io=require('socket.io')(Server,{ 
  pingTimeout:60000,
  cors:{
    origin:"https://gippme.online" 
  }
})
 
io.on("connection",(socket)=>{
  console.log('connected to Socket.io')
  socket.on('setup',(userData)=>{
    socket.join(userData._id)
    socket.emit('connected')
  })

  socket.on("join chat",(room)=>{
    socket.join(room)
    console.log("User Joind Room :" + room)
  })
  socket.on('new message',(newMessageRecived)=>{
    
    var chat =newMessageRecived.chat 
    if(!chat.users) return console.log('chat.users not defined')
    chat.users.forEach(user=>{
      if(user._id==newMessageRecived.sender._id) return 
      socket.in(user._id).emit("message recieved",newMessageRecived)
    })
  })
})
