const asyncHandler = require("express-async-handler");
const Chat = require("../Models/ChatModel");
const User = require("../Models/userModel");
module.exports = {
  accessChat: asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
      console.log("userId params not send with request");
      return res.sendStatus(400);
    }
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
      try {
        const createdChat = await Chat.create(chatData);
        const Fullchat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        res.status(200).send(Fullchat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    }
  }),

  fetchChat: asyncHandler(async (req, res) => {
    try {
      Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
          });
          res.status(200).send(results);
        });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }),
  createGrupe: asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Pleas Fill all the feilds" });
    }
    var users = JSON.parse(req.body.users);
    if (users.length < 2) {
      return res
        .status(400)
        .send("Morthan Two users are required to form a group chat ");
    }
    users.push(req.user);
    try {
      const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user,
      });
      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
      res.status(200).json(fullGroupChat);
    } catch (error) {
      res.status(400);
      res.send(error.message);
    }
  }),
  renameGroup: asyncHandler(async (req, res) => {
    const { chatName, chatId } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updatedChat) {
      res.status(404);
      throw new Error("Chat Not Found ");
    } else {
      res.json(updatedChat);
    }
  }),
  addtoGroup: asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const added = await     Chat.findByIdAndUpdate(
      chatId,
      {
        $push: {
          users: userId,
        },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!added) {
      res.status(404);
      throw new Error("Chat Not Found ");
    } else {
      res.json(added);
    }
  }),
  removeFromGroup: asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const removed =await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: {
          users: userId,
        },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!removed) {
      res.status(404);
      throw new Error("Chat Not Found ");
    } else {
      res.json(removed);
    }
  }),
};
