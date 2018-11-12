const dummy = blogs => 1;

const totalLikes = blogs => {
  let sum = 0;
  blogs.forEach(blog => {
    sum += blog.likes;
  });
  return sum;
};

module.exports = {
  dummy,
  totalLikes
};
