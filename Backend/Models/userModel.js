var mongoose = require("mongoose");
var becrypt = require("bcryptjs");
const userModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
      type: String,

      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    timestaps: true,
  }
);
// userModel.methods.matchPassword=async(enterdPassword)=>{
//   return await becrypt.compare(enterdPassword,this.password)
// }
// userModel.pre('save',async(next)=>{
//   if(!this.isModified){
//     next()
//   }
//   const salt =await  becrypt.genSalt(10)
//   this.password=await becrypt.hash(this.password,salt)
// })
const User = mongoose.model("User", userModel);
module.exports = User;
