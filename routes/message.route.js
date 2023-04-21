const express = require('express');
const { authenticate } = require('../middlewares/authentication.middleware');
const { MessageModel } = require('../model/message.model');
const { UserModel } = require('../model/user.model');

const messageRouter = express.Router();


messageRouter.get("/receive/:id", authenticate, async(req,res)=>{
    const {id} = req.params;
     try {
    const messages = await MessageModel.find({ chat: id })
      .populate("sender", "name email")
      .populate("chat");
    res.send(messages);
  } catch (error) {
    res.send({status:'error'})
    console.log(error);
  }
});

messageRouter.post("/send",authenticate, async(req,res)=>{
    const {userId,msg,chatId} = req.body;
    try {
      //   let newMsg = new MessageModel({ chat: chatId, msg, sender: userId });
      //  await newMsg.save();
      //  let message = await MessageModel.find()
      //    .populate("sender")
      //    .populate("chat")
      //    .populate({
      //      path: "chat.users"
      //    });
       let message = await MessageModel.create({
         chat: chatId,
         msg,
         sender: userId,
       });

       message = await message.populate("sender");
       message = await message.populate("chat");
       message = await UserModel.populate(message, {
         path: "chat.users",
         select: "name email",
       });
         res.send(message)
    } catch (error) {
        res.send({status:'error',msg:error});
        console.log(error);
    }
})

module.exports={
    messageRouter
}