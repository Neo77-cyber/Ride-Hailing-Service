const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
require('dotenv').config()

jest.setTimeout(30000);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});


const authToken = process.env.TEST_AUTH_TOKEN


describe("tests", () => {
  test("GET /api/v1/bookstore", async () => {
    let res = await supertest(app).get("/api/v1/bookstore")
    .set("Authorization", `Bearer ${authToken}`)
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeTruthy();
  });
});
