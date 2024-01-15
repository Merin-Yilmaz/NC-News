const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");

afterAll(() => {
  return db.end();
});

// 1. GET /api/topics

describe("GET /api/topics", () => {
  test("1. GET 200: Returns an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics).toBeInstanceOf(Array);
        response.body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

// 2. GET /api

describe("GET /api", () => {
  test("1. Returns the endpoints.json object describing all the available endpoints on your API", () => {
    return request(app)
      .get("/api")
      .then((response) => {
        expect(response.body).toBeInstanceOf(Object);
        Object.keys(response.body).forEach((endpoint) => {
          expect(response.body[endpoint]).toHaveProperty("description", expect.any(String));
          expect(response.body[endpoint]).toHaveProperty("queries", expect.any(Array));
          expect(response.body[endpoint]).toHaveProperty("exampleResponse", expect.any(Object));
        });
      });
  });
});
