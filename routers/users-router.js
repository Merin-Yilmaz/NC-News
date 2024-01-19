const usersRouter = require('express').Router();
const {  getAllUsers,
} = require("../controllers/articles.controllers");

usersRouter
.route('/')
.get(getAllUsers)


  module.exports = usersRouter;