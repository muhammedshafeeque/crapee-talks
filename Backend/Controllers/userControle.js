const res = require("express/lib/response");
const User = require("../Models/userModel");
const commons = require("../Config/common_functions");
const becrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
module.exports = {
  register: async (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: "Pleas Enter all the fields" });
    } else {
      const userExist = await User.findOne({ email });
      if (userExist) {
        res.status(400).json({ error: "user already exist" });
      } else {
        let user = await User.create({
          name,
          email,
          password: await becrypt.hash(password, 10),
          pic,
        });
        if (user) {
          res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: commons.generateToken(user._id),
          });
        } else {
          res.status(400).json({ error: "Faild To create This user" });
        }
      }
    }
  },
  doLogin: async (req, res) => {
  
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "email and Password Required" });
    } else {
      let user = await User.findOne({ email });
      if (user) {
        await becrypt.compare(password, user.password).then((status) => {
          if (status) {
            res.status(201).json({
              _id: user._id,
              name: user.name,
              email: user.email,
              pic: user.pic,
              token: commons.generateToken(user._id),
            });
          } else {
            res
              .status(400)
              .json({ error: "Pleas check your email and password" });
          }
        });
      } else {
        res.status(400).json({ error: "Pleas check your email and password" });
      }
    }
  },
  allUers: asyncHandler(async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    
    const users = await User.find(keyword).find({_id:{$ne:req.user._id}});
    res.json(users);
  }),


};