const userRouter = require("express").Router();
const User = require("../models/user");
var bcrypt = require("bcryptjs");

userRouter.get("", async (request, response) => {
  let users = await User.find({});
  users = users.map(user => ({
    _id: user._id,
    username: user.username,
    name: user.name,
    adult: user.adult
  }));
  return response.json(users);
});

userRouter.post("", async (request, response) => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(request.body.password, salt);
  const user = await new User({
    username: request.body.username,
    name: request.body.name,
    adult: request.body.adult,
    passwordHash
  }).save();
  response.json(user);
});

module.exports = userRouter;
