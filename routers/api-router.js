const apiRouter = require("express").Router();
const articleRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");
const endpointsRouter = require("./endpoints-router");

apiRouter.get("/", (req, res) => {
  res.status(200).send("All OK from API Router");
});

apiRouter.use("/api", endpointsRouter);
apiRouter.use("/api/articles", articleRouter);
apiRouter.use("/api/comments", commentsRouter);
apiRouter.use("/api/topics", topicsRouter);
apiRouter.use("/api/users", usersRouter);

module.exports = apiRouter;
