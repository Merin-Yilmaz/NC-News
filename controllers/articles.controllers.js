// controller

const {
  fetchArticleById,
  fetchAllArticles,
  fetchCommentsByArticleId,
  checkArticleExists,
  insertComment
} = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const articleExist = checkArticleExists(article_id);
    const fetchComment = fetchCommentsByArticleId(article_id);

    Promise.all([fetchComment, articleExist])
    .then((result) => {
        const comments = result[0]
        res.status(200).send({  comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
    const newComment = req.body;
    const { article_id } = req.params;

    checkArticleExists(article_id)
    .then(() => {
        return insertComment(article_id, newComment)
    })
    .then((comment) => {
        res.status(201).send({ insertedComment: comment })
    })
    .catch((err) => {
        next(err)
    })
}