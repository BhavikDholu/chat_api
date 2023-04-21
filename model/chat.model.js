const mongoose = require('mongoose');


const chatSchema = mongoose.Schema({
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  isGroup: {
    type: Boolean,
    default: false,
  },
  groupName: String,
  Admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
},{
    timestamps : true
});

const ChatModel = mongoose.model("chat",chatSchema);



module.exports = {
    ChatModel
}