const userRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");

userRouter.get("", async (request, response) => {
  let users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    likes: 1
  });
  users = users.map(user => ({
    _id: user._id,
    username: user.username,
    name: user.name,
    adult: user.adult,
    blogs: user.blogs
  }));
  return response.json(users);
});

userRouter.post("", async (request, response) => {
  if (request.body.password.length <= 3) {
    return response.status(400).json({ error: "password too short" });
  }
  const existing = await User.findOne({ username: request.body.username });
  if (existing) {
    return response.status(400).json({ error: "username already taken" });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(request.body.password, salt);
  const user = await new User({
    username: request.body.username,
    name: request.body.name,
    adult: request.body.adult === undefined ? true : request.body.adult,
    passwordHash
  }).save();
  response.json(user);
});

module.exports = userRouter;
