initialBlogs = [
  {
    title: "Test",
    author: "Test",
    url: "www",
    likes: 123
  }
];

const deleteFields = (blog, fields) => {
  fields.forEach(field => {
    delete blog[field];
  });
  return blog;
};

module.exports = {
  initialBlogs,
  deleteFields
};
