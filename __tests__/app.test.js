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
