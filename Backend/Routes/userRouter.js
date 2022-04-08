const express =require('express')
const router=express.Router()
const userControle=require('../Controllers/userControle')
const {protect}=require('../middleware/authMiddleware')
router.post('/register',userControle.register)
router.get('/all-users',protect,userControle.allUers)   
router.post('/login',userControle.doLogin)
module.exports=router