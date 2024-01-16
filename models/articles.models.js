// models
const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
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
    articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, count(comments.comment_id)
    AS comment_count FROM articles 
    JOIN comments
    ON articles.article_id=comments.article_id 
    GROUP BY articles.article_id`;

  queryStr += ` ORDER BY ${sort_by} DESC`;

  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};
