const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const endpointsFile = require("../endpoints.json");

afterAll(() => {
  return db.end();
});

// 1. GET /api/topics

describe("GET /api/topics", () => {
  test("1. GET: 200 Returns an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics).toBeInstanceOf(Array);
        expect(response.body.topics).toHaveLength(3);
        response.body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

// // 2. GET /api

describe("GET /api", () => {
  test("1. Returns the endpoints.json object describing all the available endpoints on your API", () => {
    return request(app)
      .get("/api")
      .then((response) => {
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.endpoints).toMatchObject(endpointsFile);
      });
  });
});

// 3. GET /api/articles/:article_id

describe("GET /api/articles/:article_id", () => {
  test("1. GET: 200 sends an article object by its id with the correct properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("2. GET: 404 responds with an error message when given a non-existent article ID", () => {
    return request(app)
      .get("/api/articles/888")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found");
      });
  });
  test("2. GET: 400 responds with an error message when given a non numeric ID", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
