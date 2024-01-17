const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const endpointsFile = require("../endpoints.json");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

// 1. GET /api/topics

describe("GET /api/topics", () => {
  test("1. GET: 200 Returns an array of topic objects with the correct properties", () => {
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
        expect(article).toMatchObject({
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
        expect(body.msg).toBe("Bad request");
      });
  });
});

// 4. GET /api/articles

describe("GET /api/articles", () => {
  test("1. GET: 200 Returns an array of article objects with the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        body.articles.forEach((article) => {
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(Number));
        });
      });
  });
  test("2. GET: 200 check body property is not present on any of the article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article.body).toBe(undefined);
        });
      });
  });
  test("3. GET: 200 articles should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

// 5. GET /api/articles/:article_id/comments

describe("GET /api/articles/:article_id/comments", () => {
  test("1. GET: 200 returns an array of comments for the given article_id with the correct properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(11);
        response.body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("article_id", expect.any(Number));
        });
      });
  });
  test("2. GET: 200 comments should be sorted by date in ascending order", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { ascending: true });
      });
  });
  test("3. GET: 200 should respond with an empty array if article id exists but there are no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("4. GET: 404 responds with an error message when given a non-existent article ID", () => {
    return request(app)
      .get("/api/articles/888/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("5. GET: 400 responds with an error message when given a non numeric ID", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

// 6. POST /api/articles/:article_id/comments

describe("POST /api/articles/:article_id/comments", () => {
  test("1. POST: 201 should add a comment with a username for a given article_id with the correct object properties", () => {
    const commentToAdd = {
      username: "rogersop",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(commentToAdd)
      .expect(201)
      .then(({ body }) => {
        expect(body.insertedComment).toMatchObject({
          comment_id: 19,
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
          votes: 0,
          author: "rogersop",
          article_id: 5,
          created_at: expect.any(String),
        });
      });
  });
  test("2. POST: 400 responds with an error message when posting missing properties", () => {
    const commentToAdd = {
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(commentToAdd)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("3. POST: 400 responds with an error message when username doesn't exist", () => {
    const commentToAdd = {
      username: "chuckles",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(commentToAdd)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("4. POST: 400 responds with an error message when given a non-numeric ID for article_id", () => {
    const commentToAdd = {
      username: "chuckles",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    };
    return request(app)
      .post("/api/articles/banana/comments")
      .send(commentToAdd)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("5. POST: 404 responds with an error message when given a non-existent ID for article_id", () => {
    const commentToAdd = {
      username: "chuckles",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    };
    return request(app)
      .post("/api/articles/888/comments")
      .send(commentToAdd)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});
