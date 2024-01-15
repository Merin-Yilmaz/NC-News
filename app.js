const express = require('express');
const fs = require("fs/promises");
const { getAllTopics } = require('./controllers/topics.controllers');

const app = express();
app.use(express.json());

app.get('/api/topics', getAllTopics);


app.use((err, req, res, next) => {
    console.log(err);
    res
    .status(500)
    .send({ msg: 'Internal Server Error'})
})

module.exports = app;