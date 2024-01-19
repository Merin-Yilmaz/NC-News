const {
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  postComment,
  patchVotes } = require("../controllers/articles.controllers");

const articleRouter = require("express").Router();

articleRouter.route("/").get(getAllArticles);

articleRouter.route("/:article_id").get(getArticleById).patch(patchVotes);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postComment);

module.exports = articleRouter;
