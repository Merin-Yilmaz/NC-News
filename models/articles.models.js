// models
const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
    let queryStr = `SELECT articles.*, 
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id 
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`

  return db
    .query(queryStr, [article_id])
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

exports.fetchAllArticles = (sort_by = "created_at", order = "desc") => {
  let queryStr = `SELECT articles.article_id, articles.title,
    articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, CAST(count(comments.comment_id) AS INTEGER)
    AS comment_count FROM articles 
    LEFT JOIN comments
    ON articles.article_id=comments.article_id 
    GROUP BY articles.article_id`;

  const validSortQueries = ["created_at", "topic"];
  const validOrderQueries = /\b(?:asc|desc)\b/i;


  if (!validSortQueries.includes(sort_by) || !validOrderQueries.test(order)) {
    return Promise.reject({ status: 400, msg: "Invalid query" });
  }

  queryStr += ` ORDER BY ${sort_by} ${order}`;

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

exports.checkUserExists = (username) => {
  return db
    .query(
      `
      SELECT *
      FROM users
      WHERE username = $1`,
      [username]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Username not found" });
      }
      return true;
    });
};

exports.insertComment = (article_id, newComment) => {
  const { username, body } = newComment;

  return db
    .query(
      `
    INSERT INTO comments (body, article_id, author)
    VALUES (
        $1,
        (SELECT article_id FROM articles WHERE article_id = $2),
        (SELECT username FROM users WHERE username = $3)
    )
    RETURNING *;`,
      [body, article_id, username]
    )
    .then(({ rows }) => {
      return rows[0];
    })
    .catch(() => {
      return Promise.reject({ status: 400, msg: "Bad request" });
    });
};

exports.updateVotes = (article_id, inc_votes) => {
  return db
    .query(
      `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows;
    })
    .catch(() => {
      return Promise.reject({ status: 400, msg: "Bad request" });
    });
};

exports.checkCommentExists = (comment_id) => {
  return db
    .query(
      `
      SELECT *
      FROM comments
      WHERE comment_id = $1`,
      [comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
      return true;
    });
};

exports.deleteCommentById = (comment_id) => {
  return db
    .query(
      `
    DELETE FROM comments
    WHERE comment_id = $1;`,
      [comment_id]
    )
    .then(() => {
      return "204 No Content";
    })
    .catch(() => {
      return Promise.reject({ status: 404, msg: "Comment not found" });
    })
    .catch(() => {
      return Promise.reject({ status: 400, msg: "Bad request" });
    });
};

exports.fetchAllUsers = () => {
  return db
    .query(
      `
    SELECT * FROM users`
    )
    .then(({ rows }) => {
      return rows;
    });
};
