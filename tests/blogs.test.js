const supertest = require("supertest");
const app = require("../index.js");
const api = supertest(app);
const Blog = require("../models/blog");

beforeAll(async () => {
  await Blog.remove({});
});

describe("GET /api/blogs ", async () => {
  test("get when no response", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body.length).toBe(0);
  });
  test("get when one response", async () => {
    await new Blog({
      title: "Test",
      author: "Test",
      url: "www",
      likes: 0
    }).save();
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body.length).toBe(1);
  });
});

describe("POST /api/blogs ", async () => {
  test("create new one", async () => {
    await api
      .post("/api/blogs")
      .send({
        title: "Test",
        author: "Test",
        url: "www",
        likes: 0
      })
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body.length).toBe(2);
  });
  test("create new one without likes", async () => {
    await api
      .post("/api/blogs")
      .send({
        title: "Test",
        author: "Test",
        url: "www"
      })
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
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
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body.length).toBe(3);
  });
  test("create new one without url", async () => {
    await api
      .post("/api/blogs")
      .send({
        title: "Titlee",
        author: "Test"
      })
      .expect(400);
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body.length).toBe(3);
  });
});
