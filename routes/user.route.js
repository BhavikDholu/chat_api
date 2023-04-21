const express = require('express');
const { UserModel } = require('../model/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticate } = require('../middlewares/authentication.middleware');


const userRouter = express.Router();


userRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const exist = await UserModel.find({ email });
  if (exist.length > 0) {
    res.send({ msg: "user already exist", status: "warning" });
  } else {
    try {
      bcrypt.hash(password, 5, async (err, hash) => {
        const user = new UserModel({
          name,
          email,
          password: hash
        });
        await user.save();
        res.send({ msg: "Registered successfully", status: "success" });
      });
    } catch (err) {
      res.send({ msg: "Error in registering the user", status: "error" });
      console.log(err);
    }
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.find({ email });
    if (user.length > 0) {
      bcrypt.compare(password, user[0].password, function (err, result) {
        if (result) {
          const token = jwt.sign({ userID: user[0]._id }, "token");
          res.send({
            msg: "Login Successfull",
            detail: { token, name: user[0].name, email: user[0].email, id:user[0]._id },
            status: "success",
          });
        } else {
          res.send({ msg: "Wrong Credntials", status: "warning" });
        }
      });
    } else {
      res.send({ msg: "Wrong Credntials", status: "warning" });
    }
  } catch (err) {
    res.send({ msg: "Something went wrong", status: "error" });
    console.log(err);
  }
});

userRouter.get("/",authenticate, async(req,res)=>{
     try {
       const user = await UserModel.find();
       res.send(user);
     } catch (error) {
       res.send("something went wrong");
       console.log(error);
     }
})

module.exports = {
    userRouter
}
