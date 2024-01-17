// models
const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT * 
    FROM articles 
    WHERE article_id = $1;`,
      [article_id]
    )
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "No article found",
        });
      }
      return article;
    });
};

exports.fetchAllArticles = (sort_by = "created_at") => {
  let queryStr = `SELECT articles.article_id, articles.title,
    articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, CAST(count(comments.comment_id) AS INTEGER)
    AS comment_count FROM articles 
    LEFT JOIN comments
    ON articles.article_id=comments.article_id 
    GROUP BY articles.article_id`;

  queryStr += ` ORDER BY ${sort_by} DESC`;

  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query(
      `
    SELECT *
    FROM articles
    WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return true;
    });
};

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments 
    WHERE comments.article_id = $1
    ORDER BY created_at ASC`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertComment = (article_id, newComment) => {
  const { username, body } = newComment;

  return db
    .query(`
    INSERT INTO comments (body, article_id, author)
    VALUES (
        $1,
        (SELECT article_id FROM articles WHERE article_id = $2),
        (SELECT username FROM users WHERE username = $3)
    )
    RETURNING *;`, [body, article_id, username])
      .then(({ rows }) => {
        return rows[0]
      })
      .catch(() => {
        return Promise.reject({ status: 400, msg: "Bad request"})
      })
  };