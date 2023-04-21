const express = require('express');
const { authenticate } = require('../middlewares/authentication.middleware');
const { ChatModel } = require('../model/chat.model');


const chatRouter = express.Router();

chatRouter.post("/create/singlechat",authenticate, async(req,res)=>{
    const{oppUserId,userId} = req.body;

    const isChat = await ChatModel.find({
      isGroup: false,
      $and: [{ users: { $eq: userId } }, { users: { $eq: oppUserId } }],
    }).populate("users");

    if(isChat.length>0){
        res.send({data:isChat[0],msg:'chat is already open',status:'success'})
    }else{
        try {
            let newChat = await ChatModel.create({
              groupName: "NA",
              users: [userId, oppUserId],
            });
            const data = await ChatModel.findOne({
              _id: newChat._id,
            }).populate("users");
            res.send({
              data,
              msg: "chat is opened",
              status: "success",
            });
        } catch (error) {
            res.send({ status: "error", msg:"somthing went wrong" });
            console.log(error);
        }
    }
})

chatRouter.post("/create/groupchat",authenticate,async(req,res)=>{
   const {users,userId,groupName} = req.body;

   if(users && groupName){
    if(users.length>1){
        users.push(userId)
        
        try {
            const group = await ChatModel.create({
              isGroup: true,
              groupName,
              users,
              Admin: userId,
            });
            const groupDetail = await ChatModel.find({_id:group._id}).populate("users").populate("Admin");
            res.send({status:'success',msg:'group created successfully'});
        } catch (error) {
            res.send({status:'error'})
            console.log(error);
        }
    }else{
        res.send({ status: "info", msg: "group required more than 2 members" });
    }
   }else{
    res.send({status:"info",msg:"please provide details"})
   }
})

chatRouter.get("/get",authenticate, async(req,res)=>{
    const {userId} = req.body;

    try {
        const chat = await ChatModel.find({users : userId}).populate("users").populate("Admin")
        res.send(chat)
    } catch (error) {
        console.log(error);
        res.send({status:'error'})
    }
})


module.exports={
    chatRouter
}