var express= require('express')

const router =express.Router()
var MessageHelper=require('../Controllers/messageControle')
const { protect } = require('../middleware/authMiddleware')

router.post('/',protect,MessageHelper.sendMessage)
router.get('/:chatId',protect,MessageHelper.allMessages)
module.exports=router