// controller

const {
  fetchArticleById,
  fetchAllArticles,
  fetchCommentsByArticleId,
  checkArticleExists,
  insertComment,
  checkUserExists,
  updateVotes,
  deleteCommentById,
  checkCommentExists,
  fetchAllUsers,
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
  const { sort_by, order } = req.query;

  fetchAllArticles(sort_by, order)
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
      const comments = result[0];
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const newComment = req.body;
  const { article_id } = req.params;
  const userExist = checkUserExists(newComment.username);
  const articleExist = checkArticleExists(article_id);
  const insertCommentPromise = insertComment(article_id, newComment);

  Promise.all([userExist, articleExist, insertCommentPromise])
    .then((comment) => {
      res.status(201).send({ comment: comment[2] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  const patchPromises = [
    updateVotes(article_id, inc_votes),
    checkArticleExists(article_id),
  ];

  Promise.all(patchPromises)
    .then((votes) => {
      res.status(200).send({ votes: votes[0][0] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  const commentExist = checkCommentExists(comment_id);
  const deleteComment = deleteCommentById(comment_id);

  Promise.all([commentExist, deleteComment])
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};
