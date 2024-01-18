const express = require("express");
const fs = require("fs/promises");
const { getAllTopics } = require("./controllers/topics.controllers");
const { getApiEndpoints } = require("./controllers/api.controllers");
const {
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  postComment,
  patchVotes,
  deleteComment,
  getAllUsers,
} = require("./controllers/articles.controllers");

const app = express();
app.use(express.json());

app.get("/api/topics", getAllTopics);
app.get("/api", getApiEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/users", getAllUsers);

app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/articles/:article_id", patchVotes);
app.delete("/api/comments/:comment_id", deleteComment);

// psql errors
app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "42P01") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "not found" });
});

// promise rejection in models
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

// server errors
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
