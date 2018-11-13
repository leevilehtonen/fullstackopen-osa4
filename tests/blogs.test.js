const supertest = require("supertest");
const { app, server } = require("../index.js");
const api = supertest(app);
const Blog = require("../models/blog");
const { initialBlogs, deleteFields } = require("./test_helper");

beforeAll(async () => {
  await Blog.remove({});
});

describe("GET /api/blogs ", async () => {
  test("get when no response", async () => {
    const response = await getAll();
    expect(response.body.length).toBe(0);
  });
  test("get when one response", async () => {
    await createOne();
    const response = await getAll();
    expect(response.body.length).toBe(1);
  });
});

describe("POST /api/blogs ", async () => {
  test("create new one", async () => {
    await clean();
    await api
      .post("/api/blogs")
      .send(initialBlogs[0])
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const response = await getAll();
    expect(response.body.length).toBe(1);
  });
  test("create new one without likes", async () => {
    await api
      .post("/api/blogs")
      .send(deleteFields(initialBlogs[0], ["likes"]))
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const response = await getAll();
    expect(response.body[response.body.length - 1].likes).toBe(0);
  });
  test("create new one without title", async () => {
    await api
      .post("/api/blogs")
      .send({
        author: "Test",
        url: "www"
      })
      .expect(400);
    const response = await getAll();
    expect(response.body.length).toBe(2);
  });
  test("create new one without url", async () => {
    await api
      .post("/api/blogs")
      .send({
        title: "Titlee",
        author: "Test"
      })
      .expect(400);
    const response = await getAll();
    expect(response.body.length).toBe(2);
  });
});

describe("DELETE /api/blogs ", async () => {
  test("delete one existing", async () => {
    await clean();
    await createOne();
    const response = await getAll();
    const blog = response.body[0];
    await api.delete("/api/blogs/" + blog._id).expect(204);
  });
  test("delete with invalid id", async () => {
    await createOne();
    const response = await getAll();
    const blog = response.body[0];
    blog._id = blog._id.substring(0, blog._id.length - 3) + "aaa";
    await api.delete("/api/blogs/" + blog._id).expect(404);
  });
});
describe("PUT /api/blogs ", async () => {
  test("update one existing", async () => {
    await clean();
    await createOne();
    let response = await getAll();
    const blog = response.body[0];
    response = await api
      .put("/api/blogs/" + blog._id)
      .send({ title: "jessss" })
      .expect(200);
    expect(response.body.title).not.toEqual(blog.title);
  });
});

afterAll(async () => {
  server.close();
});

const getAll = async () => {
  return await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
};

const createOne = async () => {
  return await new Blog(initialBlogs[0]).save();
};

const clean = async () => {
  return await Blog.remove({});
};
