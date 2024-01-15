const express = require('express');
const fs = require("fs/promises");
const { getAllTopics } = require('./controllers/topics.controllers');
const { getApiEndpoints } = require('./controllers/api.controllers')

const app = express();
app.use(express.json());

app.get('/api/topics', getAllTopics);
app.get('/api', getApiEndpoints);

app.use((err, req, res, next) => {
    console.log(err);
    res
    .status(500)
    .send({ msg: 'Internal Server Error'})
})

module.exports = app;