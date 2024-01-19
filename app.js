const express = require("express");
const fs = require("fs/promises");
const apiRouter = require("./routers/api-router");


const app = express();
app.use(express.json());

app.use('/', apiRouter);

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
    console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
