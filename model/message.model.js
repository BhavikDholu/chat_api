const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    chat : {type:mongoose.Schema.Types.ObjectId, ref:"chat"},
    msg : String,
    sender : {type : mongoose.Schema.Types.ObjectId, ref:"user"}
},{
    timestamps:true
})

const MessageModel = mongoose.model("message",messageSchema);

module.exports={
    MessageModel
}