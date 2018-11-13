const supertest = require("supertest");
const { app, server } = require("../index.js");
const api = supertest(app);
const User = require("../models/user");

const sampleUser = {
  username: "username",
  password: "123456",
  name: "test tester",
  adult: true
};

beforeAll(async () => {
  await User.remove({});
});

describe("POST /api/users ", async () => {
  test("create new one", async () => {
    await clean();
    await api
      .post("/api/users")
      .send(sampleUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const response = await getAll();
    expect(response.body.length).toBe(1);
    expect(response.body[0].username).toEqual(sampleUser.username);
  });
  test("create with too short password", async () => {
    await clean();
    sampleUser.password = "a";
    const response = await api
      .post("/api/users")
      .send(sampleUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    expect(response.body.error).toEqual("password too short");
  });
  test("create with duplicate name", async () => {
    await clean();
    sampleUser.password = "123456";
    await createOne();
    const response = await api
      .post("/api/users")
      .send(sampleUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    expect(response.body.error).toEqual("username already taken");
  });
});

afterAll(async () => {
  server.close();
});

const getAll = async () => {
  return await api
    .get("/api/users")
    .expect(200)
    .expect("Content-Type", /application\/json/);
};
const createOne = async () => {
  return await new User(sampleUser).save();
};
const clean = async () => {
  return await User.remove({});
};
