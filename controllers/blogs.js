const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("", (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs);
  });
});

blogsRouter.post("", (request, response) => {
  const blog = new Blog(request.body);

  if (blog.title === undefined || blog.url === undefined) {
    return response.status(400).send();
  }

  blog.save().then(result => {
    response.status(201).json(result);
  });
});

module.exports = blogsRouter;
