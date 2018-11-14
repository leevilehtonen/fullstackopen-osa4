const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogsRouter.get("", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    adult: 1
  });
  response.json(blogs);
});

blogsRouter.post("", async (request, response) => {
  try {
    const blog = new Blog(request.body);

    const decodedToken = jwt.verify(request.token, "SUPERSECRET123");

    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" });
    }

    const user = await User.findById(decodedToken.id);

    blog.user = user._id;

    if (blog.title === undefined || blog.url === undefined) {
      return response.status(400).end();
    }

    const saved = await blog.save();
    user.blogs = user.blogs.concat(saved._id);
    await user.save();
    response.status(201).json(saved);
  } catch (exception) {
    if (exception.name === "JsonWebTokenError") {
      response.status(401).json({ error: exception.message });
    } else {
      console.log(exception);
      response.status(500).json({ error: "something went wrong..." });
    }
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findByIdAndDelete(id);
  if (blog) {
    response.status(204).end();
  } else {
    response.status(404).end();
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const blog = await Blog.findByIdAndUpdate(request.params.id, request.body, {
    new: true
  });
  if (blog) {
    return response.json(blog);
  } else {
    return response.status(400).send({ error: "malformatted id" });
  }
});

module.exports = blogsRouter;
