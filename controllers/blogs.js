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
    return response.status(400).end();
  }

  blog.save().then(result => {
    response.status(201).json(result);
  });
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
