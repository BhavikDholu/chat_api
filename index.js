const express = require('express');
const cors = require('cors')
const { connection } = require('./config/db');
const { userRouter } = require('./routes/user.route');
const { chatRouter } = require('./routes/chat.route');
const { messageRouter } = require('./routes/message.route');

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/",(req,res)=>{
    res.send("welcome to chat app")
})

app.use("/user",userRouter);
app.use("/chat",chatRouter);
app.use("/message",messageRouter);

const createServer = app.listen(4500, async() => {
  try {
    await connection;
    console.log("connected to db");
  } catch (error) {
    console.log(error);
  }
  console.log("running port 4500");
});


const io = require("socket.io")(createServer, {
  cors: {
    origin: [
      "https://live-chat-app-beta.vercel.app/",
      "https://live-chat-app-beta.vercel.app/chat/",
    ],
  },
});

io.on("connection", (socket) => {
  console.log("connected to web socket");
  socket.on('create',(userData)=>{
    socket.join(userData.id)
    socket.emit("connected");
  })

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    const chat = newMessageRecieved.chat;
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
});

