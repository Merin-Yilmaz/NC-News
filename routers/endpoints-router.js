const endpointsRouter = require("express").Router();
const { getApiEndpoints } = require("../controllers/api.controllers");

endpointsRouter.route("/").get(getApiEndpoints);
module.exports = endpointsRouter;
