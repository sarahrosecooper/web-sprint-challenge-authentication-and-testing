const db = require("../data/dbConfig.js");
const server = require("./server.js");
const request = require("supertest");

// Write your tests here

test("sanity", () => {
  expect(true).toBe(false);
});

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db("users").truncate();
});

afterAll(async () => {
  await db.destroy();
});

describe("testing each endpoint x2", () => {
  //
  describe("2 tests for /api/jokes", () => {
    let res;
    beforeAll(async () => {
      res = await request(server).get("/api/jokes");
    });
    test("returns 401", () => {
      expect(res.status).toBe(401);
    });
    test("body returns 'token required' ", () => {
      expect(res.body).toEqual({ message: "token required" });
    });
  });

  describe("2 tests for api/auth/register", () => {
    let body;
    const registration = { username: "sarah", password: "kitty" };

    test("receives 201 response", async () => {
      body = await request(server)
        .post("/api/auth/register")
        .send(registration);
      expect(body.status).toBe(201);
    });
    test("body.body.username should be 'sarah' ", async () => {
      expect(body.body.username).toEqual("sarah");
    });
  });

  describe("2 tests for api/auth/login", () => {
    let nextBody;
    const loginInfo = { username: "sarah", password: "kitty" };

    test("status to be 200", async () => {
      await request(server).post("/api/auth/register").send(loginInfo);
      nextBody = await request(server).post("/api/auth/login").send(loginInfo);
      expect(nextBody.status).toBe(200);
    });
    test("nextBody.message should equal 'welcome sarah' ", async () => {
      expect(nextBody.body.message).toEqual("welcome sarah");
    });
  });
});
